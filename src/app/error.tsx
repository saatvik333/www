'use client';

export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
      <h2 style={{ color: 'var(--color-text)', marginBottom: '1rem' }}>something went wrong</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        {error.digest ? `error id: ${error.digest}` : 'an unexpected error occurred.'}
      </p>
      <button onClick={reset} style={{ padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
        try again
      </button>
    </div>
  );
}
