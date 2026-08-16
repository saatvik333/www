import type { Metadata } from 'next';
import { jetbrainsMono } from '@/lib/fonts';
import { SITE_CONFIG, SOCIAL_PROFILES, COLORS } from '@/lib/config';
import { ClientLayout } from '@/components/layout/ClientLayout';
import './globals.css';
import './highlight.css';

// Token-driven fallback OG image (robots.ts disallows /api/, but social
// crawlers fetch og:image URLs directly and are unaffected)
const FALLBACK_OG_IMAGE = `/api/og?title=${encodeURIComponent('Saatvik Sharma')}&description=${encodeURIComponent('I build software')}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Saatvik Sharma',
    'saatvik333',
    'forward deployed engineer',
    'forward-deployed engineer',
    'software engineer',
    'linux',
    'full-stack developer',
    'creative developer',
    'typescript',
    'rust',
    'go',
    'india',
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: FALLBACK_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    creator: '@saatvik333',
    images: [FALLBACK_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_CONFIG.name,
    // startUpImage: [], // valid startup images would go here if available
  },

  icons: {
    // ?v=2 cache-busts the immutable 1-year favicon cache when the mark changes
    icon: [{ url: '/icon.svg?v=2', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon' }],
  },

  // Machine-readable feed discovery for crawlers/readers
  alternates: {
    types: {
      'application/rss+xml': '/feed',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_CONFIG.url}/#website`,
                  url: SITE_CONFIG.url,
                  name: SITE_CONFIG.name,
                  description: SITE_CONFIG.description,
                  publisher: {
                    '@id': `${SITE_CONFIG.url}/#person`,
                  },
                },
                {
                  '@type': 'Person',
                  '@id': `${SITE_CONFIG.url}/#person`,
                  name: 'Saatvik Sharma',
                  givenName: 'Saatvik',
                  familyName: 'Sharma',
                  alternateName: 'saatvik333',
                  url: SITE_CONFIG.url,
                  email: SITE_CONFIG.email,
                  sameAs: SOCIAL_PROFILES,
                  jobTitle: 'Forward Deployed Engineer',
                  description:
                    'Saatvik Sharma is a forward deployed engineer who builds and ships software in the field — full-stack systems, Linux tooling, and automation that solve real problems.',
                  knowsAbout: [
                    'TypeScript',
                    'Go',
                    'Rust',
                    'C',
                    'Linux',
                    'Wayland',
                    'Next.js',
                    'Node.js',
                    'Docker',
                    'CI/CD',
                    'Neovim',
                    'automation',
                  ],
                  image: `${SITE_CONFIG.url}${FALLBACK_OG_IMAGE}`,
                },
              ],
            }),
          }}
        />

        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Saatvik Sharma's Blog" href="/feed" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={COLORS.bg} />
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
