'use client';

import { useState } from 'react';
import { DemandeList, DemandeFilters } from '@/components/demande';
import { useDemandes } from '@/lib/hooks';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common';
import type { DemandeFilters as DemandeFiltersType } from '@/types';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/utils/constants';

export default function DemandesPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<DemandeFiltersType>({});
  const router = useRouter()

  const { demandes, pagination, isLoading, error, refetch } = useDemandes(page, 10, filters);

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Demandes</h1>
          <p className="text-gray-600">Gérez vos demandes de transport</p>
        </div>
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
            title="Aucune demande Actuellement"
            description="Revenez plutard pour voir plus de demande"
            action={{
              label: 'Retour à l\'acceuil',
              onClick: () => router.push(ROUTES.HOME),
            }}
          />
        ) : (
          <DemandeList
            demandes={demandes}
            pagination={pagination}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}