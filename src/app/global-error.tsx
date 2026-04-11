'use client';

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#171717', color: '#ededed', fontFamily: 'monospace', padding: '2rem', textAlign: 'center' }}>
        <h2>something went wrong</h2>
        <p style={{ color: '#a0a0a0' }}>{error.digest ? `error id: ${error.digest}` : 'a critical error occurred.'}</p>
        <button onClick={reset} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>try again</button>
      </body>
    </html>
  );
}
