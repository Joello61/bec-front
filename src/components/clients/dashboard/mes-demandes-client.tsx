'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { DemandeList, DemandeFilters } from '@/components/demande';
import { DemandeForm } from '@/components/forms';
import { useDemandeActions, useAuth, useUserDemandes } from '@/lib/hooks';
import { EmptyState, ErrorState, LoadingSpinner, useToast } from '@/components/common';
import type { DemandeFilters as DemandeFiltersType, Demande } from '@/types';
import { CreateDemandeFormData } from '@/lib/validations';
import ExploreFiltersDrawer from '@/components/explore/ExploreFiltersDrawer';

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
      <ExploreFiltersDrawer
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        activeFiltersCount={activeFiltersCount}
        onReset={() => setFilters({})}
      >
        <DemandeFilters
          onFilterChange={setFilters}
          initialFilters={filters}
          refetchDemandes={refetch}
        />
      </ExploreFiltersDrawer>

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