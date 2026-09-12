'use client';

import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui';
import { useSubscriptionStore } from '@/lib/store';
import { ROUTES } from '@/lib/utils/constants';

export default function SubscriptionCheckoutCancelPage() {
  const refreshMySubscription = useSubscriptionStore((state) => state.refreshMySubscription);

  useEffect(() => {
    refreshMySubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-custom py-16 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <XCircle className="w-8 h-8 text-gray-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Paiement annulé</h1>
      <p className="text-gray-600 max-w-md">
        Vous avez annulé le paiement. Aucun montant n&apos;a été débité, votre abonnement n&apos;a pas changé.
      </p>
      <Link href={ROUTES.SETTINGS}>
        <Button variant="primary">Retour aux paramètres</Button>
      </Link>
    </div>
  );
}
