import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import { ArrowLink } from '@/components/ui';
import { projects } from '@/data/projects';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'projects',
  description: 'projects i have worked on.',
};

export default function ProjectsPage() {
  return (
    <PageLayout title={`projects[${projects.length}]`} wide>
      <section className={styles.content}>
        <div className={styles.projectList}>
          {projects.map((project, index) => (
            <article 
              key={project.slug} 
              className={styles.projectCard}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ArrowLink href={`/projects/${project.slug}`}>
                <span className={styles.projectTitle}>{project.title}</span>
              </ArrowLink>
              <p className={styles.projectDescription}>{project.description}</p>
              {project.tags && (
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
