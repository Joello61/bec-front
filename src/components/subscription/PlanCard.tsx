import { Check } from 'lucide-react';

import { Badge, Button, Card } from '@/components/ui';
import type { BillingPeriod, SubscriptionPlan } from '@/types';

interface PlanCardProps {
  plan: SubscriptionPlan;
  billingPeriod: BillingPeriod;
  formatAmount: (amount: string, currency: string) => string;
  isCurrent?: boolean;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onCtaClick: (effectiveBillingPeriod: BillingPeriod) => void;
}

/**
 * Carte d'affichage d'un plan d'abonnement - extraite de subscription-client.tsx pour
 * etre reutilisee par la page pricing publique (Lot N2, plan-complements-monetisation-
 * cobage.md) sans dupliquer le calcul d'affichage prix mensuel/annuel.
 */
export default function PlanCard({
  plan,
  billingPeriod,
  formatAmount,
  isCurrent = false,
  ctaLabel,
  ctaDisabled = false,
  onCtaClick,
}: PlanCardProps) {
  const yearlyPrice = plan.priceAmountEurYearly;
  const displayedPrice = billingPeriod === 'yearly' ? yearlyPrice : plan.priceAmountEur;
  const isYearlyUnavailable = billingPeriod === 'yearly' && plan.priceAmountEur !== null && yearlyPrice === null;

  return (
    <Card variant="bordered" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
        {plan.hasBadge && <Badge variant="default">Populaire</Badge>}
      </div>

      <p className="text-3xl font-bold text-gray-900">
        {isYearlyUnavailable
          ? formatAmount(plan.priceAmountEur as string, 'EUR')
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
          {plan.maxActiveVoyages === null
            ? 'Voyages actifs illimités'
            : `${plan.maxActiveVoyages} voyages actifs max`}
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-success" />
          {plan.maxActiveDemandes === null
            ? 'Demandes actives illimitées'
            : `${plan.maxActiveDemandes} demandes actives max`}
        </li>
      </ul>

      <Button
        variant={isCurrent ? 'outline' : 'primary'}
        disabled={ctaDisabled}
        onClick={() => onCtaClick(isYearlyUnavailable ? 'monthly' : billingPeriod)}
        className="w-full"
      >
        {ctaLabel}
      </Button>
    </Card>
  );
}
