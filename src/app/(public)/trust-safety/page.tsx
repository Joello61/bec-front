import type { Metadata } from 'next';
import { TrustSafetySection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Confiance et Sécurité',
  description: 'Découvrez nos recommandations pour des transactions sûres et sereines sur Bagage Express.',
};

export default function TrustSafetyPage() {
  return <TrustSafetySection />;
}