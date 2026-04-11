import { MetadataRoute } from 'next';
import { getAllBlogs, getAllProjects } from '@/lib/content';

import { SITE_CONFIG } from '@/lib/config';

const SITE_URL = SITE_CONFIG.url;

/**
 * Get the most recent date from all content for cache-busting
 * This prevents sitemap timestamp churn when content hasn't changed
 */
function getContentLastModified(): Date {
  const blogs = getAllBlogs();
  const projects = getAllProjects();

  const dates = [
    ...blogs.map(b => new Date(b.date).getTime()),
    ...projects.map(p => p.date ? new Date(p.date).getTime() : 0),
  ];

  const maxDate = Math.max(...dates, 0);
  return maxDate > 0 ? new Date(maxDate) : new Date('2025-01-01');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getAllBlogs();
  const projects = getAllProjects();
  const lastModified = getContentLastModified();

  // Static pages - use content-derived timestamp
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/pics`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Project pages
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: project.date ? new Date(project.date) : new Date('2025-01-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...projectPages];
}
