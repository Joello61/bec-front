'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { LoadingSpinner } from '@/components/common';
import { Button } from '@/components/ui';
import { useSubscriptionStore } from '@/lib/store';
import { ROUTES } from '@/lib/utils/constants';

export default function SubscriptionCheckoutSuccessPage() {
  const isLoading = useSubscriptionStore((state) => state.isLoading);
  const refreshMySubscription = useSubscriptionStore((state) => state.refreshMySubscription);

  useEffect(() => {
    // Le webhook Stripe reste la source de verite - cette page force un
    // rechargement (jamais le fetch mis en cache) une fois le paiement confirme.
    refreshMySubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-custom py-16 flex flex-col items-center text-center gap-4">
      {isLoading ? (
        <LoadingSpinner text="Confirmation du paiement..." />
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Paiement confirmé</h1>
          <p className="text-gray-600 max-w-md">
            Merci ! Votre abonnement est en cours d&apos;activation, cela peut prendre quelques instants.
          </p>
          <Link href={ROUTES.SETTINGS}>
            <Button variant="primary">Retour aux paramètres</Button>
          </Link>
        </>
      )}
    </div>
  );
}
