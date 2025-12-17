'use client';

import { useState, useEffect, useMemo } from 'react';
import { GitHubCalendar as GitHubCalendarBase } from 'react-github-calendar';
import styles from './GitHubCalendar.module.css';

interface GitHubCalendarProps {
  username: string;
}

// Memoized outside component to prevent recreation
const themeInput = {
  light: ['hsl(220, 10%, 16%)', 'hsl(220, 60%, 30%)', 'hsl(220, 70%, 50%)', 'hsl(240, 70%, 65%)', 'hsl(240, 80%, 66%)'],
  dark: ['hsl(220, 10%, 16%)', 'hsl(220, 60%, 30%)', 'hsl(220, 70%, 50%)', 'hsl(240, 70%, 65%)', 'hsl(240, 80%, 66%)'],
};

export function GitHubCalendar({ username }: GitHubCalendarProps) {
  const [containerWidth, setContainerWidth] = useState(680);
  const [shouldRender, setShouldRender] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

  // Trigger fade-in after a short delay to ensure calendar is painted with correct colors
  useEffect(() => {
    if (shouldRender) {
      const loadTimer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(loadTimer);
    }
  }, [shouldRender]);

  // Memoize calculated values
  const { blockSize, blockMargin } = useMemo(() => {
    const margin = 3;
    const maxBlockSize = Math.floor(containerWidth / 53) - margin;
    const size = Math.max(6, Math.min(10, maxBlockSize));
    return { blockSize: size, blockMargin: margin };
  }, [containerWidth]);

  return (
    <div className={styles.calendarWrapper}>
      {shouldRender ? (
        <div 
          className={isLoaded ? styles.calendarLoaded : ''} 
          style={{ opacity: isLoaded ? undefined : 0 }}
        >
          <GitHubCalendarBase 
            username={username}
            theme={themeInput}
            colorScheme="dark"
            blockMargin={blockMargin}
            blockSize={blockSize}
            fontSize={11}
          />
        </div>
      ) : (
        <div className={styles.placeholder} />
      )}
    </div>
  );
}
