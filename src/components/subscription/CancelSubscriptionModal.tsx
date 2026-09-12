'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '@/components/common';
import { Modal, ModalFooter } from '@/components/ui';
import { useSubscriptionActions } from '@/lib/hooks';

interface CancelSubscriptionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CancelSubscriptionModal({ onClose, onSuccess }: CancelSubscriptionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cancelSubscription } = useSubscriptionActions();
  const toast = useToast();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await cancelSubscription();
      toast.success('Résiliation programmée à la fin de la période en cours');
      onSuccess();
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
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Résilier mon abonnement</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          Votre abonnement restera actif jusqu&apos;à la fin de la période en cours, puis ne sera pas
          reconduit. Vous ne serez plus débité par la suite.
        </p>

        <ModalFooter>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Garder mon abonnement
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Résiliation...' : 'Confirmer la résiliation'}
          </button>
        </ModalFooter>
      </div>
    </Modal>
  );
}
