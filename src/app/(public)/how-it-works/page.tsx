import type { Metadata } from 'next';
import { HowItWorksSection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Comment ça marche',
  description: 'Découvrez en 4 étapes simples comment utiliser Bagage Express pour envoyer ou transporter des colis.',
};

export default function HowItWorksPage() {
  return <HowItWorksSection />;
}