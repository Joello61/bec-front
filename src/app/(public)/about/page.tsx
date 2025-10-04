import type { Metadata } from 'next';
import { AboutSection } from '@/components/sections';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez CoBage, la plateforme camerounaise de mise en relation entre voyageurs et expéditeurs.',
};

export default function AboutPage() {
  return <AboutSection />;
}