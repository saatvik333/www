'use client';

import { useEffect, useState } from 'react';
import { GoStarFill } from 'react-icons/go';
import { parseGitHubUrl } from '@/lib/github';
import styles from './GitHubStars.module.css';

interface GitHubStarsProps {
    githubUrl: string;
}

export function GitHubStars({ githubUrl }: GitHubStarsProps) {
    const [stars, setStars] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const parsed = parseGitHubUrl(githubUrl);
        if (!parsed) {
            setIsLoading(false);
            return;
        }

        const fetchStars = async () => {
            try {
                const response = await fetch(
                    `/api/github/stars?owner=${parsed.owner}&repo=${parsed.repo}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setStars(data.stars);
                }
            } catch (error) {
                console.error('Failed to fetch stars:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStars();
    }, [githubUrl]);

    // Don't render anything if loading or no stars
    if (isLoading) {
        return <span className={styles.skeleton} />;
    }

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
