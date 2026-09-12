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
  onClose: () => void;
}

export default function SubscriptionCheckoutModal({ plan, onClose }: SubscriptionCheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checkout } = useSubscriptionActions();
  const { formatAmount } = useCurrencyFormat();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutConsentFormData>({
    resolver: zodResolver(checkoutConsentSchema),
    defaultValues: {
      planCode: plan.code,
      accessImmediateConsent: false,
      withdrawalWaiverConsent: false,
    },
  });

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
          <p className="text-sm text-gray-600 mb-1">Montant facturé chaque mois</p>
          <p className="text-2xl font-bold text-gray-900">
            {plan.priceAmountEur ? formatAmount(plan.priceAmountEur, 'EUR') : '-'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Sans engagement, résiliable à tout moment.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {isSubmitting ? 'Redirection vers Stripe...' : 'Continuer vers le paiement'}
            </button>
          </ModalFooter>
        </form>
      </div>
    </Modal>
  );
}
