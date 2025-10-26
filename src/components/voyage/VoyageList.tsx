'use client';

import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import VoyageCard from './VoyageCard';
import type { Voyage, PaginationMeta } from '@/types';
import { Pagination } from '../common';

interface VoyageListProps {
  voyages: Voyage[];
  pagination?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export default function VoyageList({ 
  voyages, 
  pagination, 
  onPageChange,
  isLoading = false 
}: VoyageListProps) {
  // ==================== LOADING STATE ====================
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card overflow-hidden animate-pulse">
            {/* Skeleton Mobile */}
            <div className="md:hidden">
              <div className="bg-gray-100 px-4 py-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                </div>
              </div>
              <div className="px-4 py-3.5 space-y-2.5">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-5 bg-gray-200 rounded w-16" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-7 h-7 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                </div>
              </div>
            </div>

            {/* Skeleton Desktop */}
            <div className="hidden md:block p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded mt-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==================== EMPTY STATE ====================
  if (voyages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 md:py-16"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Plane className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
          Aucun voyage trouvé
        </h3>
        <p className="text-sm md:text-base text-gray-600">
          Essayez de modifier vos critères de recherche
        </p>
      </motion.div>
    );
  }

  // ==================== LISTE DES VOYAGES ====================
  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 md:gap-6">
        {voyages.map((voyage) => (
          <VoyageCard key={voyage.id} voyage={voyage} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && onPageChange && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            itemLabel="voyage"
          />
        </div>
      )}
    </div>
  );
}