'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/ui';
import { ErrorState, LoadingSpinner, useToast } from '@/components/common';
import { useAuth, usePropositionActions } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import { useProposition } from '@/lib/hooks/usePropositions';
import PropositionDetails from '@/components/propositions/PropositionDetails';

export default function PropositionDetailsPageClient() {
  const router = useRouter();
  const params = useParams();
  const propositionId = parseInt(params.id as string);

  const { user } = useAuth();
  const { respondToProposition } = usePropositionActions();
  const toast = useToast();
  const { proposition, isLoading, error, refetch } = useProposition(propositionId);

  // Gestion refus
  const [refusalReason, setRefusalReason] = useState('');
  const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);

  if (!user) {
    return null;
  }

  const handleAccept = async () => {
    if (!proposition) return;
    
    setIsResponding(true);
    try {
      await respondToProposition(proposition.id, { action: 'accepter' });
      toast.success('Proposition acceptée avec succès !');
      refetch();
    } catch (err) {
      toast.error('Erreur lors de l\'acceptation');
      console.error(err);
    } finally {
      setIsResponding(false);
    }
  };

  const handleRefuse = async () => {
    if (!proposition) return;
    
    setIsResponding(true);
    try {
      await respondToProposition(proposition.id, { 
        action: 'refuser',
        messageRefus: refusalReason || undefined
      });
      
      toast.success('Proposition refusée');
      setIsRefuseDialogOpen(false);
      setRefusalReason('');
      refetch();
    } catch (err) {
      toast.error('Erreur lors du refus');
      console.error(err);
    } finally {
      setIsResponding(false);
    }
  };

  const handleContactClient = () => {
    if (proposition) {
      router.push(ROUTES.CONVERSATION(proposition.client.id));
    }
  };

  const handleContactVoyageur = () => {
    if (proposition) {
      router.push(ROUTES.CONVERSATION(proposition.voyageur.id));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner fullScreen text="Chargement de la proposition..." />
      </div>
    );
  }

  if (error || !proposition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Proposition introuvable"
          message={error || "Cette proposition n'existe pas ou a été supprimée"}
          onRetry={refetch}
        />
      </div>
    );
  }

  const isReceived = proposition.voyageur.id === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Bouton retour */}
        <Link
          href={ROUTES.MES_PROPOSITIONS}
          className="inline-flex items-center gap-2 text-sm md:text-base text-gray-600 hover:text-gray-900 mb-4 md:mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux propositions</span>
        </Link>

        {/* Détails de la proposition */}
        <PropositionDetails
          proposition={proposition}
          isReceived={isReceived}
          onAccept={handleAccept}
          onRefuse={() => setIsRefuseDialogOpen(true)}
          onContactClient={handleContactClient}
          onContactVoyageur={handleContactVoyageur}
          isResponding={isResponding}
        />

        {/* Refuse Dialog */}
        <Modal
          isOpen={isRefuseDialogOpen}
          onClose={() => setIsRefuseDialogOpen(false)}
          title="Refuser la proposition"
          size="md"
        >
          <div className="p-4 md:p-6 space-y-4">
            <p className="text-sm md:text-base text-gray-700">
              Souhaitez-vous expliquer la raison du refus ? (optionnel)
            </p>
            
            <textarea
              className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
              placeholder="Raison du refus..."
              value={refusalReason}
              onChange={(e) => setRefusalReason(e.target.value)}
              disabled={isResponding}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsRefuseDialogOpen(false)}
                disabled={isResponding}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleRefuse}
                disabled={isResponding}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
              >
                {isResponding ? 'Refus en cours...' : 'Refuser la proposition'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}