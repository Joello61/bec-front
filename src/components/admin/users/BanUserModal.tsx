'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui';
import { useAdmin } from '@/lib/hooks';
import { banUserSchema, type BanUserFormData } from '@/lib/validations/admin.schema';
import { useToast } from '@/components/common';
import type { User } from '@/types';
import { X, AlertTriangle } from 'lucide-react';

interface BanUserModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BanUserModal({ user, onClose, onSuccess }: BanUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { banUser, unbanUser } = useAdmin();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BanUserFormData>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      type: 'permanent',
      notifyUser: true,
      deleteContent: false,
    },
  });

  const banType = watch('type');
  const isBanned = user.isBanned;

  const onSubmit = async (data: BanUserFormData) => {
    setIsSubmitting(true);
    try {
      if (isBanned) {
        // Débannir
        await unbanUser(user.id);
        toast.success('Utilisateur débanni avec succès');
      } else {
        // Bannir
        await banUser(user.id, data);
        toast.success('Utilisateur banni avec succès');
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {isBanned ? 'Débannir l\'utilisateur' : 'Bannir l\'utilisateur'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Utilisateur concerné</p>
          <p className="font-semibold text-gray-900">
            {user.prenom} {user.nom}
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {isBanned ? (
          // Débannir
          <div>
            <p className="text-gray-700 mb-6">
              Êtes-vous sûr de vouloir débannir cet utilisateur ? Il pourra à nouveau accéder à la plateforme.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={() => onSubmit({} as BanUserFormData)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Débannissement...' : 'Débannir'}
              </button>
            </div>
          </div>
        ) : (
          // Bannir
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Type de ban */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de bannissement
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="permanent"
                    {...register('type')}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Permanent</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="temporary"
                    {...register('type')}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Temporaire</span>
                </label>
              </div>
            </div>

            {/* Date de fin (si temporaire) */}
            {banType === 'temporary' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin du bannissement
                </label>
                <input
                  type="datetime-local"
                  {...register('bannedUntil')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.bannedUntil && (
                  <p className="text-error text-sm mt-1">{errors.bannedUntil.message}</p>
                )}
              </div>
            )}

            {/* Raison */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison du bannissement *
              </label>
              <textarea
                {...register('reason')}
                rows={4}
                placeholder="Expliquez la raison du bannissement..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              {errors.reason && (
                <p className="text-error text-sm mt-1">{errors.reason.message}</p>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register('notifyUser')}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  Notifier l&apos;utilisateur par email
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register('deleteContent')}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  Supprimer également tous ses contenus (voyages, demandes, avis)
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
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
                className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Bannissement...' : 'Bannir l\'utilisateur'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}