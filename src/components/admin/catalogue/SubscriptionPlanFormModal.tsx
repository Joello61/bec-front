'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Package, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/components/common';
import { Modal } from '@/components/ui';
import { useAdmin } from '@/lib/hooks';
import { type SubscriptionPlanFormData, subscriptionPlanSchema } from '@/lib/validations/admin.schema';
import type { AdminSubscriptionPlan } from '@/types';

interface SubscriptionPlanFormModalProps {
  plan: AdminSubscriptionPlan | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubscriptionPlanFormModal({ plan, onClose, onSuccess }: SubscriptionPlanFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createSubscriptionPlan, updateSubscriptionPlan } = useAdmin();
  const toast = useToast();
  const isEditing = plan !== null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionPlanFormData>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      code: plan?.code ?? '',
      name: plan?.name ?? '',
      priceAmountEur: plan?.priceAmountEur ?? null,
      priceAmountXaf: plan?.priceAmountXaf ?? null,
      priceAmountEurYearly: plan?.priceAmountEurYearly ?? null,
      priceAmountXafYearly: plan?.priceAmountXafYearly ?? null,
      billingPeriod: 'monthly',
      maxActiveVoyages: plan?.maxActiveVoyages ?? null,
      maxActiveDemandes: plan?.maxActiveDemandes ?? null,
      hasBadge: plan?.hasBadge ?? false,
      hasViewStats: plan?.hasViewStats ?? false,
      isFeatured: plan?.isFeatured ?? false,
      isActive: plan?.isActive ?? true,
      sortOrder: plan?.sortOrder ?? 0,
      stripePriceId: plan?.stripePriceId ?? null,
      stripePriceIdYearly: plan?.stripePriceIdYearly ?? null,
    },
  });

  const onSubmit = async (data: SubscriptionPlanFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        // `code` reste dans `data` (champ toujours rendu, désactivé) mais
        // UpdateSubscriptionPlanInput l'ignore structurellement - jamais envoyé au serveur
        // comme modifiable, cf. UpdateSubscriptionPlanDTO backend qui ne le déclare pas.
        await updateSubscriptionPlan(plan.id, data);
        toast.success('Plan mis à jour avec succès');
      } else {
        await createSubscriptionPlan(data);
        toast.success('Plan créé avec succès');
      }
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Modifier le plan' : 'Nouveau plan d\'abonnement'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plan-code" className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input
                id="plan-code"
                type="text"
                {...register('code')}
                disabled={isEditing}
                placeholder="plus"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
              {errors.code && <p className="text-error text-sm mt-1">{errors.code.message}</p>}
              {isEditing && <p className="text-xs text-gray-500 mt-1">Le code ne peut pas être modifié</p>}
            </div>
            <div>
              <label htmlFor="plan-name" className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                id="plan-name"
                type="text"
                {...register('name')}
                placeholder="Plus"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plan-price-eur" className="block text-sm font-medium text-gray-700 mb-1">Prix EUR (carte)</label>
              <input
                id="plan-price-eur"
                type="text"
                {...register('priceAmountEur')}
                placeholder="4.99"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.priceAmountEur && <p className="text-error text-sm mt-1">{errors.priceAmountEur.message}</p>}
            </div>
            <div>
              <label htmlFor="plan-price-xaf" className="block text-sm font-medium text-gray-700 mb-1">Prix XAF (Mobile Money)</label>
              <input
                id="plan-price-xaf"
                type="text"
                {...register('priceAmountXaf')}
                placeholder="3000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.priceAmountXaf && <p className="text-error text-sm mt-1">{errors.priceAmountXaf.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plan-price-eur-yearly" className="block text-sm font-medium text-gray-700 mb-1">Prix EUR annuel (carte)</label>
              <input
                id="plan-price-eur-yearly"
                type="text"
                {...register('priceAmountEurYearly')}
                placeholder="49.99"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.priceAmountEurYearly && <p className="text-error text-sm mt-1">{errors.priceAmountEurYearly.message}</p>}
            </div>
            <div>
              <label htmlFor="plan-price-xaf-yearly" className="block text-sm font-medium text-gray-700 mb-1">Prix XAF annuel (Mobile Money)</label>
              <input
                id="plan-price-xaf-yearly"
                type="text"
                {...register('priceAmountXafYearly')}
                placeholder="30000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.priceAmountXafYearly && <p className="text-error text-sm mt-1">{errors.priceAmountXafYearly.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plan-max-voyages" className="block text-sm font-medium text-gray-700 mb-1">Quota voyages actifs</label>
              <input
                id="plan-max-voyages"
                type="number"
                {...register('maxActiveVoyages', { valueAsNumber: true, setValueAs: (v) => (v === '' ? null : Number(v)) })}
                placeholder="Illimité si vide"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.maxActiveVoyages && <p className="text-error text-sm mt-1">{errors.maxActiveVoyages.message}</p>}
            </div>
            <div>
              <label htmlFor="plan-max-demandes" className="block text-sm font-medium text-gray-700 mb-1">Quota demandes actives</label>
              <input
                id="plan-max-demandes"
                type="number"
                {...register('maxActiveDemandes', { valueAsNumber: true, setValueAs: (v) => (v === '' ? null : Number(v)) })}
                placeholder="Illimité si vide"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.maxActiveDemandes && <p className="text-error text-sm mt-1">{errors.maxActiveDemandes.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="plan-stripe-price-id" className="block text-sm font-medium text-gray-700 mb-1">Identifiant Price Stripe</label>
            <input
              id="plan-stripe-price-id"
              type="text"
              {...register('stripePriceId')}
              placeholder="price_..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="plan-stripe-price-id-yearly" className="block text-sm font-medium text-gray-700 mb-1">Identifiant Price Stripe annuel</label>
            <input
              id="plan-stripe-price-id-yearly"
              type="text"
              {...register('stripePriceIdYearly')}
              placeholder="price_..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="plan-sort-order" className="block text-sm font-medium text-gray-700 mb-1">Ordre d&apos;affichage</label>
            <input
              id="plan-sort-order"
              type="number"
              {...register('sortOrder', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" {...register('hasBadge')} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
              <span className="text-sm text-gray-700">Badge &quot;Populaire&quot;</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" {...register('hasViewStats')} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
              <span className="text-sm text-gray-700">Statistiques de vues (nombre de consultations des annonces)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
              <span className="text-sm text-gray-700">Mettre en avant sur la page tarifs</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
              <span className="text-sm text-gray-700">Proposé à la souscription</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
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
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer le plan'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
