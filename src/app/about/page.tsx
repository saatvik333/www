import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import { GitHubCalendar } from '@/components/ui';
import { FaGithub, FaDiscord } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'about',
  description: 'info about me.',
};

const links = [
  { href: 'https://github.com/saatvik333', label: 'github', icon: FaGithub },
  { href: 'https://x.com/saatvik333', label: 'x/twitter', icon: FaXTwitter },
  { href: 'https://discord.com/users/saatvik333', label: 'discord', icon: FaDiscord },
];

const techStack = [
  'TypeScript', 'React', 'Next.js', 'Node.js', 'Python',
  'Go', 'Rust', 'Linux', 'Docker', 'Git'
];

export default function AboutPage() {
  return (
    <PageLayout title="about">
      <section className={styles.content}>
        <p className={styles.bio}>
          hey there! i&apos;m saatvik, a developer passionate about creating beautiful and functional things.
          i love web development, design systems, linux customization, and building tools that make life easier.
        </p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>contributions</h2>
          <GitHubCalendar username="saatvik333" />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>links</h2>
          <div className={styles.links}>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  <Icon className={styles.linkIcon} />
                  {link.label}
                  <span className={styles.arrow}>&gt;</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>tech</h2>
          <div className={styles.techGrid}>
            {techStack.map((tech) => (
              <span key={tech} className={styles.techItem}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>colophon</h2>
          <p className={styles.colophon}>
            this site is built with next.js 16, vanilla css, and deployed with love.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
