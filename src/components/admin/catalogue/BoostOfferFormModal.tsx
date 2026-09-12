'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/components/common';
import { Modal } from '@/components/ui';
import { useAdmin } from '@/lib/hooks';
import { type BoostOfferFormData, boostOfferSchema } from '@/lib/validations/admin.schema';
import type { AdminBoostOffer } from '@/types';

interface BoostOfferFormModalProps {
  offer: AdminBoostOffer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BoostOfferFormModal({ offer, onClose, onSuccess }: BoostOfferFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createBoostOffer, updateBoostOffer } = useAdmin();
  const toast = useToast();
  const isEditing = offer !== null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoostOfferFormData>({
    resolver: zodResolver(boostOfferSchema),
    defaultValues: {
      name: offer?.name ?? '',
      durationDays: offer?.durationDays ?? 7,
      priceAmountEur: offer?.priceAmountEur ?? '',
      priceAmountXaf: offer?.priceAmountXaf ?? null,
      isFeatured: offer?.isFeatured ?? false,
      isActive: offer?.isActive ?? true,
      sortOrder: offer?.sortOrder ?? 0,
    },
  });

  const onSubmit = async (data: BoostOfferFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateBoostOffer(offer.id, data);
        toast.success('Offre mise à jour avec succès');
      } else {
        await createBoostOffer(data);
        toast.success('Offre créée avec succès');
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
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-warning" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Modifier l\'offre' : 'Nouvelle offre de boost'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="offer-name" className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                id="offer-name"
                type="text"
                {...register('name')}
                placeholder="7 jours"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="offer-duration" className="block text-sm font-medium text-gray-700 mb-1">Durée (jours) *</label>
              <input
                id="offer-duration"
                type="number"
                {...register('durationDays', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.durationDays && <p className="text-error text-sm mt-1">{errors.durationDays.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="offer-price-eur" className="block text-sm font-medium text-gray-700 mb-1">Prix EUR (carte) *</label>
              <input
                id="offer-price-eur"
                type="text"
                {...register('priceAmountEur')}
                placeholder="2.99"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.priceAmountEur && <p className="text-error text-sm mt-1">{errors.priceAmountEur.message}</p>}
            </div>
            <div>
              <label htmlFor="offer-price-xaf" className="block text-sm font-medium text-gray-700 mb-1">Prix XAF (Mobile Money)</label>
              <input
                id="offer-price-xaf"
                type="text"
                {...register('priceAmountXaf')}
                placeholder="2000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.priceAmountXaf && <p className="text-error text-sm mt-1">{errors.priceAmountXaf.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="offer-sort-order" className="block text-sm font-medium text-gray-700 mb-1">Ordre d&apos;affichage</label>
            <input
              id="offer-sort-order"
              type="number"
              {...register('sortOrder', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
              <span className="text-sm text-gray-700">Mettre en avant sur la page tarifs</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
              <span className="text-sm text-gray-700">Proposée à l&apos;achat</span>
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
              {isSubmitting ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer l\'offre'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
