'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/ui';
import { DemandeDetails } from '@/components/demande';
import { DemandeForm } from '@/components/forms';
import { ConfirmDialog } from '@/components/common';
import { useDemande, useDemandeActions, useAuth } from '@/lib/hooks';
import { ErrorState, LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import { UpdateDemandeFormData } from '@/lib/validations';

export default function DemandeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const demandeId = parseInt(params.id as string);

  const { user } = useAuth();
  const { demande, isLoading, error, refetch } = useDemande(demandeId);
  const { updateDemande, deleteDemande } = useDemandeActions();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === demande?.client.id;

  const handleUpdateDemande = async (data: UpdateDemandeFormData) => {
    await updateDemande(demandeId, data);
    setIsEditModalOpen(false);
    refetch();
  };

  const handleDeleteDemande = async () => {
    setIsDeleting(true);
    try {
      await deleteDemande(demandeId);
      router.push(ROUTES.DEMANDES);
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
      {/* Back Button */}
      <Link
        href={ROUTES.DEMANDES}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux demandes
      </Link>

      {/* Content */}
      <DemandeDetails
        demande={demande}
        isOwner={isOwner}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onContact={handleContact}
      />

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
        title="Supprimer cette demande ?"
        message="Cette action est irréversible. La demande sera définitivement supprimée."
        confirmLabel="Supprimer"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}