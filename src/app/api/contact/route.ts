import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SITE_CONFIG } from '@/lib/config';

interface ContactFormData {
  name: string;
  email?: string;
  message: string;
}

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

export async function POST(request: NextRequest) {
  try {
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

    const body: ContactFormData = await request.json();

    // Validate required fields (email is now optional)
    if (!body.name || !body.message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Prepare email content (sanitize for HTML to prevent XSS)
    const safeName = escapeHtml(body.name);
    const safeEmail = body.email ? escapeHtml(body.email) : 'Not provided';
    const safeMessage = escapeHtml(body.message);
    const replyInfo = body.email ? `\n\nReply to: ${body.email}` : '\n\n(No email provided)';

    const mailOptions = {
      from: smtpEmail,
      to: SITE_CONFIG.email,
      subject: `Contact Form: ${body.name}`,
      text: `Name: ${body.name}${replyInfo}\n\nMessage:\n${body.message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g, '<br>')}</p>
        <hr />
        <p><small>Sent from saatvik.xyz contact form</small></p>
      `,
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
