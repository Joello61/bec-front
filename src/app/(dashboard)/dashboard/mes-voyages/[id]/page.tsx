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

export default function VoyageDetailsPage() {
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
      <div className="container-custom py-8">
        <LoadingSpinner fullScreen text="Chargement du voyage..." />
      </div>
    );
  }

  if (error || !voyage) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Voyage introuvable"
          message={error || "Ce voyage n'existe pas ou a été supprimé"}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Link
        href={ROUTES.MES_VOYAGES}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux voyages
      </Link>

      <VoyageDetails
        voyage={voyage}
        isOwner={isOwner}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onContact={handleContact}
      />

      {/* Propositions reçues */}
      {isOwner && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Inbox className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">
              Propositions reçues
            </h2>
            {propositions.length > 0 && (
              <span className="badge badge-primary ml-2">
                {propositions.filter(p => p.statut === 'en_attente').length} en attente
              </span>
            )}
          </div>

          <PropositionList
            propositions={propositions}
            viewMode="received"
            isLoading={isLoadingPropositions}
            onAccept={handleAcceptProposition}
            onRefuse={openRefuseDialog}
            onViewDetails={(demandeId) => router.push(ROUTES.DEMANDE_DETAILS(demandeId))}
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
        <div className="p-6 space-y-4">
          <p className="text-gray-700">
            Souhaitez-vous expliquer la raison du refus ? (optionnel)
          </p>
          
          <textarea
            className="input"
            rows={4}
            placeholder="Raison du refus..."
            value={refusalReason}
            onChange={(e) => setRefusalReason(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={() => setIsRefuseDialogOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleRefuseProposition}
              className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90"
            >
              Refuser la proposition
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}