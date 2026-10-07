import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { MAX_CONTACT_BODY_BYTES } from '@/lib/contact-limits';
const { sendMail, checkLimit } = vi.hoisted(() => ({ sendMail: vi.fn(), checkLimit: vi.fn() }));
vi.mock('nodemailer', () => ({ default: { createTransport: () => ({ sendMail }) } }));
vi.mock('@/lib/contact-rate-limit', () => ({ checkContactRateLimit: checkLimit }));
import { POST } from '@/app/api/contact/route';
function request(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest('https://saatvik.me/api/contact', { method: 'POST', headers: { origin: 'https://saatvik.me', 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('SMTP_EMAIL', 'fixture@example.com');
  vi.stubEnv('SMTP_PASSWORD', 'fixture');
  checkLimit.mockResolvedValue({ allowed: true });
  sendMail.mockResolvedValue({});
});
afterEach(() => vi.unstubAllEnvs());
describe('contact handler', () => {
  it('rejects whitespace-only required fields without sending email', async () => {
    expect((await POST(request({ name: '   ', message: '\n ' }))).status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });
  it('normalizes fields, preserves message line breaks and escapes HTML', async () => {
    expect((await POST(request({ name: ' Alice ', email: ' alice@example.com ', message: ' <b>Hello</b>\nthere ' }))).status).toBe(200);
    const mail = sendMail.mock.calls[0][0];
    expect(mail.subject).toBe('💬 Alice');
    expect(mail.replyTo).toBe('alice@example.com');
    expect(mail.html).toContain('&lt;b&gt;Hello&lt;/b&gt;<br>there');
  });
  it('accepts an omitted or whitespace-only optional email', async () => {
    expect((await POST(request({ name: 'Alice', email: ' ', message: 'Hello' }))).status).toBe(200);
    expect(sendMail.mock.calls[0][0].replyTo).toBeUndefined();
  });
  it('rejects bad Origin even when Referer is allowed, without consuming rate budget', async () => {
    expect((await POST(request({}, { origin: 'https://evil.example', referer: 'https://saatvik.me/contact' }))).status).toBe(403);
    expect(checkLimit).not.toHaveBeenCalled();
  });
  it('returns 429 with Retry-After and never sends email', async () => {
    checkLimit.mockResolvedValue({ allowed: false, retryAfter: 42 });
    const response = await POST(request({ name: 'Alice', message: 'Hello' }));
    expect(response.status).toBe(429); expect(response.headers.get('retry-after')).toBe('42');
    expect(sendMail).not.toHaveBeenCalled();
  });
  it('fails closed when the shared rate limiter is unavailable', async () => {
    checkLimit.mockRejectedValue(new Error('unavailable'));
    expect((await POST(request({ name: 'Alice', message: 'Hello' }))).status).toBe(503);
    expect(sendMail).not.toHaveBeenCalled();
  });
  it('bounds bodies even when Content-Length is missing', async () => {
    expect((await POST(request({ name: 'Alice', message: 'x'.repeat(MAX_CONTACT_BODY_BYTES) }))).status).toBe(413);
    expect(sendMail).not.toHaveBeenCalled();
  });
  it('rejects oversized bodies from their declared length', async () => {
    expect((await POST(request({}, { 'content-length': String(MAX_CONTACT_BODY_BYTES + 1) }))).status).toBe(413);
  });
  it.each([null, [], { name: 3, message: 'Hi' }, { name: 'Alice', message: 'Hi', email: 'invalid' }, { name: 'Alice', message: 'x'.repeat(5001) }])('rejects invalid input %j', async body => {
    expect((await POST(request(body))).status).toBe(400); expect(sendMail).not.toHaveBeenCalled();
  });
  it('rejects malformed JSON', async () => {
    const req = new NextRequest('https://saatvik.me/api/contact', { method: 'POST', headers: { origin: 'https://saatvik.me', 'content-type': 'application/json' }, body: '{' });
    expect((await POST(req)).status).toBe(400);
  });
  it('silently discards honeypot submissions', async () => {
    expect((await POST(request({ name: 'Bot', message: 'Spam', website: 'filled' }))).status).toBe(200);
    expect(sendMail).not.toHaveBeenCalled();
  });
  it('reports SMTP failure without exposing server errors', async () => {
    sendMail.mockRejectedValue(new Error('fixture failure'));
    const response = await POST(request({ name: 'Alice', message: 'Hello' }));
    expect(response.status).toBe(500); expect(await response.text()).not.toContain('fixture failure');
  });
});
