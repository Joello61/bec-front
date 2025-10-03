import type { Metadata } from 'next';
import { PrivacySection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Découvrez comment nous protégeons vos données personnelles sur Bagage Express.',
};

export default function PrivacyPage() {
  return <PrivacySection />;
}