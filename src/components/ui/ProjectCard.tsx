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
  return (
    <Link
      href={`/projects/${slug}`}
      className={styles.card}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={styles.imageWrapper}>
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderText}>{title[0]}</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {title}
          <GoArrowRight className={styles.arrow} />
        </h3>
        <p className={styles.description}>{description}</p>
      </div>
    </Link>
  );
}
