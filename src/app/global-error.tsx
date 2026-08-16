'use client';

import { COLORS } from '@/lib/config';

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  console.error(error);
  return (
    <html lang="en">
      <body style={{ backgroundColor: COLORS.bg, color: COLORS.text, fontFamily: 'monospace', padding: '2rem', textAlign: 'center' }}>
        <h2>something went wrong</h2>
        <p style={{ color: COLORS.textDim }}>{error.digest ? `error id: ${error.digest}` : 'a critical error occurred.'}</p>
        <button onClick={reset} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>try again</button>
      </body>
    </html>
  );
}
