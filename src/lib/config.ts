// Centralized social links and contact info
// Update these values to change links across the entire site

export const SITE_CONFIG = {
  name: 'saatvik333',
  url: 'https://saatvik.me',
  email: 'saatvik333sharma@gmail.com',
  description: 'Portfolio of Saatvik Sharma, a software engineer who enjoys linux and solving problems with software.',
} as const;

export const SOCIAL_LINKS = {
  github: 'https://github.com/saatvik333',
  twitter: 'https://x.com/saatvik333',
  linkedin: 'https://linkedin.com/in/saatvik333',
  discord: 'https://discord.com/users/759799916658163803',
  discordHandle: 'adder_death',
} as const;

// For structured data and SEO
export const SOCIAL_PROFILES = [
  SOCIAL_LINKS.github,
  SOCIAL_LINKS.twitter,
] as const;

// Centralized colors - sync these with globals.css :root variables
export const COLORS = {
  bg: '#171717',
  bgSecondary: '#333333',
  text: '#ededed',
  textMuted: '#c4c4c4',
  textDim: '#a0a0a0',
  textBright: '#ffffff',
  border: '#333333',
  accent: '#ef4444',
} as const;
