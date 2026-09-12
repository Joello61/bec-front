import { Metadata } from 'next';

import SubscriptionPageClient from '@/components/clients/dashboard/subscription-client';

export const metadata: Metadata = {
  title: 'Abonnement',
  description: 'Gérez votre abonnement Cobage, vos quotas et vos options de facturation.',
  robots: { index: false, follow: false },
};

export default function SubscriptionPage() {
  return <SubscriptionPageClient />;
}
