'use client';

import { useState } from 'react';
import { MdContentCopy, MdCheck } from 'react-icons/md';
import styles from './CopyButton.module.css';

interface CopyButtonProps {
  text: string;
  label: string;
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard API failed:', err);
    }
  };

  return (
    <button
      className={styles.copyButton}
      onClick={handleCopy}
      aria-label={label}
    >
      {copied ? (
        <MdCheck className={styles.copyIcon} style={{ color: 'var(--color-accent)' }} />
      ) : (
        <MdContentCopy className={styles.copyIcon} />
      )}
      <span className="sr-only" role="status">{copied ? 'copied' : ''}</span>
    </button>
  );
}
