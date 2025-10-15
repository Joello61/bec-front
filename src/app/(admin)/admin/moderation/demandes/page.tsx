'use client';

import { useState, useMemo } from 'react';
import { useDemandes } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common';
import { Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/utils/constants';
import type { Demande, DemandeStatut, DemandeFilters } from '@/types';
import {
  ModerationDemandesTable,
  DeleteContentModal,
} from '@/components/admin';
import { Select } from '@/components/ui';

export default function AdminModerationDemandesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DemandeStatut | ''>('');
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();

  // ✅ Utiliser useMemo pour stabiliser l'objet filters
  const filters = useMemo<DemandeFilters | undefined>(() => {
    return statusFilter ? { statut: statusFilter as DemandeStatut } : undefined;
  }, [statusFilter]);

  const { demandes, pagination, isLoading, error, refetch } = useDemandes(
    page,
    10,
    filters
  );

  const handleDelete = (demande: Demande) => {
    setSelectedDemande(demande);
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
            Modération des Demandes
          </h1>
          <p className="text-gray-500 mt-1">
            {pagination?.total || 0} demandes au total
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
              placeholder="Rechercher une demande..."
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
              { value: 'en_recherche', label: 'En recherche' },
              { value: 'voyageur_trouve', label: 'Voyageur trouvé' },
              { value: 'annulee', label: 'Annulée' }
            ]}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value as DemandeStatut | '');
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
          <strong>Info :</strong> La suppression d&apos;une demande notifiera
          automatiquement le client et enregistrera l&apos;action dans les logs
          d&apos;administration.
        </p>
      </div>

      {/* Demandes Table */}
      {error ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : isLoading && demandes.length === 0 ? (
        <LoadingSpinner text="Chargement des demandes..." />
      ) : (
        <ModerationDemandesTable
          demandes={demandes}
          pagination={pagination}
          onPageChange={setPage}
          onDelete={handleDelete}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedDemande && (
        <DeleteContentModal
          contentType="demande"
          contentId={selectedDemande.id}
          contentTitle={`${selectedDemande.villeDepart} vers ${selectedDemande.villeArrivee}`}
          userId={selectedDemande.client.id}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedDemande(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setSelectedDemande(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
