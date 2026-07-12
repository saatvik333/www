import styles from './NavLink.module.css';

/**
 * Nav link glyph: a single SVG whose shaft doubles as the idle "/" (rotated)
 * and the hover arrow (level, with the head sprouting from the tip). One
 * geometry, one stroke — the two states morph instead of crossfading.
 */
export function NavSymbol() {
  return (
    <span className={styles.symbolWrapper}>
      <svg className={styles.symbol} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <g className={styles.glyph}>
          <path className={styles.shaft} d="M 4 12 H 20" />
          <path className={styles.head} d="M 14 6 L 20 12 L 14 18" />
        </g>
      </svg>
    </span>
  );
}
