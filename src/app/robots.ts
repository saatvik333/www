import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/api/og'], // OG images are advertised as og:image and must be fetchable
      disallow: ['/api/'],
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
