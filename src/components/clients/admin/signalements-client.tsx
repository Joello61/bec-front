'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { SignalementsTable, TraiterSignalementModal } from '@/components/admin';
import { LoadingSpinner } from '@/components/common';
import { Select } from '@/components/ui';
import { useSignalements } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import type { Signalement, SignalementStatut } from '@/types';

export default function AdminModerationSignalementsPageClient() {
  const [page, setPage] = useState(1);
  const [statutFilter, setStatutFilter] = useState<SignalementStatut | ''>('en_attente');
  const [selectedSignalement, setSelectedSignalement] = useState<Signalement | null>(null);
  const [showTraiterModal, setShowTraiterModal] = useState(false);

  const router = useRouter();
  const { signalements, pagination, isLoading, error, refetch } = useSignalements(
    page,
    20,
    statutFilter || undefined
  );

  const handleTraiter = (signalement: Signalement) => {
    setSelectedSignalement(signalement);
    setShowTraiterModal(true);
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
          <h1 className="text-3xl font-bold text-gray-900">Modération des Signalements</h1>
          <p className="text-gray-500 mt-1">
            {pagination?.total || 0} signalements au total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            options={[
              { value: '', label: 'Tous les statuts' },
              { value: 'en_attente', label: 'En attente' },
              { value: 'traite', label: 'Traité' },
              { value: 'rejete', label: 'Rejeté' },
            ]}
            value={statutFilter}
            onChange={(value) => {
              setStatutFilter(value as SignalementStatut | '');
              setPage(1);
            }}
            searchable={false}
          />

          <button
            onClick={() => {
              setStatutFilter('en_attente');
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Signalements Table */}
      {error ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : isLoading && signalements.length === 0 ? (
        <LoadingSpinner text="Chargement des signalements..." />
      ) : (
        <SignalementsTable
          signalements={signalements}
          pagination={pagination}
          onPageChange={setPage}
          onTraiter={handleTraiter}
        />
      )}

      {/* Traiter Modal */}
      {showTraiterModal && selectedSignalement && (
        <TraiterSignalementModal
          signalement={selectedSignalement}
          onClose={() => {
            setShowTraiterModal(false);
            setSelectedSignalement(null);
          }}
          onSuccess={() => {
            setShowTraiterModal(false);
            setSelectedSignalement(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
