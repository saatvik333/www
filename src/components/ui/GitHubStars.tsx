import { GoStarFill } from 'react-icons/go';
import { parseGitHubUrl, getRepoStars } from '@/lib/github';
import styles from './GitHubStars.module.css';

interface GitHubStarsProps {
    githubUrl: string;
}

export async function GitHubStars({ githubUrl }: GitHubStarsProps) {
    const parsed = parseGitHubUrl(githubUrl);

    if (!parsed) {
        return null;
    }

    const stars = await getRepoStars(parsed.owner, parsed.repo);

    // Don't render if no stars
    if (stars === null || stars === 0) {
        return null;
    }

    return (
        <span className={styles.stars}>
            <GoStarFill className={styles.icon} />
            <span className={styles.count}>{stars}</span>
        </span>
    );
}
