'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { BoostOfferCard } from '@/components/boost';
import { PlanCard } from '@/components/subscription';
import { useAuth, useCurrencyFormat } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';
import type { BillingPeriod, BoostOffer, SubscriptionPlan } from '@/types';

interface PricingPageClientProps {
  plans: SubscriptionPlan[];
  offers: BoostOffer[];
}

export default function PricingPageClient({ plans, offers }: PricingPageClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { formatAmount } = useCurrencyFormat();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  // Un visiteur connecte va directement gerer son abonnement ; un visiteur non connecte
  // passe par l'inscription, avec le patron ?redirect= deja valide comme chemin interne
  // relatif (src/lib/utils/redirect.ts) a l'arrivee sur /auth/login - /auth/register ne
  // relaie pas encore ce parametre apres verification d'email (limitation preexistante,
  // hors perimetre de ce lot), donc un nouvel utilisateur atterrit sur le flux d'inscription
  // standard et retrouve l'abonnement via le lien "Abonnement" de la sidebar (Lot N1).
  const handlePlanCta = () => {
    if (isAuthenticated) {
      router.push(ROUTES.SUBSCRIPTION);
      return;
    }

    router.push(`${ROUTES.REGISTER}?redirect=${encodeURIComponent(ROUTES.SUBSCRIPTION)}` as Route);
  };

  return (
    <div className="container-custom py-12 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Des tarifs simples et transparents</h1>
        <p className="text-gray-600">
          Commencez gratuitement, passez à un plan supérieur quand votre activité grandit.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                billingPeriod === 'monthly' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('yearly')}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                billingPeriod === 'yearly' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              Annuel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              formatAmount={formatAmount}
              ctaLabel={plan.code === 'free' ? 'Créer un compte' : 'Commencer'}
              onCtaClick={handlePlanCta}
            />
          ))}
        </div>
      </div>

      {offers.length > 0 && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Boostez la visibilité de vos annonces</h2>
            <p className="text-gray-600">
              En complément de votre plan, mettez temporairement en avant un voyage ou une demande.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {offers.map((offer) => (
              <BoostOfferCard key={offer.id} offer={offer} formatAmount={formatAmount} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
