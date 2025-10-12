'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { DemandeList, DemandeFilters } from '@/components/demande';
import { DemandeForm } from '@/components/forms';
import { useDemandeActions, useAuth, useUserDemandes } from '@/lib/hooks';
import { EmptyState, ErrorState, LoadingSpinner, useToast } from '@/components/common';
import type { DemandeFilters as DemandeFiltersType, Demande } from '@/types';
import { CreateDemandeFormData } from '@/lib/validations';

export default function DemandesPage() {
  const [filters, setFilters] = useState<DemandeFiltersType>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { user } = useAuth();
  const toast = useToast();

  const { createDemande } = useDemandeActions();
  const { demandes, isLoading, error, refetch } = useUserDemandes(user?.id);

  // ==================== FILTRAGE CÔTÉ CLIENT ====================
  const filteredDemandes = useMemo(() => {
    if (!demandes.length) return [];

    return demandes.filter((demande: Demande) => {
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
  }, [demandes, filters]);

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

  if (error && !demandes.length) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Demandes</h1>
          <p className="text-gray-600">
            Gérez vos demandes de transport
            {filteredDemandes.length !== demandes.length && (
              <span className="ml-2 text-primary font-medium">
                ({filteredDemandes.length} sur {demandes.length})
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
        >
          Créer une demande
        </Button>
      </div>

      {/* Filters */}
      <DemandeFilters
        onFilterChange={setFilters}
        initialFilters={filters}
      />

      {/* Content */}
      <div className="mt-8">
        {isLoading && demandes.length === 0 ? (
          <LoadingSpinner text="Chargement des demandes..." />
        ) : demandes.length === 0 ? (
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
        ) : filteredDemandes.length === 0 ? (
          // ==================== CAS SPÉCIAL : Aucun résultat après filtrage ====================
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
      </div>

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