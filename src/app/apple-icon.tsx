import { ImageResponse } from 'next/og';
import { COLORS } from '@/lib/config';

// Apple touch icons must be PNG; generate from BBlack tokens so palette
// changes never leave a stale icon behind. Mark = the site's petal logo
// (one bud down, two up) in the static "simple" orientation.
export const size = { width: 180, height: 180 };

export default function AppleIcon() {
  const petal = 'M 35 40 A 35 35 0 1 1 55 100 A 35 35 0 1 1 35 160';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.bg,
        }}
      >
        <svg
          width="150"
          height="150"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            transform="translate(100 100) scale(0.8) translate(-100 -100)"
            fill="none"
            stroke={COLORS.accent}
            strokeWidth="16"
            strokeLinecap="butt"
            strokeLinejoin="bevel"
          >
            <path d={petal} transform="translate(60.8 0)" />
            <path d={petal} transform="rotate(120 100 100) translate(60.8 0)" />
            <path d={petal} transform="rotate(-120 100 100) translate(60.8 0)" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
