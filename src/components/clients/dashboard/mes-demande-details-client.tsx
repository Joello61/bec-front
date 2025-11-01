'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/ui';
import { DemandeDetails } from '@/components/demande';
import { DemandeForm } from '@/components/forms';
import { PropositionList } from '@/components/propositions';
import { VoyageCard } from '@/components/voyage';
import { ConfirmDialog, EmptyState, LoadingSpinner, ErrorState, useToast } from '@/components/common';
import { 
  useDemande, 
  useDemandeActions, 
  useAuth,
  useMyPropositionsSent,
  useMatchingVoyages 
} from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import { UpdateDemandeFormData } from '@/lib/validations';

export default function DemandeDetailsPageClient() {
  const router = useRouter();
  const params = useParams();
  const demandeId = parseInt(params.id as string);
  const toast = useToast();

  const { user } = useAuth();
  const { demande, isLoading, error, refetch } = useDemande(demandeId);
  const { updateDemande, deleteDemande } = useDemandeActions();
  
  // ✅ Utilisation de vos hooks existants
  const { propositions: allSentPropositions } = useMyPropositionsSent();
  const { voyages: matchingVoyages, isLoading: isLoadingMatching } = useMatchingVoyages(demandeId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === demande?.client.id;

  // Filtrer les propositions pour cette demande
  const propositions = allSentPropositions.filter(p => p.demande.id === demandeId);

  const handleUpdateDemande = async (data: UpdateDemandeFormData) => {
    await updateDemande(demandeId, data);
    setIsEditModalOpen(false);
    refetch();
  };

  const handleDeleteDemande = async () => {
    setIsDeleting(true);
    try {
      await deleteDemande(demandeId);
      setIsDeleteDialogOpen(false);
      toast.success("Demande annulée avec succès !");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleContact = () => {
    if (demande) {
      router.push(ROUTES.CONVERSATION(demande.client.id));
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner fullScreen text="Chargement de la demande..." />
      </div>
    );
  }

  if (error || !demande) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Demande introuvable"
          message={error || "Cette demande n'existe pas ou a été supprimée"}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Link
        href={ROUTES.MES_DEMANDES}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux demandes
      </Link>

      <DemandeDetails
        demande={demande}
        isOwner={isOwner}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onContact={handleContact}
      />

      {/* Propositions envoyées */}
      {isOwner && propositions.length > 0 && (
        <div className="mt-12">
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Icône + Titre */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                    Propositions envoyées
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                    {propositions.length > 0 
                      ? `${propositions.length} proposition${propositions.length > 1 ? 's' : ''} au total`
                      : 'Aucune proposition pour le moment'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <PropositionList
            propositions={propositions}
            viewMode="sent"
            onViewVoyageDetails={(voyageId) => router.push(ROUTES.VOYAGE_DETAILS(voyageId))}
          />
        </div>
      )}

      {/* Voyages correspondants */}
      {isOwner && (
        <div className="mt-12">
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Icône + Titre */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                    Voyages correspondants
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                    {matchingVoyages.length > 0 
                      ? `${matchingVoyages.length} voyage${matchingVoyages.length > 1 ? 's' : ''} au total`
                      : 'Aucun voyage correspondant pour le moment'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isLoadingMatching ? (
            <LoadingSpinner text="Recherche de voyages..." />
          ) : matchingVoyages.length === 0 ? (
            <EmptyState
              title="Aucun voyage correspondant"
              description="Aucun voyage ne correspond à votre demande pour le moment"
            />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {matchingVoyages.map((item) => (
                  <div key={item.voyage.id} className="relative">
                    <div className="absolute top-[-12px] right-0 z-10 bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {item.score}% match
                    </div>
                    
                    <VoyageCard voyage={item.voyage} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier la demande"
        size="lg"
      >
        <div className="p-6">
          <DemandeForm
            demande={demande}
            onSubmit={handleUpdateDemande}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteDemande}
        title="Annuler cette demande ?"
        message="Cette action est irréversible. La demande sera définitivement annulée."
        confirmLabel="Annuler"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}