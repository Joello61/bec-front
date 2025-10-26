'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, SlidersHorizontal, X } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { DemandeList, DemandeFilters } from '@/components/demande';
import { DemandeForm } from '@/components/forms';
import { useDemandeActions, useAuth, useUserDemandes } from '@/lib/hooks';
import { EmptyState, ErrorState, LoadingSpinner, useToast } from '@/components/common';
import type { DemandeFilters as DemandeFiltersType, Demande } from '@/types';
import { CreateDemandeFormData } from '@/lib/validations';

export default function DemandesPageClient() {
  const [filters, setFilters] = useState<DemandeFiltersType>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const { user } = useAuth();
  const toast = useToast();

  const { createDemande } = useDemandeActions();
  const { mesDemandes, isLoading, error, refetch } = useUserDemandes(user?.id);

  // ==================== FILTRAGE CÔTÉ CLIENT ====================
  const filteredDemandes = useMemo(() => {
    if (!mesDemandes.length) return [];

    return mesDemandes.filter((demande: Demande) => {
      // Filtre par ville de départ
      if (filters.villeDepart && demande.villeDepart !== filters.villeDepart) {
        return false;
      }

      // Filtre par ville d'arrivée
      if (filters.villeArrivee && demande.villeArrivee !== filters.villeArrivee) {
        return false;
      }

      // Filtre par statut
      if (filters.statut && demande.statut !== filters.statut) {
        return false;
      }

      return true;
    });
  }, [mesDemandes, filters]);

  // Compter les filtres actifs
  const activeFiltersCount = Object.keys(filters).filter(
    key => filters[key as keyof DemandeFiltersType]
  ).length;

  // Vérifier si filtres existent
  const hasFilters = Object.keys(filters).some(key => filters[key as keyof DemandeFiltersType]);

  // Empêcher le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (showFiltersDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showFiltersDrawer]);

  if (!user) {
    return null;
  }

  const handleCreateDemande = async (data: CreateDemandeFormData) => {
    try {
      await createDemande(data);
      setIsCreateModalOpen(false);
      toast.success('Demande créée avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la création de la demande');
      console.error(error);
    }
  };

  if (error && !mesDemandes.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Erreur de chargement"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Mes Demandes
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Gérez vos demandes de transport
                {filteredDemandes.length !== mesDemandes.length && (
                  <span className="ml-2 text-primary font-medium">
                    ({filteredDemandes.length} sur {mesDemandes.length})
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="primary"
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => {
                if (user.isProfileComplete) {
                  setIsCreateModalOpen(true);
                } else {
                  toast.error("Veuillez compléter votre profil avant de créer une demande.");
                }
              }}
              className="w-full md:w-auto"
            >
              Créer une demande
            </Button>
          </div>
        </div>

        {/* Filter Button (Mobile) + Desktop Filters */}
        <div className="mb-6 md:mb-8">
          {/* Mobile: Bouton Filtres Sticky */}
          <div className="md:hidden sticky top-0 z-10 bg-gray-50 pb-4 -mx-4 px-4">
            <button
              onClick={() => setShowFiltersDrawer(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-primary/20 rounded-xl font-medium text-primary hover:bg-primary/5 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="ml-auto px-2.5 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop: Filtres normaux */}
          <div className="hidden md:block">
            <DemandeFilters
              onFilterChange={setFilters}
              initialFilters={filters}
              refetchDemandes={refetch}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key="demande-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading && mesDemandes.length === 0 ? (
              <LoadingSpinner text="Chargement des demandes..." />
            ) : mesDemandes.length === 0 ? (
              <EmptyState
                title="Aucune demande"
                description="Commencez par créer votre première demande de transport"
                action={{
                  label: 'Créer une demande',
                  onClick: () => {
                    if (user.isProfileComplete) {
                      setIsCreateModalOpen(true);
                    } else {
                      toast.error("Veuillez compléter votre profil avant de créer une demande.");
                    }
                  },
                }}
              />
            ) : filteredDemandes.length === 0 && hasFilters ? (
              <EmptyState
                title="Aucune demande ne correspond"
                description="Essayez de modifier vos critères de recherche"
                action={{
                  label: 'Effacer les filtres',
                  onClick: () => setFilters({}),
                }}
              />
            ) : (
              <DemandeList
                demandes={filteredDemandes}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: Filters Drawer (Bottom Sheet) */}
      <AnimatePresence>
        {showFiltersDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersDrawer(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Header du drawer */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Filtres
                  </h2>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowFiltersDrawer(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <DemandeFilters
                  onFilterChange={setFilters}
                  initialFilters={filters}
                  refetchDemandes={refetch}
                />
              </div>

              {/* Footer avec actions */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <button
                    onClick={() => setFilters({})}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setShowFiltersDrawer(false)}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    Voir les résultats
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer une demande"
        size="lg"
      >
        <div className="p-6">
          <DemandeForm
            onSubmit={handleCreateDemande}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}