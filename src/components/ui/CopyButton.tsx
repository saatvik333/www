'use client';

import { useState } from 'react';
import { MdContentCopy, MdCheck } from 'react-icons/md';
import styles from './CopyButton.module.css';

interface CopyButtonProps {
  text: string;
  label: string;
}

// Fallback for non-secure contexts (HTTP)
// Note: execCommand is deprecated but necessary for HTTP contexts where Clipboard API is unavailable
function fallbackCopyToClipboard(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '-9999px';
  textArea.setAttribute('readonly', ''); // Prevent keyboard popup on mobile
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (!successful) {
      console.warn('Fallback clipboard copy failed');
    }
    return successful;
  } catch (err) {
    console.warn('Fallback clipboard copy error:', err);
    document.body.removeChild(textArea);
    return false;
  }
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    let success = false;

    // Try modern Clipboard API first (requires secure context)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        console.error('Clipboard API failed:', err);
      }
    }

    // Fallback for HTTP/non-secure contexts
    if (!success) {
      success = fallbackCopyToClipboard(text);
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    </button>
  );
}
