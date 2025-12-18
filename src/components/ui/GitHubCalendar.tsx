import { getContributions } from '@/lib/github';
import styles from './GitHubCalendar.module.css';

interface GitHubCalendarProps {
  username: string;
}

export async function GitHubCalendar({ username }: GitHubCalendarProps) {
  const data = await getContributions(username);

  if (!data) {
    return (
      <div className={styles.calendarWrapper}>
        <div className={styles.error}>
          failed to load contributions. check token?
        </div>
      </div>
    );
  }

  const { weeks, totalContributions } = data;

  // Previous theme colors (Blues/Purples)
  const theme = {
    NONE: 'var(--bg-secondary)', // or use the first color of theme if appropriate, but usually empty is bg
    FIRST_QUARTILE: 'hsl(220, 60%, 30%)',
    SECOND_QUARTILE: 'hsl(220, 70%, 50%)',
    THIRD_QUARTILE: 'hsl(240, 70%, 65%)',
    FOURTH_QUARTILE: 'hsl(240, 80%, 66%)',
  };

  // Original theme array for reference/legend
  // ['hsl(220, 10%, 16%)', 'hsl(220, 60%, 30%)', 'hsl(220, 70%, 50%)', 'hsl(240, 70%, 65%)', 'hsl(240, 80%, 66%)']
  // Note: Level 0 in original was index 0.

  const getThemeColor = (level: string) => {
    switch (level) {
      case 'FIRST_QUARTILE': return 'hsl(220, 60%, 30%)';
      case 'SECOND_QUARTILE': return 'hsl(220, 70%, 50%)';
      case 'THIRD_QUARTILE': return 'hsl(240, 70%, 65%)';
      case 'FOURTH_QUARTILE': return 'hsl(240, 80%, 66%)';
      default: return 'var(--bg-secondary)'; // Level 0 / NONE matches the "empty" look
    }
  };

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.graphContainer}>
        <div className={styles.graph}>
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className={styles.column}>
              {week.contributionDays.map((day, dIndex) => (
                <div
                  key={`${wIndex}-${dIndex}`}
                  className={styles.cell}
                  style={{
                    backgroundColor: getThemeColor(day.contributionLevel),
                    // If it's a specific color override needed for level 0 to match exactly:
                    // backgroundColor: day.contributionLevel === 'NONE' ? 'hsl(220, 10%, 16%)' : getThemeColor(day.contributionLevel)
                    // But 'var(--bg-secondary)' is usually safer for "empty" in a theme-aware chart unless the user strictly wants the dark blue background 
                    // Let's stick to the previous code's implied logic where index 0 was the "empty" color.
                    // The previous code had: light: ['hsl(220, 10%, 16%)', ...]. So Level 0 was indeed a specific color.
                    // I'll use that specific color for consistency if the user said "previous looks".
                  }}
                  title={`${day.contributionCount} contributions on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <span>{totalContributions} contributions in the last year</span>
        <div className={styles.legend}>
          <span>less</span>
          <div className={styles.legendCell} style={{ backgroundColor: 'var(--bg-secondary)' }} />
          <div className={styles.legendCell} style={{ backgroundColor: 'hsl(220, 60%, 30%)' }} />
          <div className={styles.legendCell} style={{ backgroundColor: 'hsl(220, 70%, 50%)' }} />
          <div className={styles.legendCell} style={{ backgroundColor: 'hsl(240, 70%, 65%)' }} />
          <div className={styles.legendCell} style={{ backgroundColor: 'hsl(240, 80%, 66%)' }} />
          <span>more</span>
        </div>
      </div>
    </div>
  );
}
