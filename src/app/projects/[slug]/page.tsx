import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GoArrowLeft } from 'react-icons/go';
import { PageLayout } from '@/components/layout';
import { ImageCarousel, ArrowLink } from '@/components/ui';
import { getProject, getProjectSlugs } from '@/lib/content';
import styles from './page.module.css';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  
  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <PageLayout wide>
      <article className={styles.article}>
        {/* Back link */}
        <Link href="/projects" className={styles.backLink}>
          <GoArrowLeft className={styles.backArrow} /> projects
        </Link>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{project.title}</h1>
            
            {/* External links */}
            <div className={styles.links}>
              {project.site && (
                <ArrowLink href={project.site} external>
                  site
                </ArrowLink>
              )}
              {project.github && (
                <ArrowLink href={project.github} external>
                  github
                </ArrowLink>
              )}
            </div>
          </div>
          <p className={styles.description}>{project.description}</p>
        </header>

        {/* Image Carousel */}
        {project.images.length > 0 && (
          <div className={styles.carousel}>
            <ImageCarousel images={project.images} alt={project.title} />
          </div>
        )}

        {/* Content */}
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      </article>
    </PageLayout>
  );
}
