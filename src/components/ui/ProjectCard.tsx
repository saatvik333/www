import Image from 'next/image';
import Link from 'next/link';
import { GoArrowRight } from 'react-icons/go';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  thumbnail?: string;
  index?: number;
}

export function ProjectCard({ slug, title, description, thumbnail, index = 0 }: ProjectCardProps) {
  // Prioritize first 2 images for faster LCP
  const isPriority = index < 2;
  // Animated images (GIFs) cannot be optimized by next/image; mark as unoptimized
  // to preserve animation and avoid Next.js warnings.
  const isAnimated = thumbnail?.toLowerCase().endsWith('.gif') ?? false;

  return (
    <Link href={`/projects/${slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
            priority={isPriority}
            unoptimized={isAnimated}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderText}>{title[0]}</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {title}
          <GoArrowRight className={styles.arrow} />
        </h2>
        <p className={styles.description}>{description}</p>
      </div>
    </Link>
  );
}
