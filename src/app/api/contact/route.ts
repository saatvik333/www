import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SITE_CONFIG, COLORS } from '@/lib/config';
import {
  escapeHtml,
  getClientIP,
  validateOrigin,
  createRateLimiter,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  MAX_NAME_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
} from '@/lib/contact-utils';

/**
 * Contact form handler with multi-layer anti-abuse:
 *
 * 1. Strict Content-Type check (rejects non-JSON)
 * 2. Rate limiting (3 requests per 5 minutes per IP)
 *    Note: in-memory store is best-effort -- resets on serverless cold start
 * 3. Origin validation (requires Origin or Referer from allowed domains)
 * 4. Honeypot field (silently rejects bot submissions)
 * 5. Runtime input validation with length caps and type checks
 * 6. HTML escaping for email output
 *
 * Nodemailer transport is lazily initialized at module scope to reuse
 * connection pools across requests.
 */

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (_transporter) return _transporter;
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;
  if (!smtpEmail || !smtpPassword) return null;
  _transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: smtpEmail, pass: smtpPassword },
  });
  return _transporter;
}

interface ContactFormData {
  name: string;
  email?: string;
  message: string;
  website?: string; // Honeypot field
}

// Module-scoped rate limiter instance
const rateLimiter = createRateLimiter({
  windowMs: RATE_LIMIT_WINDOW_MS,
  maxRequests: RATE_LIMIT_MAX_REQUESTS,
});

// Generate clean HTML email matching site's markdown aesthetic
function generateEmailHTML(name: string, email: string, message: string, timestamp: string, ip: string): string {
  const messageLines = message.replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Message</title>
</head>
<body style="margin: 0; padding: 24px; background-color: ${COLORS.bg}; font-family: 'IBM Plex Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace; font-size: 14px; line-height: 1.7; color: ${COLORS.textMuted};">
  <div style="max-width: 560px; margin: 0 auto;">
    
    <!-- Header -->
    <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid ${COLORS.border};">
      <h1 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 600; color: ${COLORS.text};">${name}</h1>
      <p style="margin: 0; font-size: 13px; color: ${COLORS.textDim};">${email !== 'Not provided' ? `<a href="mailto:${email}" style="color: ${COLORS.accent}; text-decoration: none;">${email}</a>` : '<span style="color: ' + COLORS.textDim + ';">no email provided</span>'}</p>
    </div>
    
    <!-- Message -->
    <div style="padding: 16px 0 16px 16px; border-left: 3px solid ${COLORS.accent}; margin-bottom: 24px; color: ${COLORS.text};">
      ${messageLines}
    </div>
    
    <!-- Footer -->
    <div style="padding-top: 16px; border-top: 1px solid ${COLORS.border}; font-size: 12px; color: ${COLORS.textDim};">
      <span>${timestamp}</span>
      <span style="margin: 0 8px;">·</span>
      <span>saatvik.me/contact</span>
      <span style="margin: 0 8px;">·</span>
      <span style="opacity: 0.6;">${ip}</span>
    </div>
    
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  // Strict Content-Type check: reject non-JSON requests early
  if (request.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  // Get client IP for rate limiting
  let clientIP: string;
  try {
    clientIP = getClientIP(request);
  } catch {
    clientIP = 'unknown';
  }

  // Check rate limit
  const rateLimit = rateLimiter.check(clientIP);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.` },
      { status: 429 }
    );
  }

  // Validate origin
  if (!validateOrigin(request)) {
    return NextResponse.json(
      { error: 'Invalid request origin' },
      { status: 403 }
    );
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.error('SMTP_EMAIL or SMTP_PASSWORD environment variables are not set');
    return NextResponse.json(
      { error: 'Email service is not configured' },
      { status: 500 }
    );
  }

  // Parse JSON body separately from SMTP operations
  // This ensures malformed JSON returns 400, not 500
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  // Validate body structure and field types at runtime
  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }

  if (body.name !== undefined && typeof body.name !== 'string') {
    return NextResponse.json({ error: 'Invalid name format' }, { status: 400 });
  }
  if (body.email !== undefined && typeof body.email !== 'string') {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }
  if (body.message !== undefined && typeof body.message !== 'string') {
    return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
  }
  if (body.website !== undefined && typeof body.website !== 'string') {
    return NextResponse.json({ error: 'Invalid website format' }, { status: 400 });
  }

  const safeBody: ContactFormData = {
    name: body.name as string,
    message: body.message as string,
    ...(body.email !== undefined && { email: body.email as string }),
    ...(body.website !== undefined && { website: body.website as string }),
  };

  // Honeypot check - if website field is filled, it's likely a bot
  if (safeBody.website) {
    // Silently reject but return success to not reveal honeypot
    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  }

  // Validate required fields
  if (!safeBody.name || !safeBody.message) {
    return NextResponse.json(
      { error: 'Name and message are required' },
      { status: 400 }
    );
  }

  // Validate input lengths
  if (safeBody.name.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: `Name must be ${MAX_NAME_LENGTH} characters or less` },
      { status: 400 }
    );
  }
  if (safeBody.email && safeBody.email.length > MAX_EMAIL_LENGTH) {
    return NextResponse.json(
      { error: `Email must be ${MAX_EMAIL_LENGTH} characters or less` },
      { status: 400 }
    );
  }
  if (safeBody.message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` },
      { status: 400 }
    );
  }

  // Validate email format if provided
  if (safeBody.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(safeBody.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
  }

  // Prepare email content (sanitize for HTML to prevent XSS)
  const safeName = escapeHtml(safeBody.name.trim());
  const safeEmail = safeBody.email ? escapeHtml(safeBody.email.trim()) : 'Not provided';
  const safeMessage = escapeHtml(safeBody.message.trim());
  const replyInfo = safeBody.email ? `\n\nReply to: ${safeBody.email}` : '\n\n(No email provided)';

  // Generate timestamp
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  }) + ' IST';

  // Escape IP for HTML output (prevent header injection attacks)
  const safeIP = escapeHtml(clientIP);

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: SITE_CONFIG.email,
    replyTo: safeBody.email || undefined,
    subject: `💬 ${safeBody.name.trim()}`,
    text: `Name: ${safeBody.name}${replyInfo}\n\nMessage:\n${safeBody.message}\n\n---\nSent: ${timestamp}\nIP: ${clientIP}`,
    html: generateEmailHTML(safeName, safeEmail, safeMessage, timestamp, safeIP),
  };

  // Send email - wrap in try-catch to distinguish SMTP errors from other failures
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('SMTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: 'Message sent successfully!' },
    { status: 200 }
  );
}
