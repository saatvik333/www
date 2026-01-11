import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

const contentDirectory = path.join(process.cwd(), 'content');
const projectsDirectory = path.join(contentDirectory, 'projects');
const blogsDirectory = path.join(contentDirectory, 'blogs');

// Project types
export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  stack?: string[];
  github?: string;
  site?: string;
  thumbnail?: string;
  images: string[];
}

export interface Project extends ProjectMeta {
  content: string;
}

// Blog types
export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  pinned?: boolean;
  readingTime: string;
}

export interface BlogPost extends BlogMeta {
  content: string;
}

// Get all project slugs (folder names)
export function getProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }
  return fs.readdirSync(projectsDirectory).filter((name) => {
    const fullPath = path.join(projectsDirectory, name);
    return fs.statSync(fullPath).isDirectory();
  });
}

// Get all blog slugs (file names without .md)
export function getBlogSlugs(): string[] {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(blogsDirectory)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
}

// Get project images for carousel (from content/projects/[slug]/images/)
function getProjectImages(slug: string): string[] {
  const imagesDir = path.join(projectsDirectory, slug, 'images');
  if (!fs.existsSync(imagesDir)) {
    return [];
  }
  const files = fs.readdirSync(imagesDir);
  return files
    .filter((file) => /\.(png|jpg|jpeg|webp|gif)$/i.test(file))
    .sort()
    .map((file) => `/api/content/projects/${slug}/images/${file}`);
}

// Check if project has a thumbnail (from content/projects/[slug]/)
function getProjectThumbnail(slug: string): string | undefined {
  const projectDir = path.join(projectsDirectory, slug);
  const possibleExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
  
  for (const ext of possibleExtensions) {
    const thumbnailPath = path.join(projectDir, `thumbnail.${ext}`);
    if (fs.existsSync(thumbnailPath)) {
      return `/api/content/projects/${slug}/thumbnail.${ext}`;
    }
  }
  return undefined;
}

// Get all projects metadata (for listing page)
export function getAllProjects(): ProjectMeta[] {
  const slugs = getProjectSlugs();
  
  const projects = slugs.map((slug) => {
    const indexPath = path.join(projectsDirectory, slug, 'index.md');
    if (!fs.existsSync(indexPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(indexPath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      tags: data.tags || [],
      stack: data.stack || [],
      github: data.github,
      site: data.site,
      thumbnail: getProjectThumbnail(slug),
      images: getProjectImages(slug),
    } as ProjectMeta;
  });
  
  return projects.filter((p): p is ProjectMeta => p !== null);
}

// Get single project with content
export async function getProject(slug: string): Promise<Project | null> {
  const indexPath = path.join(projectsDirectory, slug, 'index.md');
  
  if (!fs.existsSync(indexPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(indexPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Convert markdown to HTML with syntax highlighting
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();
  
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    tags: data.tags || [],
    stack: data.stack || [],
    github: data.github,
    site: data.site,
    thumbnail: getProjectThumbnail(slug),
    images: getProjectImages(slug),
    content: contentHtml,
  };
}

function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Get all blogs metadata (for listing page)
export function getAllBlogs(): BlogMeta[] {
  const slugs = getBlogSlugs();
  
  const blogs = slugs.map((slug) => {
    const filePath = path.join(blogsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date || '',
      pinned: data.pinned || false,
      readingTime: getReadingTime(content),
    } as BlogMeta;
  });
  
  // Filter out posts with missing or invalid dates
  const validBlogs = blogs.filter((blog) => {
    const date = new Date(blog.date);
    return !isNaN(date.getTime()) && blog.date !== '';
  });

  // Sort: pinned first, then by date (newest first)
  return validBlogs.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Get single blog with content
export async function getBlog(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(blogsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Convert markdown to HTML with syntax highlighting
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();
  
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || '',
    content: contentHtml,
    readingTime: getReadingTime(content),
  };
}
