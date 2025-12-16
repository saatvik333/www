import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import { FaDiscord } from 'react-icons/fa';
import { MdEmail, MdContentCopy } from 'react-icons/md';
import { GoArrowRight } from 'react-icons/go';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'contact',
  description: 'ways to get in touch.',
};

export default function ContactPage() {
  return (
    <PageLayout title="contact">
      <section className={styles.content}>
        <p className={styles.description}>ways to get in touch.</p>
        
        <div className={styles.links}>
          <div className={styles.linkRow}>
            <MdEmail className={styles.linkIcon} />
            <a href="mailto:saatvik333@example.com" className={styles.linkValue}>
              saatvik333@example.com
            </a>
            <button className={styles.copyButton} aria-label="Copy email">
              <MdContentCopy className={styles.copyIcon} />
            </button>
          </div>
          
          <div className={styles.linkRow}>
            <FaDiscord className={styles.linkIcon} />
            <a 
              href="https://discord.com/users/saatvik333" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.linkValue}
            >
              saatvik333
            </a>
            <button className={styles.copyButton} aria-label="Copy Discord handle">
              <MdContentCopy className={styles.copyIcon} />
            </button>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>contact form</h3>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className="sr-only">name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                className={styles.input}
                placeholder="name"
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className="sr-only">email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className={styles.input}
                placeholder="email (if you want a reply)"
                required 
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
              />
            </div>
            
            <button type="submit" className={styles.submitButton}>
              submit <GoArrowRight className={styles.buttonArrow} />
            </button>
          </form>
        </div>
      </section>
    </PageLayout>
  );
}
