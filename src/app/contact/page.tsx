import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PageLayout } from '@/components/layout';

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

export default function ContactPage() {
  return (
    <PageLayout title="contact">
      <ContactForm />
    </PageLayout>
  );
}
