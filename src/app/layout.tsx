import type { Metadata } from 'next';
import { jetbrainsMono, inter } from '@/lib/fonts';
import { NavigationProvider } from '@/context/NavigationContext';
import { ClientLayout } from '@/components/layout/ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'saatvik333',
    template: '%s | saatvik333',
  },
  description: 'my website/portfolio/blog.',
  keywords: ['developer', 'portfolio', 'blog', 'web development'],
  authors: [{ name: 'saatvik333' }],
  creator: 'saatvik333',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://saatvik333.dev',
    siteName: 'saatvik333',
    title: 'saatvik333',
    description: 'my website/portfolio/blog.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'saatvik333',
    description: 'my website/portfolio/blog.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <head>
        {/* DNS Prefetch for faster external resource loading */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preconnect for critical external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#121218" />
      </head>
      <body>
        <NavigationProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NavigationProvider>
      </body>
    </html>
  );
}

