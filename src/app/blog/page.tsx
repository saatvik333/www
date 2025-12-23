import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import { ArrowLink } from '@/components/ui';
import { getAllBlogs } from '@/lib/content';
import { TbPinFilled } from 'react-icons/tb';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Thoughts, tutorials, and insights on web development, design systems, and Linux customization.',
  alternates: {
    canonical: '/blog',
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

export default function BlogPage() {
  const blogPosts = getAllBlogs();

  return (
    <PageLayout
      title={`blogs[${blogPosts.length}]`}
      actions={<a href="/feed" className={styles.rss}>rss</a>}
    >
      <section className={styles.content}>
        <div className={styles.postList}>
          {blogPosts.map((post, index) => (
            <article
              key={post.slug}
              className={styles.postCard}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className={styles.date}>
                {post.pinned && <TbPinFilled className={styles.pinnedIcon} />}
                {formatDate(post.date)}
              </span>
              <ArrowLink href={`/blog/${post.slug}`}>
                <span className={styles.postTitle}>{post.title}</span>
              </ArrowLink>
              <p className={styles.postDescription}>{post.description}</p>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

