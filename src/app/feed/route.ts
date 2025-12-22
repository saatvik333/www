import { getAllBlogs } from '@/lib/content';
import { SITE_CONFIG } from '@/lib/config';

const SITE_URL = SITE_CONFIG.url;

export async function GET() {
  const blogs = getAllBlogs();

  const rssItems = blogs
    .map((blog) => {
      return `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${SITE_URL}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${blog.slug}</guid>
      <description><![CDATA[${blog.description}]]></description>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>saatvik333 blog</title>
    <link>${SITE_URL}</link>
    <description>blog posts from saatvik.xyz</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
