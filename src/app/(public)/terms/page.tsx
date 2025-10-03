import type { Metadata } from 'next';
import { TermsSection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation',
  description: 'Consultez les conditions d\'utilisation de la plateforme Bagage Express.',
};

export default function TermsPage() {
  return <TermsSection />;
}