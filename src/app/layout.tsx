import type { Metadata } from 'next';
import { ibmPlexMono } from '@/lib/fonts';
import { SITE_CONFIG, SOCIAL_PROFILES, COLORS } from '@/lib/config';
import { ClientLayout } from '@/components/layout/ClientLayout';
import './globals.css';
import './highlight.css';

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
        url: '/og.png', // Fallback to a static generic OG image if no specific one
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
    images: ['/og.png'],
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
  alternates: {
    canonical: '/',
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_CONFIG.name,
    // startUpImage: [], // valid startup images would go here if available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
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
                  image: `${SITE_CONFIG.url}/og.png`,
                  sameAs: SOCIAL_PROFILES,
                  jobTitle: 'Software Engineer',
                  description: 'Saatvik Sharma is a software engineer focused on building clean, scalable, and reliable applications. Works across the full stack with TypeScript, Go, and Rust.',
                },
              ],
            }),
          }}
        />

        {/* DNS Prefetch for faster external resource loading */}
        <link rel="dns-prefetch" href="https://api.github.com" />

        {/* Preconnect for critical external domains */}
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />

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
