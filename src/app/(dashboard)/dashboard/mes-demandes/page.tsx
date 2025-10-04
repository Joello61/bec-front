'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { DemandeList, DemandeFilters } from '@/components/demande';
import { DemandeForm } from '@/components/forms';
import { useDemandeActions, useAuth, useUserDemandes } from '@/lib/hooks';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import type { DemandeFilters as DemandeFiltersType } from '@/types';
import { CreateDemandeFormData } from '@/lib/validations';

export default function DemandesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<DemandeFiltersType>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { user } = useAuth();

  const { createDemande } = useDemandeActions();
  const { demandes, isLoading, error, refetch } = useUserDemandes(user?.id);

  if (!user) {
    return null
  }

  const handleCreateDemande = async (data: CreateDemandeFormData) => {
    const demande = await createDemande(data);
    setIsCreateModalOpen(false);
    router.push(ROUTES.MES_DEMANDE_DETAILS(demande.id));
  };

  if (error && !demandes.length) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Erreur de chargement"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className='text-center md:text-left'>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Demandes</h1>
          <p className="text-gray-600">Gérez vos demandes de transport</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Créer une demande
        </Button>
      </div>

      {/* Filters */}
      <DemandeFilters
        onFilterChange={setFilters}
        initialFilters={filters}
      />

      {/* Content */}
      <div className="mt-8">
        {isLoading && demandes.length === 0 ? (
          <LoadingSpinner text="Chargement des demandes..." />
        ) : demandes.length === 0 ? (
          <EmptyState
            title="Aucune demande"
            description="Commencez par créer votre première demande de transport"
            action={{
              label: 'Créer une demande',
              onClick: () => setIsCreateModalOpen(true),
            }}
          />
        ) : (
          <DemandeList
            demandes={demandes}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer une demande"
        size="lg"
      >
        <div className="p-6">
          <DemandeForm
            onSubmit={handleCreateDemande}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}