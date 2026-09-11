'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DeleteContentModal, ModerationAvisTable } from '@/components/admin';
import { LoadingSpinner } from '@/components/common';
import { Select } from '@/components/ui';
import { useAdmin } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import type { Avis } from '@/types';

export default function AdminModerationAvisPageClient() {
  const [page, setPage] = useState(1);
  const [maxNote, setMaxNote] = useState<string>('');
  const [selectedAvis, setSelectedAvis] = useState<Avis | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();
  const { avisList, avisPagination, isLoading, error, fetchAvisList } = useAdmin();

  useEffect(() => {
    fetchAvisList(page, 20, maxNote ? { maxNote: Number(maxNote) } : undefined);
  }, [page, maxNote, fetchAvisList]);

  const handleDelete = (avis: Avis) => {
    setSelectedAvis(avis);
    setShowDeleteModal(true);
  };

  const refetch = () => fetchAvisList(page, 20, maxNote ? { maxNote: Number(maxNote) } : undefined);

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
          <h1 className="text-3xl font-bold text-gray-900">Modération des Avis</h1>
          <p className="text-gray-500 mt-1">
            {avisPagination?.total || 0} avis au total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            options={[
              { value: '', label: 'Toutes les notes' },
              { value: '1', label: '1 étoile ou moins' },
              { value: '2', label: '2 étoiles ou moins' },
              { value: '3', label: '3 étoiles ou moins' },
            ]}
            value={maxNote}
            onChange={(value) => {
              setMaxNote(value);
              setPage(1);
            }}
            searchable={false}
          />

          <button
            onClick={() => {
              setMaxNote('');
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
          <strong>Info :</strong> La suppression d&apos;un avis notifiera automatiquement
          l&apos;auteur et la cible, et enregistrera l&apos;action dans les logs d&apos;administration.
        </p>
      </div>

      {/* Avis Table */}
      {error ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : isLoading && avisList.length === 0 ? (
        <LoadingSpinner text="Chargement des avis..." />
      ) : (
        <ModerationAvisTable
          avisList={avisList}
          pagination={avisPagination}
          onPageChange={setPage}
          onDelete={handleDelete}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedAvis && (
        <DeleteContentModal
          contentType="avis"
          contentId={selectedAvis.id}
          contentTitle={`Avis de ${selectedAvis.auteur.prenom} ${selectedAvis.auteur.nom} sur ${selectedAvis.cible.prenom} ${selectedAvis.cible.nom}`}
          userId={selectedAvis.auteur.id}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAvis(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setSelectedAvis(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
