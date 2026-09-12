'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

import { ErrorState, LoadingSpinner } from '@/components/common';
import { CancelSubscriptionModal, SubscriptionCheckoutModal } from '@/components/subscription';
import { Badge, Button, Card } from '@/components/ui';
import { useCurrencyFormat, useSubscription, useSubscriptionPlans } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';
import type { BillingPeriod, SubscriptionPlan } from '@/types';

function QuotaBar({ label, used, max }: { label: string; used: number; max: number | null }) {
  const isUnlimited = max === null;
  const percent = isUnlimited ? 0 : Math.min(100, (used / Math.max(max, 1)) * 100);

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{isUnlimited ? `${used} / illimité` : `${used} / ${max}`}</span>
      </div>
      {!isUnlimited && (
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function SubscriptionPageClient() {
  const { plan, subscription, usage, isLoading, error, refetch } = useSubscription();
  const { plans, isLoading: isLoadingPlans } = useSubscriptionPlans();
  const { formatAmount } = useCurrencyFormat();

  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [checkoutBillingPeriod, setCheckoutBillingPeriod] = useState<BillingPeriod>('monthly');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  if (isLoading || isLoadingPlans) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner fullScreen text="Chargement de votre abonnement..." />
      </div>
    );
  }

  if (error || !plan || !usage) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Erreur de chargement"
          message={error || 'Impossible de charger votre abonnement'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const hasActiveSubscription = subscription !== null && subscription.status === 'active';

  return (
    <div className="container-custom py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Abonnement</h1>
        <p className="text-gray-600">
          Plan actuel : <span className="font-semibold text-gray-900">{plan.name}</span>
          {hasActiveSubscription && subscription.cancelAtPeriodEnd && (
            <span className="ml-2 text-sm text-warning">(résiliation programmée)</span>
          )}
        </p>
      </div>

      <Card variant="bordered" className="space-y-4">
        <h2 className="font-semibold text-gray-900">Usage du quota</h2>
        <QuotaBar label="Voyages actifs" used={usage.activeVoyages} max={usage.maxActiveVoyages} />
        <QuotaBar label="Demandes actives" used={usage.activeDemandes} max={usage.maxActiveDemandes} />
      </Card>

      {hasActiveSubscription && (
        <div>
          <Button variant="outline" onClick={() => setShowCancelModal(true)}>
            Résilier mon abonnement
          </Button>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Nos plans</h2>
          <div className="inline-flex rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                billingPeriod === 'monthly' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('yearly')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                billingPeriod === 'yearly' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              Annuel
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(plans ?? []).map((candidatePlan) => {
            const isCurrent = candidatePlan.code === plan.code;
            const yearlyPrice = candidatePlan.priceAmountEurYearly;
            const displayedPrice = billingPeriod === 'yearly' ? yearlyPrice : candidatePlan.priceAmountEur;
            const isYearlyUnavailable = billingPeriod === 'yearly' && candidatePlan.priceAmountEur !== null && yearlyPrice === null;

            return (
              <Card key={candidatePlan.id} variant="bordered" className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{candidatePlan.name}</h3>
                  {candidatePlan.hasBadge && <Badge variant="default">Populaire</Badge>}
                </div>

                <p className="text-3xl font-bold text-gray-900">
                  {isYearlyUnavailable
                    ? formatAmount(candidatePlan.priceAmountEur as string, 'EUR')
                    : displayedPrice
                      ? formatAmount(displayedPrice, 'EUR')
                      : 'Gratuit'}
                  {displayedPrice && !isYearlyUnavailable && (
                    <span className="text-sm font-normal text-gray-500">
                      {billingPeriod === 'yearly' ? '/an' : '/mois'}
                    </span>
                  )}
                  {isYearlyUnavailable && <span className="text-sm font-normal text-gray-500">/mois</span>}
                </p>
                {isYearlyUnavailable && (
                  <p className="text-xs text-gray-500 -mt-3">Cadence annuelle non disponible pour ce plan</p>
                )}

                <ul className="space-y-2 text-sm text-gray-700 flex-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    {candidatePlan.maxActiveVoyages === null
                      ? 'Voyages actifs illimités'
                      : `${candidatePlan.maxActiveVoyages} voyages actifs max`}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    {candidatePlan.maxActiveDemandes === null
                      ? 'Demandes actives illimitées'
                      : `${candidatePlan.maxActiveDemandes} demandes actives max`}
                  </li>
                </ul>

                <Button
                  variant={isCurrent ? 'outline' : 'primary'}
                  disabled={isCurrent || candidatePlan.code === 'free'}
                  onClick={() => {
                    setCheckoutPlan(candidatePlan);
                    setCheckoutBillingPeriod(isYearlyUnavailable ? 'monthly' : billingPeriod);
                  }}
                  className="w-full"
                >
                  {isCurrent ? 'Plan actuel' : 'Choisir ce plan'}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {checkoutPlan && (
        <SubscriptionCheckoutModal
          plan={checkoutPlan}
          initialBillingPeriod={checkoutBillingPeriod}
          onClose={() => setCheckoutPlan(null)}
        />
      )}

      {showCancelModal && (
        <CancelSubscriptionModal
          onClose={() => setShowCancelModal(false)}
          onSuccess={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
}
