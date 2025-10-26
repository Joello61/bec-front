'use client';

import { useState } from 'react';
import { AlertCircle, Plus, Lightbulb, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Modal, Button } from '@/components/ui';
import PropositionForm from '@/components/forms/PropositionForm';
import { CurrencyDisplay } from '../common';
import { ROUTES } from '@/lib/utils/constants';
import type { Voyage, CreatePropositionInput } from '@/types';

interface PropositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  voyage: Voyage;
  userDemandes: Array<{
    id: number;
    villeDepart: string;
    villeArrivee: string;
    dateLimite: string;
    prixParKilo: number;
    commission: number;
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
  const router = useRouter();
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

  const handleCreateDemande = () => {
    onClose();
    router.push(ROUTES.MES_DEMANDES);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title='Faire une proposition'>
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
        </div>

        {/* Info voyage */}
        {userDemandes.length > 0 && (
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
              <div className='flex flex-col'>
                <span className="text-gray-600">Prix suggéré/kg:</span>
                <CurrencyDisplay
                  amount={voyage.prixParKilo}
                  currency={voyage.currency}
                  converted={voyage.converted}
                  viewerCurrency={voyage.viewerCurrency}
                  field="prixParKilo"
                  className="text-sm sm:text-base font-semibold text-gray-900"
                />
              </div>
            )}
            {voyage.commissionProposeePourUnBagage && (
              <div className='flex flex-col'>
                <span className="text-gray-600">Commission suggérée:</span>
                <CurrencyDisplay
                  amount={voyage.commissionProposeePourUnBagage}
                  currency={voyage.currency}
                  converted={voyage.converted}
                  viewerCurrency={voyage.viewerCurrency}
                  field="commission"
                  className="text-sm sm:text-base font-semibold text-gray-900"
                />
              </div>
            )}
          </div>
        </div>
        )}

        {/* Formulaire ou message si aucune demande */}
        {userDemandes.length === 0 ? (
          <div className="text-center py-3">
            {/* Icône d'alerte */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-warning" />
            </div>

            {/* Titre */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune demande correspondante
            </h3>

            {/* Message explicatif */}
            <p className="text-gray-600 mb-1 max-w-md mx-auto">
              Pour faire une proposition sur ce voyage, vous devez d&apos;abord créer une demande 
              pour le même trajet :
            </p>
            <p className="text-gray-900 font-semibold mb-6">
              {voyage.villeDepart} <ArrowRight className="inline-block mx-1" /> {voyage.villeArrivee}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button 
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleCreateDemande}
              >
                Créer une demande
              </Button>
            </div>

            {/* Info supplémentaire */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <p className="text-sm text-blue-900">
                <strong> <Lightbulb className="w-4 h-4 inline-block mr-1" /> Comment ça marche ?</strong>
              </p>
              <ol className="mt-2 text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Créez une demande pour le trajet {voyage.villeDepart}  <ArrowRight className="inline-block mx-1" /> {voyage.villeArrivee}</li>
                <li>Revenez sur ce voyage</li>
                <li>Faites votre proposition en liant votre demande</li>
              </ol>
            </div>
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