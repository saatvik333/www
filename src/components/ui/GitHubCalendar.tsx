import { getContributions } from '@/lib/github';
import styles from './GitHubCalendar.module.css';

interface GitHubCalendarProps {
  username: string;
}

// Cell geometry in SVG units; the graph is one inline SVG (one rect per day)
// instead of hundreds of DOM nodes, which keeps the /about HTML small
const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;

export async function GitHubCalendar({ username }: GitHubCalendarProps) {
  const data = await getContributions(username);

  if (!data) {
    // Graceful fallback - hide the section entirely or show minimal placeholder
    // Don't expose config state or error messages to users
    return null;
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

  const width = weeks.length * STEP - GAP;
  const height = 7 * STEP - GAP;

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.graphContainer}>
        <svg
          className={styles.graph}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          shapeRendering="crispEdges"
          role="img"
          aria-label={`${totalContributions} contributions in the last year`}
        >
          {weeks.map((week, wIndex) =>
            week.contributionDays.map((day, dIndex) => (
              <rect
                key={`${wIndex}-${dIndex}`}
                x={wIndex * STEP}
                y={dIndex * STEP}
                width={CELL}
                height={CELL}
                fill={getThemeColor(day.contributionLevel)}
              >
                <title>{`${day.contributionCount} contributions on ${day.date}`}</title>
              </rect>
            ))
          )}
        </svg>
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
