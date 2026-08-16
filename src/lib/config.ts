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
  SOCIAL_LINKS.linkedin,
] as const;

// Centralized colors - keep in sync with globals.css :root variables.
// Source of truth is the BBlack design system (~/.bblack/colors.json).
export const COLORS = {
  bg: '#000000', // canvas
  bgSecondary: '#171717', // surfaceRaised
  bgTertiary: '#1f1f1f', // surfacePressed
  text: '#f7f7f8',
  textMuted: '#c7c7c7',
  textDim: '#8e8e8e', // textSubtle
  textBright: '#ffffff',
  border: '#2f2f2f',
  accent: '#3584e4',
  error: '#ef4444', // danger
  success: '#22c55e',
} as const;
