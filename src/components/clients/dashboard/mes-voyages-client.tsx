'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { VoyageList, VoyageFilters } from '@/components/voyage';
import { VoyageForm } from '@/components/forms';
import { useVoyageActions, useAuth, useUserVoyages } from '@/lib/hooks';
import { EmptyState, ErrorState, LoadingSpinner, useToast } from '@/components/common';
import type { VoyageFilters as VoyageFiltersType, Voyage } from '@/types';
import { CreateVoyageFormData } from '@/lib/validations/voyage.schema';

export default function VoyagesPageClient() {
  const [filters, setFilters] = useState<VoyageFiltersType>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const { voyages, isLoading, error, refetch } = useUserVoyages(user?.id);
  const { createVoyage } = useVoyageActions();

  // ==================== FILTRAGE CÔTÉ CLIENT ====================
  // Filtrer les voyages selon les critères sélectionnés
  const filteredVoyages = useMemo(() => {
    if (!voyages.length) return [];

    return voyages.filter((voyage: Voyage) => {
      // Filtre par ville de départ
      if (filters.villeDepart && voyage.villeDepart !== filters.villeDepart) {
        return false;
      }

      // Filtre par ville d'arrivée
      if (filters.villeArrivee && voyage.villeArrivee !== filters.villeArrivee) {
        return false;
      }

      // Filtre par date de départ (vérifie si la date du voyage est >= à la date filtrée)
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
  }, [voyages, filters]);

  if (!user) {
    return <p>Veuillez vous connecter</p>;
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

  if (error && !voyages.length) {
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
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Voyages</h1>
          <p className="text-gray-600">
            Gérez vos annonces de voyage
            {filteredVoyages.length !== voyages.length && (
              <span className="ml-2 text-primary font-medium">
                ({filteredVoyages.length} sur {voyages.length})
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
        >
          Créer un voyage
        </Button>
      </div>

      {/* Filters */}
      <VoyageFilters
        onFilterChange={setFilters}
        initialFilters={filters}
      />

      {/* Content */}
      <div className="mt-8">
        {isLoading && voyages.length === 0 ? (
          <LoadingSpinner text="Chargement des voyages..." />
        ) : voyages.length === 0 ? (
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
        ) : filteredVoyages.length === 0 ? (
          // ==================== CAS SPÉCIAL : Aucun résultat après filtrage ====================
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
      </div>

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