'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { VoyageList, VoyageFilters } from '@/components/voyage';
import { VoyageForm } from '@/components/forms';
import { useVoyageActions, useAuth, useUserVoyages } from '@/lib/hooks';
import { EmptyState, ErrorState, LoadingSpinner, useToast } from '@/components/common';
import type { VoyageFilters as VoyageFiltersType, Voyage } from '@/types';
import { CreateVoyageFormData } from '@/lib/validations/voyage.schema';
import ExploreFiltersDrawer from '@/components/explore/ExploreFiltersDrawer';

export default function VoyagesPageClient() {
  const [filters, setFilters] = useState<VoyageFiltersType>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const { user } = useAuth();
  const toast = useToast();

  const { mesVoyages, isLoading, error, refetch } = useUserVoyages(user?.id);
  const { createVoyage } = useVoyageActions();

  // ==================== FILTRAGE CÔTÉ CLIENT ====================
  const filteredVoyages = useMemo(() => {
    if (!mesVoyages.length) return [];

    return mesVoyages.filter((voyage: Voyage) => {
      // Filtre par ville de départ
      if (filters.villeDepart && voyage.villeDepart !== filters.villeDepart) {
        return false;
      }

      // Filtre par ville d'arrivée
      if (filters.villeArrivee && voyage.villeArrivee !== filters.villeArrivee) {
        return false;
      }

      // Filtre par date de départ
      if (filters.dateDepart) {
        const voyageDate = new Date(voyage.dateDepart);
        const filterDate = new Date(filters.dateDepart);
        if (voyageDate < filterDate) {
          return false;
        }
      }

      // Filtre par statut
      if (filters.statut && voyage.statut !== filters.statut) {
        return false;
      }

      return true;
    });
  }, [mesVoyages, filters]);

  // Compter les filtres actifs
  const activeFiltersCount = Object.keys(filters).filter(
    key => filters[key as keyof VoyageFiltersType]
  ).length;

  // Vérifier si filtres existent
  const hasFilters = Object.keys(filters).some(key => filters[key as keyof VoyageFiltersType]);

  if (!user) {
    return null;
  }

  const handleCreateVoyage = async (data: CreateVoyageFormData) => {
    try {
      await createVoyage(data);
      setIsCreateModalOpen(false);
      toast.success("Voyage créé avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la création du voyage");
      console.error(error);
    }
  };

  if (error && !mesVoyages.length) {
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
                Mes Voyages
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Gérez vos annonces de voyage
                {filteredVoyages.length !== mesVoyages.length && (
                  <span className="ml-2 text-primary font-medium">
                    ({filteredVoyages.length} sur {mesVoyages.length})
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
                  toast.error("Veuillez compléter votre profil avant de créer un voyage.");
                }
              }}
              className="w-full md:w-auto"
            >
              Créer un voyage
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
            <VoyageFilters
              onFilterChange={setFilters}
              initialFilters={filters}
              refetchVoyages={refetch}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key="voyage-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading && mesVoyages.length === 0 ? (
              <LoadingSpinner text="Chargement des voyages..." />
            ) : mesVoyages.length === 0 ? (
              <EmptyState
                title="Aucun voyage"
                description="Commencez par créer votre premier voyage"
                action={{
                  label: 'Créer un voyage',
                  onClick: () => {
                    if (user.isProfileComplete) {
                      setIsCreateModalOpen(true);
                    } else {
                      toast.error("Veuillez compléter votre profil avant de créer un voyage.");
                    }
                  },
                }}
              />
            ) : filteredVoyages.length === 0 && hasFilters ? (
              <EmptyState
                title="Aucun voyage ne correspond"
                description="Essayez de modifier vos critères de recherche"
                action={{
                  label: 'Effacer les filtres',
                  onClick: () => setFilters({}),
                }}
              />
            ) : (
              <VoyageList
                voyages={filteredVoyages}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: Filters Drawer (Bottom Sheet) */}
      <ExploreFiltersDrawer
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        activeFiltersCount={activeFiltersCount}
        onReset={() => setFilters({})}
      >
        <VoyageFilters
          onFilterChange={setFilters}
          initialFilters={filters}
          refetchVoyages={refetch}
        />
      </ExploreFiltersDrawer>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un voyage"
        size="lg"
      >
        <div className="p-6">
          <VoyageForm
            onSubmit={handleCreateVoyage}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}