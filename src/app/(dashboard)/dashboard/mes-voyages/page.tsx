'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { VoyageList, VoyageFilters } from '@/components/voyage';
import { VoyageForm } from '@/components/forms';
import { useVoyages, useVoyageActions } from '@/lib/hooks';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import type { VoyageFilters as VoyageFiltersType } from '@/types';
import { CreateVoyageFormData } from '@/lib/validations/voyage.schema';

export default function VoyagesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<VoyageFiltersType>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { voyages, pagination, isLoading, error, refetch } = useVoyages(page, 10, filters);
  const { createVoyage } = useVoyageActions();

  const handleCreateVoyage = async (data: CreateVoyageFormData) => {
    const voyage = await createVoyage(data);
    setIsCreateModalOpen(false);
    router.push(ROUTES.MES_VOYAGE_DETAILS(voyage.id));
  };

  if (error && !voyages.length) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Voyages</h1>
          <p className="text-gray-600">Gérez vos annonces de voyage</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Créer un voyage
        </Button>
      </div>

      {/* Filters */}
      <VoyageFilters
        onFilterChange={setFilters}
        initialFilters={filters}
      />

      {/* Content */}
      <div className="mt-8">
        {isLoading && voyages.length === 0 ? (
          <LoadingSpinner text="Chargement des voyages..." />
        ) : voyages.length === 0 ? (
          <EmptyState
            title="Aucun voyage"
            description="Commencez par créer votre premier voyage"
            action={{
              label: 'Créer un voyage',
              onClick: () => setIsCreateModalOpen(true),
            }}
          />
        ) : (
          <VoyageList
            voyages={voyages}
            pagination={pagination}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un voyage"
        size="lg"
      >
        <div className="p-6">
          <VoyageForm
            onSubmit={handleCreateVoyage}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}