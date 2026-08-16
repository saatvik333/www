import { ImageResponse } from 'next/og';
import { COLORS } from '@/lib/config';

// Apple touch icons must be PNG; generate from BBlack tokens so palette
// changes never leave a stale icon behind
export const size = { width: 180, height: 180 };

export default function AppleIcon() {
  const blade =
    'M29 13.6 A42 42 0 0 1 71 13.6 L60 32.7 A20 20 0 0 0 40 32.7 Z';

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
        <svg width="140" height="140" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g fill={COLORS.accent} transform="translate(0,0)">
            <path d={blade} />
            <path d={blade} transform="rotate(120 50 50)" />
            <path d={blade} transform="rotate(240 50 50)" />
            <circle cx="50" cy="50" r="11" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
