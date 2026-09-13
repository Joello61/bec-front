import { Metadata } from 'next';

import PaymentsPageClient from '@/components/clients/dashboard/payments-client';

export const metadata: Metadata = {
  title: 'Historique des paiements',
  description: 'Consultez l\'historique de vos paiements d\'abonnement et de boost Cobage.',
  robots: { index: false, follow: false },
};

export default function PaymentsPage() {
  return <PaymentsPageClient />;
}
