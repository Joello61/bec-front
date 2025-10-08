/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useFavoriStore } from '@/lib/store';
import { usePathname } from 'next/navigation';

/**
 * Hook pour gérer tous les favoris
 */
export function useFavoris() {
  const favoris = useFavoriStore((state) => state.favoris);
  const isLoading = useFavoriStore((state) => state.isLoading);
  const error = useFavoriStore((state) => state.error);
  const fetchFavoris = useFavoriStore((state) => state.fetchFavoris);

  useEffect(() => {
    fetchFavoris();
  }, []);

  return {
    favoris,
    isLoading,
    error,
    refetch: fetchFavoris,
  };
}

/**
 * Hook pour gérer les favoris voyages
 */
export function useFavorisVoyages() {
  const pathname = usePathname()
  const favorisVoyages = useFavoriStore((state) => state.favorisVoyages);
  const isLoading = useFavoriStore((state) => state.isLoading);
  const fetchFavorisVoyages = useFavoriStore((state) => state.fetchFavorisVoyages);

  useEffect(() => {
    if (pathname.includes('/dashboard/favoris')) {
      fetchFavorisVoyages();
    }
  }, [pathname, fetchFavorisVoyages]);


  return {
    favorisVoyages,
    isLoading,
    refetch: fetchFavorisVoyages,
  };
}

/**
 * Hook pour gérer les favoris demandes
 */
export function useFavorisDemandes() {
   const pathname = usePathname();
  const favorisDemandes = useFavoriStore((state) => state.favorisDemandes);
  const isLoading = useFavoriStore((state) => state.isLoading);
  const fetchFavorisDemandes = useFavoriStore((state) => state.fetchFavorisDemandes);

    useEffect(() => {
    if (pathname.includes('/dashboard/favoris') ) {
      fetchFavorisDemandes();
    }
  }, [pathname, fetchFavorisDemandes]);

  return {
    favorisDemandes,
    isLoading,
    refetch: fetchFavorisDemandes,
  };
}

/**
 * Hook pour les actions sur les favoris
 */
export function useFavoriActions() {
  const addVoyageToFavoris = useFavoriStore((state) => state.addVoyageToFavoris);
  const addDemandeToFavoris = useFavoriStore((state) => state.addDemandeToFavoris);
  const removeFavori = useFavoriStore((state) => state.removeFavori);
  const isFavoriVoyage = useFavoriStore((state) => state.isFavoriVoyage);
  const isFavoriDemande = useFavoriStore((state) => state.isFavoriDemande);
  const isLoading = useFavoriStore((state) => state.isLoading);
  const error = useFavoriStore((state) => state.error);

  return {
    addVoyageToFavoris,
    addDemandeToFavoris,
    removeFavori,
    isFavoriVoyage,
    isFavoriDemande,
    isLoading,
    error,
  };
}