'use client';

import { useState, FormEvent } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { GoArrowRight } from 'react-icons/go';
import { CopyButton } from '@/components/ui';
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/config';
import styles from './page.module.css';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailProvided, setEmailProvided] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        setStatus('submitting');
        setErrorMessage('');

        const formData = new FormData(form);
        const email = formData.get('email') as string;
        const data = {
            name: formData.get('name') as string,
            email,
            message: formData.get('message') as string,
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send message');
            }

            setEmailProvided(!!email);
            setStatus('success');
            form.reset();
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
        }
    }

    return (
        <section className={styles.content}>
            <p className={styles.description}>ways to get in touch.</p>

            <div className={styles.links}>
                <div className={styles.linkRow}>
                    <MdEmail className={styles.linkIcon} />
                    <a href={`mailto:${SITE_CONFIG.email}`} className={styles.linkValue}>
                        {SITE_CONFIG.email}
                    </a>
                    <CopyButton text={SITE_CONFIG.email} label="Copy email" />
                </div>

                <div className={styles.linkRow}>
                    <FaDiscord className={styles.linkIcon} />
                    <a
                        href={SOCIAL_LINKS.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkValue}
                    >
                        {SOCIAL_LINKS.discordHandle}
                    </a>
                    <CopyButton text={SOCIAL_LINKS.discordHandle} label="Copy Discord handle" />
                </div>
            </div>

            <div className={styles.formSection}>
                <h3 className={styles.formTitle}>contact form</h3>

                {status === 'success' && (
                    <div className={styles.successMessage}>
                        {emailProvided
                            ? "message sent successfully! i'll get back to you soon."
                            : "message sent successfully!"}
                    </div>
                )}

                {status === 'error' && (
                    <div className={styles.errorMessage}>
                        {errorMessage}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className="sr-only">name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className={styles.input}
                            placeholder="name"
                            required
                            disabled={status === 'submitting'}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className="sr-only">email (optional)</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={styles.input}
                            placeholder="email (optional, if you want a reply)"
                            disabled={status === 'submitting'}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="message" className="sr-only">message</label>
                        <textarea
                            id="message"
                            name="message"
                            className={styles.textarea}
                            placeholder="your message..."
                            rows={5}
                            required
                            disabled={status === 'submitting'}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={status === 'submitting'}
                    >
                        {status === 'submitting' ? 'sending...' : 'submit'}
                        <GoArrowRight className={styles.buttonArrow} />
                    </button>
                </form>
            </div>
        </section>
    );
}
