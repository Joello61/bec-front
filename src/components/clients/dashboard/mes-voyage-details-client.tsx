'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Inbox } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/ui';
import { VoyageDetails } from '@/components/voyage';
import { VoyageForm } from '@/components/forms';
import { PropositionList } from '@/components/propositions';
import { ConfirmDialog, ErrorState, LoadingSpinner, useToast } from '@/components/common';
import { 
  useVoyage, 
  useVoyageActions, 
  useAuth, 
  useVoyagePropositions,
  usePropositionActions 
} from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import { UpdateVoyageFormData } from '@/lib/validations';

export default function VoyageDetailsPageClient() {
  const router = useRouter();
  const params = useParams();
  const voyageId = parseInt(params.id as string);

  const { user } = useAuth();
  const { voyage, isLoading, error, refetch } = useVoyage(voyageId);
  const { updateVoyage, deleteVoyage } = useVoyageActions();
  
  const { 
    propositions, 
    isLoading: isLoadingPropositions,
    refetch: refetchPropositions 
  } = useVoyagePropositions(voyageId);
  
  const { respondToProposition } = usePropositionActions();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();
  
  // Gestion refus
  const [selectedProposition, setSelectedProposition] = useState<number | null>(null);
  const [refusalReason, setRefusalReason] = useState('');
  const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState(false);

  const isOwner = user?.id === voyage?.voyageur.id;

  const handleUpdateVoyage = async (data: UpdateVoyageFormData) => {
    await updateVoyage(voyageId, data);
    setIsEditModalOpen(false);
    refetch();
  };

  const handleDeleteVoyage = async () => {
    setIsDeleting(true);
    try {
      await deleteVoyage(voyageId);
      setIsDeleteDialogOpen(false);
      toast.success("Voyage Annulé avec succès !");
      refetch()
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAcceptProposition = async (propositionId: number) => {
    await respondToProposition(propositionId, { action: 'accepter' });
    refetchPropositions();
  };

  const handleRefuseProposition = async () => {
    if (!selectedProposition) return;
    
    await respondToProposition(selectedProposition, { 
      action: 'refuser',
      messageRefus: refusalReason || undefined
    });
    
    refetchPropositions();
    setIsRefuseDialogOpen(false);
    setSelectedProposition(null);
    setRefusalReason('');
  };

  const openRefuseDialog = (propositionId: number) => {
    setSelectedProposition(propositionId);
    setIsRefuseDialogOpen(true);
  };

  const handleContact = () => {
    if (voyage) {
      router.push(ROUTES.CONVERSATION(voyage.voyageur.id));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner fullScreen text="Chargement du voyage..." />
      </div>
    );
  }

  if (error || !voyage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Voyage introuvable"
          message={error || "Ce voyage n'existe pas ou a été supprimé"}
          onRetry={refetch}
        />
      </div>
    );
  }

  // Calculer les propositions en attente
  const pendingCount = propositions.filter(p => p.statut === 'en_attente').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Bouton retour */}
        <Link
          href={ROUTES.MES_VOYAGES}
          className="inline-flex items-center gap-2 text-sm md:text-base text-gray-600 hover:text-gray-900 mb-4 md:mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux voyages</span>
        </Link>

        {/* Détails du voyage */}
        <VoyageDetails
          voyage={voyage}
          isOwner={isOwner}
          onEdit={() => setIsEditModalOpen(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
          onContact={handleContact}
        />

        {/* Propositions reçues - Header amélioré et responsive */}
        {isOwner && (
          <div className="mt-8 md:mt-12">
            {/* Header responsive */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Icône + Titre */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Inbox className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                      Propositions reçues
                    </h2>
                    <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                      {propositions.length > 0 
                        ? `${propositions.length} proposition${propositions.length > 1 ? 's' : ''} au total`
                        : 'Aucune proposition pour le moment'
                      }
                    </p>
                  </div>
                </div>

                {/* Badge des propositions en attente */}
                {pendingCount > 0 && (
                  <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-warning/10 border border-warning/30 rounded-lg flex-shrink-0">
                    <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                    <span className="text-xs md:text-sm font-semibold text-warning-dark whitespace-nowrap">
                      {pendingCount} en attente
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Liste des propositions */}
            <PropositionList
              propositions={propositions}
              viewMode="received"
              isLoading={isLoadingPropositions}
              onAccept={handleAcceptProposition}
              onRefuse={openRefuseDialog}
              onViewVoyageDetails={() => router.push(ROUTES.VOYAGE_DETAILS(voyageId))}
            />
          </div>
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Modifier le voyage"
          size="lg"
        >
          <div className="p-6">
            <VoyageForm
              voyage={voyage}
              onSubmit={handleUpdateVoyage}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </div>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteVoyage}
          title="Annuler ce voyage ?"
          message="Cette action est irréversible. Le voyage sera définitivement annulé."
          confirmLabel="Annuler"
          variant="danger"
          isLoading={isDeleting}
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
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsRefuseDialogOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRefuseProposition}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-error text-white rounded-lg hover:bg-error/90 transition-colors"
              >
                Refuser la proposition
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}