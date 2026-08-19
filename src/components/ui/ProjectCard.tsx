import Image from 'next/image';
import Link from 'next/link';
import { GoArrowRight } from 'react-icons/go';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags?: string[];
  index?: number;
  variant?: 'default' | 'featured';
}

export function ProjectCard({
  slug,
  title,
  description,
  thumbnail,
  tags = [],
  index = 0,
  variant = 'default',
}: ProjectCardProps) {
  // Prioritize the first two images for faster LCP on the project index.
  const isPriority = index < 2;
  // Animated images (GIFs) cannot be optimized by next/image; preserve animation.
  const isAnimated = thumbnail?.toLowerCase().endsWith('.gif') ?? false;
  const visibleTags = tags.slice(0, 3);

  return (
    <Link
      href={`/projects/${slug}`}
      className={`${styles.card} ${variant === 'featured' ? styles.featured : ''}`}
      aria-label={`View ${title} project`}
    >
      <div className={styles.imageWrapper}>
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 70vw, 50vw"
            priority={isPriority}
            unoptimized={isAnimated}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <span className={styles.placeholderText}>{title[0]}</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {title}
          <GoArrowRight className={styles.arrow} aria-hidden="true" />
        </h2>
        <p className={styles.description}>{description}</p>
        {visibleTags.length > 0 && (
          <ul className={styles.tags} aria-label={`${title} technologies`}>
            {visibleTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
