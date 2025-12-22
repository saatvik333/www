import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import { ProjectCard } from '@/components/ui';
import { getAllProjects } from '@/lib/content';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A curated collection of my web development and design projects, featuring work with Next.js, React, and TypeScript.',
  alternates: {
    canonical: '/projects',
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <PageLayout title={`projects[${projects.length}]`} wide>
      <section className={styles.content}>
        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              title={project.title}
              description={project.description}
              thumbnail={project.thumbnail}
              index={index}
            />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
