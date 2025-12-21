import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import { GitHubCalendar } from '@/components/ui';
import { SOCIAL_LINKS } from '@/lib/config';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'about',
  description: 'info about me.',
};

const links = [
  { href: SOCIAL_LINKS.github, label: 'github', icon: FaGithub },
  { href: SOCIAL_LINKS.twitter, label: 'x/twitter', icon: FaXTwitter },
  { href: SOCIAL_LINKS.linkedin, label: 'linkedin', icon: FaLinkedin }
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
          <h2 className={styles.sectionTitle}>github contributions</h2>
          <GitHubCalendar username="saatvik333" />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>colophon</h2>
          <div className={styles.colophonGrid}>
            <a
              href={SOCIAL_LINKS.github + '/www'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLink}
            >
              github repo
              <span className={styles.arrow}>&gt;</span>
            </a>
            <p className={styles.colophonRow}>
              <span className={styles.colophonLabel}>stack</span>
              <span className={styles.colophonArrowSmall}>→</span>
              <span className={styles.colophonValue}>next.js / react / vanilla css / gray-matter</span>
            </p>
            <p className={styles.colophonRow}>
              <span className={styles.colophonLabel}>fonts</span>
              <span className={styles.colophonArrowSmall}>→</span>
              <span className={styles.colophonValue}>ibm plex mono / sf mono</span>
            </p>
            <div className={styles.colorPalette}>
              <span className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-bg)' }} title="bg" />
              <span className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-bg-secondary)' }} title="bg-2" />
              <span className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-bg-tertiary)' }} title="bg-3" />
              <span className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-text-dim)' }} title="txt-dim" />
              <span className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-text-muted)' }} title="txt-muted" />
              <span className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-text)' }} title="txt" />
              <span className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-accent)' }} title="accent" />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
