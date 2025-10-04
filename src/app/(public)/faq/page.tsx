import type { Metadata } from 'next';
import { FaqSection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Questions Fréquentes',
  description: 'Trouvez les réponses aux questions les plus fréquentes sur CoBage.',
};

export default function FaqPage() {
  return <FaqSection />;
}