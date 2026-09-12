'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/components/common';
import { Modal } from '@/components/ui';
import { useAdmin } from '@/lib/hooks';
import { type RefundTransactionFormData, refundTransactionSchema } from '@/lib/validations/admin.schema';
import type { AdminTransaction } from '@/types';

interface RefundConfirmModalProps {
  transaction: AdminTransaction;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Remboursement toujours total (jamais partiel, cf. CGU art. 10.5) - declenche un appel
 * reel au prestataire de paiement (Stripe/Notch Pay), irreversible une fois confirme.
 */
export default function RefundConfirmModal({ transaction, onClose, onSuccess }: RefundConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refundTransaction } = useAdmin();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RefundTransactionFormData>({
    resolver: zodResolver(refundTransactionSchema),
  });

  const onSubmit = async (data: RefundTransactionFormData) => {
    setIsSubmitting(true);
    try {
      await refundTransaction(transaction.id, data);
      toast.success('Transaction remboursée avec succès');
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Rembourser cette transaction ?</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Le remboursement est toujours total, jamais partiel. Cette action déclenche un appel réel au
          prestataire de paiement ({transaction.provider === 'stripe' ? 'Stripe' : 'Notch Pay'}) et est
          irréversible une fois confirmée.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="refund-reason" className="block text-sm font-medium text-gray-700 mb-2">
              Raison (optionnelle)
            </label>
            <textarea
              id="refund-reason"
              {...register('reason')}
              rows={3}
              placeholder="Expliquez la raison du remboursement..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            {errors.reason && <p className="text-error text-sm mt-1">{errors.reason.message}</p>}
          </div>

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
              className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Remboursement...' : 'Rembourser'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
