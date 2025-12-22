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

  const getThemeColor = (level: string) => {
    switch (level) {
      case 'FIRST_QUARTILE': return 'var(--color-accent-25)';
      case 'SECOND_QUARTILE': return 'var(--color-accent-50)';
      case 'THIRD_QUARTILE': return 'var(--color-accent-75)';
      case 'FOURTH_QUARTILE': return 'var(--color-accent)';
      default: return 'var(--color-bg-secondary)';
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
                  style={{ backgroundColor: getThemeColor(day.contributionLevel) }}
                  title={`${day.contributionCount} on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <span>{totalContributions} in last year</span>
        <div className={styles.legend}>
          <span>less</span>
          <div className={styles.legendCell} style={{ backgroundColor: 'var(--color-bg-secondary)' }} />
          <div className={styles.legendCell} style={{ backgroundColor: 'var(--color-accent-25)' }} />
          <div className={styles.legendCell} style={{ backgroundColor: 'var(--color-accent-50)' }} />
          <div className={styles.legendCell} style={{ backgroundColor: 'var(--color-accent-75)' }} />
          <div className={styles.legendCell} style={{ backgroundColor: 'var(--color-accent)' }} />
          <span>more</span>
        </div>
      </div>
    </div>
  );
}
