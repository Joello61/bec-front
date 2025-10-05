'use client';

import { useState } from 'react';
import PropositionCard from './PropositionCard';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/common';
import { Package } from 'lucide-react';
import type { Proposition } from '@/types';

interface PropositionListProps {
  propositions: Proposition[];
  viewMode: 'sent' | 'received';
  isLoading?: boolean;
  error?: string | null;
  onAccept?: (id: number) => void;
  onRefuse?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onRetry?: () => void;
}

export default function PropositionList({
  propositions,
  viewMode,
  isLoading,
  error,
  onAccept,
  onRefuse,
  onViewDetails,
  onRetry,
}: PropositionListProps) {
  const [filter, setFilter] = useState<'all' | 'en_attente' | 'acceptee' | 'refusee'>('all');

  const filteredPropositions = filter === 'all' 
    ? propositions 
    : propositions.filter(p => p.statut === filter);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton count={3} height="200px" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (propositions.length === 0) {
    return (
      <EmptyState
        icon={<Package className="w-16 h-16 text-gray-400" />}
        title={viewMode === 'sent' ? 'Aucune proposition envoyée' : 'Aucune proposition reçue'}
        description={
          viewMode === 'sent'
            ? 'Vous n\'avez pas encore fait de proposition sur un voyage'
            : 'Vous n\'avez pas encore reçu de proposition'
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes ({propositions.length})
        </button>
        <button
          onClick={() => setFilter('en_attente')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'en_attente'
              ? 'bg-warning text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          En attente ({propositions.filter(p => p.statut === 'en_attente').length})
        </button>
        <button
          onClick={() => setFilter('acceptee')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'acceptee'
              ? 'bg-success text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Acceptées ({propositions.filter(p => p.statut === 'acceptee').length})
        </button>
        <button
          onClick={() => setFilter('refusee')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'refusee'
              ? 'bg-error text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Refusées ({propositions.filter(p => p.statut === 'refusee').length})
        </button>
      </div>

      {/* Liste des propositions */}
      {filteredPropositions.length === 0 ? (
        <EmptyState
          title="Aucune proposition dans cette catégorie"
          description="Changez de filtre pour voir d'autres propositions"
        />
      ) : (
        <div className="grid gap-4">
          {filteredPropositions.map((proposition) => (
            <PropositionCard
              key={proposition.id}
              proposition={proposition}
              viewMode={viewMode}
              onAccept={onAccept}
              onRefuse={onRefuse}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}