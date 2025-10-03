'use client';

import { FavoritesList } from '@/components/favori';
import { useFavorisVoyages, useFavorisDemandes, useFavoriActions } from '@/lib/hooks';
import { EmptyState, LoadingSpinner } from '@/components/common';

export default function FavorisPage() {
  const { favorisVoyages, isLoading: isLoadingVoyages } = useFavorisVoyages();
  const { favorisDemandes, isLoading: isLoadingDemandes } = useFavorisDemandes();
  const { removeFavori } = useFavoriActions();

  const isLoading = isLoadingVoyages || isLoadingDemandes;
  const hasNoFavorites = favorisVoyages.length === 0 && favorisDemandes.length === 0;

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner text="Chargement de vos favoris..." />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Favoris</h1>
        <p className="text-gray-600">
          Retrouvez tous les voyages et demandes que vous avez sauvegardés
        </p>
      </div>

      {/* Content */}
      {hasNoFavorites ? (
        <EmptyState
          title="Aucun favori"
          description="Commencez à sauvegarder des voyages et des demandes en cliquant sur le cœur."
        />
      ) : (
        <FavoritesList
          favorisVoyages={favorisVoyages}
          favorisDemandes={favorisDemandes}
          onRemove={removeFavori}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}