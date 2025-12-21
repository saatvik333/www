// Centralized social links and contact info
// Update these values to change links across the entire site

export const SITE_CONFIG = {
  name: 'saatvik333',
  url: 'https://saatvik333.dev',
  email: 'saatvik333sharma@gmail.com',
  description: 'my website/portfolio/blog.',
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
