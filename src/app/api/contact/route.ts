import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SITE_CONFIG, COLORS } from '@/lib/config';

interface ContactFormData {
  name: string;
  email?: string;
  message: string;
  website?: string; // Honeypot field
}

// Rate limiting: in-memory store (resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 3;

// Input length limits
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

// Escape HTML entities to prevent XSS in emails
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

// Get client IP from request
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

// Check rate limit
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Cleanup old entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }

  record.count++;
  return { allowed: true };
}

// Validate origin/referer
function validateOrigin(request: NextRequest): boolean {
  const referer = request.headers.get('referer');
  const origin = request.headers.get('origin');

  const allowedDomains = [
    'saatvik.me',
    'www.saatvik.me',
    'localhost',
    '127.0.0.1',
  ];

  const checkDomain = (url: string | null): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      return allowedDomains.some(domain =>
        parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  };

  return checkDomain(referer) || checkDomain(origin);
}

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
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
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

    // Validate SMTP credentials before proceeding
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
      console.error('SMTP_EMAIL or SMTP_PASSWORD environment variables are not set');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Create transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const body: any = await request.json();

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

    // Cast the safely checked body back into the interface
    const safeBody = body as ContactFormData;

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

    const mailOptions = {
      from: smtpEmail,
      to: SITE_CONFIG.email,
      replyTo: safeBody.email || undefined,
      subject: `💬 ${safeBody.name.trim()}`,
      text: `Name: ${safeBody.name}${replyInfo}\n\nMessage:\n${safeBody.message}\n\n---\nSent: ${timestamp}\nIP: ${clientIP}`,
      html: generateEmailHTML(safeName, safeEmail, safeMessage, timestamp, clientIP),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
