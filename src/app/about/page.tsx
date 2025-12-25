import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PageLayout } from '@/components/layout';
import { SOCIAL_LINKS } from '@/lib/config';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
// import { LuFileText } from 'react-icons/lu';
import styles from './page.module.css';

// Dynamic import - defers loading until About page is visited
const GitHubCalendar = dynamic(
  () => import('@/components/ui/GitHubCalendar').then(mod => mod.GitHubCalendar)
);

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Saatvik Sharma, a full-stack developer passionate about open source, design mechanics, and high-performance web apps.',
  alternates: {
    canonical: '/about',
  },
};

const links = [
  { href: SOCIAL_LINKS.github, label: 'github', icon: FaGithub },
  { href: SOCIAL_LINKS.twitter, label: 'x/twitter', icon: FaXTwitter },
  { href: SOCIAL_LINKS.linkedin, label: 'linkedin', icon: FaLinkedin },
  // { href: '/resume.pdf', label: 'résumé', icon: LuFileText },
];

const skills = {
  "languages": ['typescript', 'go', 'rust', 'c/c++', 'bash'],
  "frameworks/db": ['node.js', 'next.js', 'ethers.js', 'redis'],
  "tools": ['linux', 'docker', 'github actions', 'git', 'neovim'],
};

export default function AboutPage() {
  return (
    <PageLayout title="about">
      <section className={styles.content}>
        <p className={styles.bio}>
          a software engineer focused on building clean, scalable, and reliable applications.
          i work across the stack, building thoughtful performant systems and intuitive experiences that solve real problems.
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
          <h2 className={styles.sectionTitle}>skills</h2>
          <div className={styles.skillsGrid}>
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className={styles.skillCategory}>
                <span className={styles.categoryLabel}>{category}</span>
                <div className={styles.skillItems}>
                  {items.map((skill) => (
                    <span key={skill} className={styles.skillItem}>{skill}</span>
                  ))}
                </div>
              </div>
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
              <span className={styles.colophonValue}>next.js / vanilla css / gray-matter</span>
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
