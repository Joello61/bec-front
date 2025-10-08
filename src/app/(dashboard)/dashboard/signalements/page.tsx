    'use client';

import { useState } from 'react';
import { Flag, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common';
import type { SignalementStatut } from '@/types';
import { SignalementCard } from '@/components/signalement';
import { useMesSignalements } from '@/lib/hooks/useSignalement';

type FilterTab = 'all' | SignalementStatut;

export default function SignalementsPage() {
  const [currentFilter, setCurrentFilter] = useState<FilterTab>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const statutFilter = currentFilter === 'all' ? undefined : currentFilter;
  const { mesSignalements, pagination, isLoading, error, refetch } = useMesSignalements(
    currentPage,
    10,
    statutFilter
  );

  const getFilterStats = () => {
    // Ces stats pourraient venir d'un endpoint dédié
    return {
      all: pagination?.total || 0,
      en_attente: mesSignalements.filter(s => s.statut === 'en_attente').length,
      traite: mesSignalements.filter(s => s.statut === 'traite').length,
      rejete: mesSignalements.filter(s => s.statut === 'rejete').length,
    };
  };

  const stats = getFilterStats();

  const filters: { key: FilterTab; label: string; icon: typeof Clock; color: string }[] = [
    { key: 'all', label: 'Tous', icon: Flag, color: 'text-gray-600' },
    { key: 'en_attente', label: 'En attente', icon: Clock, color: 'text-amber-600' },
    { key: 'traite', label: 'Traités', icon: CheckCircle, color: 'text-green-600' },
    { key: 'rejete', label: 'Rejetés', icon: XCircle, color: 'text-red-600' },
  ];

  if (error && !mesSignalements.length) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Signalements</h1>
        <p className="text-gray-600">
          Suivez l&apos;état de vos signalements
        </p>
      </div>

      {/* Filters Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = currentFilter === filter.key;
            const count = stats[filter.key];

            return (
              <button
                key={filter.key}
                onClick={() => {
                  setCurrentFilter(filter.key);
                  setCurrentPage(1);
                }}
                className={`
                  flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{filter.label}</span>
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${isActive ? 'bg-white/20' : 'bg-gray-200'}
                `}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {isLoading && mesSignalements.length === 0 ? (
          <LoadingSpinner text="Chargement des signalements..." />
        ) : mesSignalements.length === 0 ? (
          <EmptyState
            icon={<Flag className="w-16 h-16 text-gray-300" />}
            title="Aucun signalement"
            description={
              currentFilter === 'all'
                ? "Vous n'avez effectué aucun signalement pour le moment"
                : `Aucun signalement ${currentFilter === 'en_attente' ? 'en attente' : currentFilter}`
            }
          />
        ) : (
          <div className="space-y-4">
            {mesSignalements.map((signalement) => (
              <SignalementCard key={signalement.id} signalement={signalement} />
            ))}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  Précédent
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} sur {pagination.pages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(pagination.page, p + 1))}
                  disabled={currentPage === pagination.pages || isLoading}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}