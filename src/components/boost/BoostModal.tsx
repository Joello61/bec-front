'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { LoadingSpinner, useToast } from '@/components/common';
import { Modal, ModalFooter } from '@/components/ui';
import { useBoostActions, useBoostOffers, useCurrencyFormat } from '@/lib/hooks';
import { type CheckoutBoostConsentFormData, checkoutBoostConsentSchema } from '@/lib/validations/boost.schema';
import type { BoostTargetType } from '@/types';

interface BoostModalProps {
  targetType: BoostTargetType;
  targetId: number;
  onClose: () => void;
}

export default function BoostModal({ targetType, targetId, onClose }: BoostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { offers, isLoading: isLoadingOffers } = useBoostOffers();
  const { checkout } = useBoostActions();
  const { formatAmount } = useCurrencyFormat();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutBoostConsentFormData>({
    resolver: zodResolver(checkoutBoostConsentSchema),
    defaultValues: {
      targetType,
      targetId,
      offerId: 0,
      accessImmediateConsent: false,
      withdrawalWaiverConsent: false,
    },
  });

  const onSubmit = async (data: CheckoutBoostConsentFormData) => {
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
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-warning" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Booster la visibilité</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoadingOffers ? (
          <LoadingSpinner text="Chargement des offres..." />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée du boost</label>
              <Controller
                control={control}
                name="offerId"
                render={({ field }) => (
                  <div className="space-y-2">
                    {(offers ?? []).map((offer) => (
                      <label
                        key={offer.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          field.value === offer.id ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={field.value === offer.id}
                            onChange={() => field.onChange(offer.id)}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-gray-900">{offer.name}</span>
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatAmount(offer.priceAmountEur, 'EUR')}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              />
              {errors.offerId && <p className="text-error text-sm mt-1">{errors.offerId.message}</p>}
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
                {isSubmitting ? 'Redirection vers Stripe...' : 'Continuer vers le paiement'}
              </button>
            </ModalFooter>
          </form>
        )}
      </div>
    </Modal>
  );
}
