'use client';

import { motion } from 'framer-motion';
import DemandeCard from './DemandeCard';
import type { Demande, PaginationMeta } from '@/types';

interface DemandeListProps {
  demandes: Demande[];
  pagination?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export default function DemandeList({ 
  demandes, 
  pagination, 
  onPageChange,
  isLoading = false 
}: DemandeListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
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
        ))}
      </div>
    );
  }

  if (demandes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucune demande trouvée
        </h3>
        <p className="text-gray-600">
          Essayez de modifier vos critères de recherche
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {demandes.map((demande) => (
          <DemandeCard key={demande.id} demande={demande} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Précédent
          </button>

          <div className="flex items-center gap-1">
            {[...Array(pagination.pages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === pagination.page;
              const isNearCurrent = Math.abs(page - pagination.page) <= 1;
              const isFirstOrLast = page === 1 || page === pagination.pages;

              if (!isNearCurrent && !isFirstOrLast) {
                if (page === 2 || page === pagination.pages - 1) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    isCurrentPage
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}