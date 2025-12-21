import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'contact',
  description: 'ways to get in touch.',
};

export default function ContactPage() {
  return (
    <PageLayout title="contact">
      <ContactForm />
    </PageLayout>
  );
}
