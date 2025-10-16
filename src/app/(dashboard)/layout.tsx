import type { Metadata } from 'next';
import DashboardLayoutClient from '../../components/clients/dashboard/dashboard-layout-client';

// Metadata pour le dashboard (pages protégées)
export const metadata: Metadata = {
  title: {
    default: 'Tableau de bord - Co-Bage',
    template: '%s | Co-Bage',
  },
  description: 'Gérez vos voyages, demandes de colis, messages et favoris. Trouvez des voyageurs ou expéditeurs pour vos trajets entre le Cameroun, l\'Afrique et la diaspora.',
  keywords: [
    'tableau de bord Co-Bage',
    'mes voyages colis',
    'mes demandes transport',
    'explorer trajets Cameroun',
    'messagerie Co-Bage',
    'favoris transport colis',
    'notifications voyage',
  ],
  robots: {
    index: false, // Dashboard privé, pas d'indexation
    follow: false,
  },
  openGraph: {
    title: 'Tableau de bord Co-Bage',
    description: 'Gérez vos voyages et demandes de transport de colis.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Tableau de bord Co-Bage',
  },
};

// Server Component qui wrap le Client Component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}