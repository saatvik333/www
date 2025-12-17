import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GoArrowLeft } from 'react-icons/go';
import { PageLayout } from '@/components/layout';
import { getBlog, getBlogSlugs } from '@/lib/content';
import styles from './page.module.css';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlog(slug);

  if (!post) {
    notFound();
  }

  return (
    <PageLayout>
      <article className={styles.article}>
        {/* Back link */}
        <Link href="/blog" className={styles.backLink}>
          <GoArrowLeft className={styles.backArrow} /> blog
        </Link>

        {/* Header */}
        <header className={styles.header}>
          <time className={styles.date}>{formatDate(post.date)}</time>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.description}>{post.description}</p>
        </header>

        {/* Content */}
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </PageLayout>
  );
}
