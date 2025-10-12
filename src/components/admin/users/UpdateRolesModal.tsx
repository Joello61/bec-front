'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui';
import { useAdmin } from '@/lib/hooks';
import { updateRolesSchema, type UpdateRolesFormData } from '@/lib/validations/admin.schema';
import { useToast } from '@/components/common';
import type { User } from '@/types';
import { X, Shield } from 'lucide-react';

interface UpdateRolesModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateRolesModal({ user, onClose, onSuccess }: UpdateRolesModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUserRoles } = useAdmin();
  const toast = useToast();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateRolesFormData>({
    resolver: zodResolver(updateRolesSchema),
    defaultValues: {
      roles: user.roles,
      notifyUser: true,
    },
  });

  const availableRoles = [
    { value: 'ROLE_USER', label: 'Utilisateur', description: 'Accès standard à la plateforme' },
    { value: 'ROLE_MODERATOR', label: 'Modérateur', description: 'Peut modérer les contenus' },
    { value: 'ROLE_ADMIN', label: 'Administrateur', description: 'Accès complet à l\'administration' },
  ];

  const onSubmit = async (data: UpdateRolesFormData) => {
    setIsSubmitting(true);
    try {
      await updateUserRoles(user.id, data);
      toast.success('Rôles mis à jour avec succès');
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
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Modifier les rôles</h2>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rôles *
            </label>
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  {availableRoles.map((role) => (
                    <label
                      key={role.value}
                      className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={role.value}
                        checked={field.value.includes(role.value)}
                        onChange={(e) => {
                          const newRoles = e.target.checked
                            ? [...field.value, role.value]
                            : field.value.filter((r) => r !== role.value);
                          field.onChange(newRoles);
                        }}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{role.label}</p>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.roles && (
              <p className="text-error text-sm mt-2">{errors.roles.message}</p>
            )}
          </div>

          {/* Raison (optionnelle) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raison de la modification (optionnel)
            </label>
            <textarea
              {...register('reason')}
              rows={3}
              placeholder="Expliquez pourquoi vous modifiez les rôles..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            {errors.reason && (
              <p className="text-error text-sm mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Notify User */}
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

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Attention :</strong> La modification des rôles prendra effet immédiatement.
              L&apos;utilisateur aura accès aux nouvelles permissions dès sa prochaine connexion.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
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
              {isSubmitting ? 'Modification...' : 'Modifier les rôles'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}