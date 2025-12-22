import { IBM_Plex_Mono } from 'next/font/google';

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-mono',
  weight: ['400', '600'],
});
