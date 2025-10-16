'use client';

import { useState, useMemo } from 'react';
import { useVoyages } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common';
import { Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/utils/constants';
import type { Voyage, VoyageStatut, VoyageFilters } from '@/types';
import { ModerationVoyagesTable, DeleteContentModal } from '@/components/admin';
import { Select } from '@/components/ui';

export default function AdminModerationVoyagesPageClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VoyageStatut | ''>('');
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();

  // ✅ Utiliser useMemo pour stabiliser l'objet filters
  const filters = useMemo<VoyageFilters | undefined>(() => {
    return statusFilter ? { statut: statusFilter as VoyageStatut } : undefined;
  }, [statusFilter]);

  const { voyages, pagination, isLoading, error, refetch } = useVoyages(
    page,
    10,
    filters
  );

  const handleDelete = (voyage: Voyage) => {
    setSelectedVoyage(voyage);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push(ROUTES.ADMIN_MODERATION)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Modération des Voyages
          </h1>
          <p className="text-gray-500 mt-1">
            {pagination?.total || 0} voyages au total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un voyage..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <Select
            options={[
              { value: '', label: 'Tous les statuts' },
              { value: 'actif', label: 'Actif' },
              { value: 'en_cours', label: 'En cours' },
              { value: 'complete', label: 'Complété' },
              { value: 'annule', label: 'Annulé' }
            ]}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value as VoyageStatut | '');
              setPage(1);
            }}
            searchable={false}
          />

          {/* Reset */}
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Info :</strong> La suppression d&apos;un voyage notifiera
          automatiquement le voyageur et enregistrera l&apos;action dans les
          logs d&apos;administration.
        </p>
      </div>

      {/* Voyages Table */}
      {error ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : isLoading && voyages.length === 0 ? (
        <LoadingSpinner text="Chargement des voyages..." />
      ) : (
        <ModerationVoyagesTable
          voyages={voyages}
          pagination={pagination}
          onPageChange={setPage}
          onDelete={handleDelete}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedVoyage && (
        <DeleteContentModal
          contentType="voyage"
          contentId={selectedVoyage.id}
          contentTitle={`${selectedVoyage.villeDepart} vers ${selectedVoyage.villeArrivee}`}
          userId={selectedVoyage.voyageur.id}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedVoyage(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setSelectedVoyage(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
