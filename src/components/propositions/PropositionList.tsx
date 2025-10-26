'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PropositionCard from './PropositionCard';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/common';
import { Package, Filter } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Proposition } from '@/types';
import { Select } from '../ui';

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

type FilterType = 'all' | 'en_attente' | 'acceptee' | 'refusee' | 'annulee';

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
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredPropositions = filter === 'all' 
    ? propositions 
    : propositions.filter(p => p.statut === filter);

  // Calculer les compteurs
  const counts = {
    all: propositions.length,
    en_attente: propositions.filter(p => p.statut === 'en_attente').length,
    acceptee: propositions.filter(p => p.statut === 'acceptee').length,
    refusee: propositions.filter(p => p.statut === 'refusee').length,
    annulee: propositions.filter(p => p.statut === 'annulee').length,
  };

  const filters: { id: FilterType; label: string; color: string }[] = [
    { id: 'all', label: 'Toutes', color: 'primary' },
    { id: 'en_attente', label: 'En attente', color: 'warning' },
    { id: 'acceptee', label: 'Acceptées', color: 'success' },
    { id: 'refusee', label: 'Refusées', color: 'error' },
    { id: 'annulee', label: 'Annulées', color: 'gray' },
  ];

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
        icon={<Package className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />}
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
    <div className="space-y-4 md:space-y-6">
      {/* Filtres - Version Mobile avec Select personnalisé */}
      <div className="md:hidden">
        <Select
          leftIcon={<Filter className="w-4 h-4" />}
          options={filters.map(f => ({
            value: f.id,
            label: `${f.label} (${counts[f.id]})`,
          }))}
          value={filter}
          onChange={(value) => setFilter(value as FilterType)}
          placeholder="Filtrer les propositions"
          searchable={false}
          className="border-gray-200"
        />
      </div>

      {/* Filtres - Version Desktop avec Pills */}
      <div className="hidden md:flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              filter === f.id
                ? cn(
                    'text-white shadow-sm',
                    f.color === 'primary' && 'bg-primary',
                    f.color === 'warning' && 'bg-warning',
                    f.color === 'success' && 'bg-success',
                    f.color === 'error' && 'bg-error',
                    f.color === 'gray' && 'bg-gray-500'
                  )
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {f.label} ({counts[f.id]})
          </button>
        ))}
      </div>

      {/* Liste des propositions */}
      {filteredPropositions.length === 0 ? (
        <EmptyState
          title="Aucune proposition dans cette catégorie"
          description="Changez de filtre pour voir d'autres propositions"
          action={{
            label: 'Voir toutes',
            onClick: () => setFilter('all'),
          }}
        />
      ) : (
        <motion.div 
          className="grid gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {filteredPropositions.map((proposition) => (
            <motion.div
              key={proposition.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.2 }}
            >
              <PropositionCard
                proposition={proposition}
                viewMode={viewMode}
                onAccept={onAccept}
                onRefuse={onRefuse}
                onViewDetails={onViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}