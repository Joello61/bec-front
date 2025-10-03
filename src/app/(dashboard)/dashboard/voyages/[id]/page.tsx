'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/ui';
import { VoyageDetails } from '@/components/voyage';
import { VoyageForm } from '@/components/forms';
import { ConfirmDialog } from '@/components/common';
import { useVoyage, useVoyageActions, useAuth } from '@/lib/hooks';
import { ErrorState, LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import { UpdateVoyageFormData } from '@/lib/validations';

export default function VoyageDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const voyageId = parseInt(params.id as string);

  const { user } = useAuth();
  const { voyage, isLoading, error, refetch } = useVoyage(voyageId);
  const { updateVoyage, deleteVoyage } = useVoyageActions();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      router.push(ROUTES.VOYAGES);
    } finally {
      setIsDeleting(false);
    }
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
      {/* Back Button */}
      <Link
        href={ROUTES.VOYAGES}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux voyages
      </Link>

      {/* Content */}
      <VoyageDetails
        voyage={voyage}
        isOwner={isOwner}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onContact={handleContact}
      />

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
        title="Supprimer ce voyage ?"
        message="Cette action est irréversible. Le voyage sera définitivement supprimé."
        confirmLabel="Supprimer"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}