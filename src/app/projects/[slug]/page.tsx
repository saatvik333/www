import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { GoArrowLeft } from 'react-icons/go';
import { PageLayout } from '@/components/layout';
import { ArrowLink, GitHubStars } from '@/components/ui';
import { cache } from 'react';
import { getProject, getProjectSlugs } from '@/lib/content';
import { SITE_CONFIG } from '@/lib/config';

const getCachedProject = cache(getProject);
import styles from './page.module.css';
import typographyStyles from '@/styles/typography.module.css';

// Dynamic import for ImageCarousel - reduces initial bundle size
const ImageCarousel = dynamic(
  () => import('@/components/ui/ImageCarousel').then((mod) => mod.ImageCarousel)
);

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCachedProject(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const ogImage = `/api/og?title=${encodeURIComponent(project.title)}`;

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      url: `${SITE_CONFIG.url}/projects/${slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getCachedProject(slug);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.description,
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    ...(project.github && { codeRepository: project.github }),
    ...(project.site && { url: project.site }),
    ...(project.stack && project.stack.length > 0 && { programmingLanguage: project.stack }),
  };

  return (
    <PageLayout wide>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className={styles.article}>
        {/* Back link */}
        <Link href="/projects" className={styles.backLink}>
          <GoArrowLeft className={styles.backArrow} /> projects
        </Link>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              {project.title}
              {project.github && <GitHubStars githubUrl={project.github} />}
            </h1>

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

          {/* Tech Stack */}
          {project.stack && project.stack.length > 0 && (
            <div className={styles.stackItems}>
              {project.stack.map((tech) => (
                <span key={tech} className={styles.stackItem}>{tech}</span>
              ))}
            </div>
          )}
        </header>

        {/* Image Carousel */}
        {project.images.length > 0 && (
          <div className={styles.carousel}>
            <ImageCarousel images={project.images} alt={project.title} />
          </div>
        )}



        {/* Content */}
        <div
          className={typographyStyles.prose}
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      </article>
    </PageLayout>
  );
}
