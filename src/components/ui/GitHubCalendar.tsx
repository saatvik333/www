'use client';

import { useState, useEffect } from 'react';
import { GitHubCalendar as GitHubCalendarBase } from 'react-github-calendar';
import styles from './GitHubCalendar.module.css';

interface GitHubCalendarProps {
  username: string;
}

const themeInput = {
  light: ['hsl(220, 10%, 16%)', 'hsl(220, 60%, 30%)', 'hsl(220, 70%, 50%)', 'hsl(240, 70%, 65%)', 'hsl(240, 80%, 66%)'],
  dark: ['hsl(220, 10%, 16%)', 'hsl(220, 60%, 30%)', 'hsl(220, 70%, 50%)', 'hsl(240, 70%, 65%)', 'hsl(240, 80%, 66%)'],
};

export function GitHubCalendar({ username }: GitHubCalendarProps) {
  const [containerWidth, setContainerWidth] = useState(680);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      const width = Math.min(window.innerWidth - 48, 680);
      setContainerWidth(width);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    // Delay rendering until after page transition completes (300ms)
    const timer = setTimeout(() => setShouldRender(true), 300);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, []);

  // Calculate block size to fit 53 weeks within container
  const blockMargin = 3;
  const maxBlockSize = Math.floor(containerWidth / 53) - blockMargin;
  const blockSize = Math.max(6, Math.min(10, maxBlockSize));

  return (
    <div className={styles.calendarWrapper}>
      {shouldRender ? (
        <GitHubCalendarBase 
          username={username}
          theme={themeInput}
          colorScheme="dark"
          blockMargin={blockMargin}
          blockSize={blockSize}
          fontSize={11}
        />
      ) : (
        <div className={styles.placeholder} />
      )}
    </div>
  );
}
