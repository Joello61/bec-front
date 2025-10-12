'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Modal } from '@/components/ui';
import PropositionForm from '@/components/forms/PropositionForm';
import type { Voyage, CreatePropositionInput } from '@/types';

interface PropositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  voyage: Voyage;
  userDemandes: Array<{
    id: number;
    villeDepart: string;
    villeArrivee: string;
  }>;
  onSubmit: (data: CreatePropositionInput) => Promise<void>;
}

export default function PropositionModal({
  isOpen,
  onClose,
  voyage,
  userDemandes,
  onSubmit,
}: PropositionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreatePropositionInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Faire une proposition
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Voyage: {voyage.villeDepart} vers {voyage.villeArrivee}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Info voyage */}
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Départ:</span>
              <p className="font-medium text-gray-900">
                {new Date(voyage.dateDepart).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Poids disponible:</span>
              <p className="font-medium text-gray-900">
                {voyage.poidsDisponible} kg
              </p>
            </div>
            {voyage.prixParKilo && (
              <div>
                <span className="text-gray-600">Prix suggéré/kg:</span>
                <p className="font-medium text-primary">
                  {voyage.prixParKilo} XAF
                </p>
              </div>
            )}
            {voyage.commissionProposeePourUnBagage && (
              <div>
                <span className="text-gray-600">Commission suggérée:</span>
                <p className="font-medium text-secondary-dark">
                  {voyage.commissionProposeePourUnBagage} XAF
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Formulaire */}
        {userDemandes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Vous devez avoir une demande pour faire une proposition
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Créer une demande
            </button>
          </div>
        ) : (
          <PropositionForm
            voyage={voyage}
            userDemandes={userDemandes}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </Modal>
  );
}
