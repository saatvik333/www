import { getAllBlogs } from '@/lib/content';
import { SITE_CONFIG } from '@/lib/config';

const SITE_URL = SITE_CONFIG.url;

/**
 * Get the most recent blog date for feed lastBuildDate
 * This prevents feed timestamp churn when content hasn't changed
 */
function getFeedLastBuildDate(): Date {
  const blogs = getAllBlogs();
  if (blogs.length === 0) {
    return new Date('2025-01-01');
  }
  // Blogs are already sorted by date (newest first)
  return new Date(blogs[0].date);
}

export async function GET() {
  const blogs = getAllBlogs();

  // getAllBlogs already filters invalid dates, but extra safety check
  const validBlogs = blogs.filter(blog => !isNaN(new Date(blog.date).getTime()));

  const lastBuildDate = getFeedLastBuildDate();

  const rssItems = validBlogs
    .map((blog) => {
      const safeTitle = blog.title.replace(/]]>/g, ']]]]><![CDATA[>');
      const safeDescription = (blog.description || '').replace(/]]>/g, ']]]]><![CDATA[>');

      return `
    <item>
      <title><![CDATA[${safeTitle}]]></title>
      <link>${SITE_URL}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${blog.slug}</guid>
      <description><![CDATA[${safeDescription}]]></description>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>saatvik333 blog</title>
    <link>${SITE_URL}</link>
    <description>blog posts from saatvik.me</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
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
