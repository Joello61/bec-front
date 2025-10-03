import type { Metadata } from 'next';
import { FaqSection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Questions Fréquentes',
  description: 'Trouvez les réponses aux questions les plus fréquentes sur Bagage Express.',
};

export default function FaqPage() {
  return <FaqSection />;
}