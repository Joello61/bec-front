'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/components/common';
import { Modal, ModalFooter } from '@/components/ui';
import { useCurrencyFormat, useSubscriptionActions } from '@/lib/hooks';
import { type CheckoutConsentFormData, checkoutConsentSchema } from '@/lib/validations/subscription.schema';
import type { SubscriptionPlan } from '@/types';

interface SubscriptionCheckoutModalProps {
  plan: SubscriptionPlan;
  initialBillingPeriod?: 'monthly' | 'yearly';
  onClose: () => void;
}

export default function SubscriptionCheckoutModal({ plan, initialBillingPeriod = 'monthly', onClose }: SubscriptionCheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checkout } = useSubscriptionActions();
  const { formatAmount } = useCurrencyFormat();
  const toast = useToast();

  const hasMobileMoney = plan.priceAmountXaf !== null;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutConsentFormData>({
    resolver: zodResolver(checkoutConsentSchema),
    defaultValues: {
      planCode: plan.code,
      paymentMethod: 'card',
      billingPeriod: initialBillingPeriod,
      accessImmediateConsent: false,
      withdrawalWaiverConsent: false,
    },
  });

  const paymentMethod = watch('paymentMethod');
  const billingPeriod = watch('billingPeriod');
  const isMobileMoney = paymentMethod === 'mobile_money';
  const hasYearlyPrice = isMobileMoney ? plan.priceAmountXafYearly !== null : plan.priceAmountEurYearly !== null;
  const monthlyAmount = isMobileMoney ? plan.priceAmountXaf : plan.priceAmountEur;
  const yearlyAmount = isMobileMoney ? plan.priceAmountXafYearly : plan.priceAmountEurYearly;
  const displayedAmount = billingPeriod === 'yearly' ? yearlyAmount : monthlyAmount;

  const onSubmit = async (data: CheckoutConsentFormData) => {
    setIsSubmitting(true);
    try {
      const checkoutUrl = await checkout(data);
      window.location.assign(checkoutUrl);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">S&apos;abonner au plan {plan.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">
            Montant facturé {billingPeriod === 'yearly' ? 'chaque année' : 'chaque mois'}
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {displayedAmount ? formatAmount(displayedAmount, isMobileMoney ? 'XAF' : 'EUR') : '-'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Sans engagement, résiliable à tout moment.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Cadence de facturation</p>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input type="radio" value="monthly" {...register('billingPeriod')} className="sr-only" />
                Mensuel
              </label>
              <label
                className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
                  !hasYearlyPrice
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                    : billingPeriod === 'yearly'
                      ? 'border-primary bg-primary/5 text-primary cursor-pointer'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <input
                  type="radio"
                  value="yearly"
                  disabled={!hasYearlyPrice}
                  {...register('billingPeriod')}
                  className="sr-only"
                />
                Annuel
              </label>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Moyen de paiement</p>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input type="radio" value="card" {...register('paymentMethod')} className="sr-only" />
                Carte bancaire
              </label>
              <label
                className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
                  !hasMobileMoney
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                    : paymentMethod === 'mobile_money'
                      ? 'border-primary bg-primary/5 text-primary cursor-pointer'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <input
                  type="radio"
                  value="mobile_money"
                  disabled={!hasMobileMoney}
                  {...register('paymentMethod')}
                  className="sr-only"
                />
                Mobile Money
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register('accessImmediateConsent')}
                className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                J&apos;accepte que l&apos;exécution du service commence immédiatement, sans attendre la fin
                du délai de rétractation de 14 jours.
              </span>
            </label>
            {errors.accessImmediateConsent && (
              <p className="text-error text-sm mt-1">{errors.accessImmediateConsent.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register('withdrawalWaiverConsent')}
                className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                Je reconnais renoncer expressément à mon droit de rétractation de 14 jours pour ce
                service.
              </span>
            </label>
            {errors.withdrawalWaiverConsent && (
              <p className="text-error text-sm mt-1">{errors.withdrawalWaiverConsent.message}</p>
            )}
          </div>

          <ModalFooter>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? paymentMethod === 'mobile_money'
                  ? 'Redirection vers Notch Pay...'
                  : 'Redirection vers Stripe...'
                : 'Continuer vers le paiement'}
            </button>
          </ModalFooter>
        </form>
      </div>
    </Modal>
  );
}
