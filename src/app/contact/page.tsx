import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PageLayout } from '@/components/layout';
import { SITE_CONFIG } from '@/lib/config';

// Dynamic import - defers loading until Contact page is visited
const ContactForm = dynamic(
  () => import('./ContactForm').then(mod => mod.ContactForm)
);

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for collaborations, opportunities, or just to say hi. I am always open to discussing new projects and ideas.',
  alternates: {
    canonical: '/contact',
  },
};

const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${SITE_CONFIG.url}/contact#contactpage`,
  url: `${SITE_CONFIG.url}/contact`,
  name: 'Contact Saatvik Sharma',
  description: 'Get in touch with Saatvik Sharma for collaborations, opportunities, or just to say hi.',
  mainEntity: {
    '@type': 'Person',
    '@id': `${SITE_CONFIG.url}/#person`,
    name: 'Saatvik Sharma',
    email: SITE_CONFIG.email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SITE_CONFIG.email,
      availableLanguage: 'English',
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Safe: contactPageJsonLd is a static object defined in this file, not user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <PageLayout title="contact">
        <ContactForm />
      </PageLayout>
    </>
  );
}
