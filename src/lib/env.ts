/**
 * Centralized environment variable access with startup warnings.
 *
 * Required vars are warned about at import time (not erroring, since the
 * site has graceful degradation for missing GitHub token and SMTP creds).
 */

function checkEnv(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV !== 'test') {
    console.warn(`[env] Missing environment variable: ${name}`);
  }
  return value ?? '';
}

export const env = {
  GITHUB_TOKEN: checkEnv('GITHUB_TOKEN'),
  SMTP_EMAIL: checkEnv('SMTP_EMAIL'),
  SMTP_PASSWORD: checkEnv('SMTP_PASSWORD'),
  ALLOWED_CONTACT_ORIGINS: process.env.ALLOWED_CONTACT_ORIGINS ?? '',
} as const;
