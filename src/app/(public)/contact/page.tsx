import type { Metadata } from 'next';
import { ContactSection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l\'équipe CoBage pour toute question ou assistance.',
};

export default function ContactPage() {
  return <ContactSection />;
}