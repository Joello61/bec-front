/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { favorisApi } from '@/lib/api/favoris';
import type { Favori } from '@/types';

interface FavoriState {
  favoris: Favori[];
  favorisVoyages: Favori[];
  favorisDemandes: Favori[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchFavoris: () => Promise<void>;
  fetchFavorisVoyages: () => Promise<void>;
  fetchFavorisDemandes: () => Promise<void>;
  addVoyageToFavoris: (voyageId: number) => Promise<void>;
  addDemandeToFavoris: (demandeId: number) => Promise<void>;
  removeFavori: (id: number, type: 'voyage' | 'demande') => Promise<void>;
  isFavoriVoyage: (voyageId: number) => boolean;
  isFavoriDemande: (demandeId: number) => boolean;
  clearError: () => void;
  reset: () => void;
}

export const useFavoriStore = create<FavoriState>((set, get) => ({
  favoris: [],
  favorisVoyages: [],
  favorisDemandes: [],
  isLoading: false,
  error: null,

  fetchFavoris: async () => {
    set({ isLoading: true, error: null });
    try {
      const favoris = await favorisApi.list();
      set({ favoris, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des favoris', 
        isLoading: false 
      });
    }
  },

  fetchFavorisVoyages: async () => {
    set({ isLoading: true, error: null });
    try {
      const favorisVoyages = await favorisApi.getVoyages();
      set({ favorisVoyages, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des voyages favoris', 
        isLoading: false 
      });
    }
  },

  fetchFavorisDemandes: async () => {
    set({ isLoading: true, error: null });
    try {
      const favorisDemandes = await favorisApi.getDemandes();
      set({ favorisDemandes, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des demandes favorites', 
        isLoading: false 
      });
    }
  },

  // ✅ CORRECTION : Recharger après ajout au lieu de merger
  addVoyageToFavoris: async (voyageId) => {
    set({ isLoading: true, error: null });
    try {
      await favorisApi.addVoyage(voyageId);
      
      // ✅ Recharger la liste complète avec toutes les données
      const favorisVoyages = await favorisApi.getVoyages();
      
      set({
        favorisVoyages,
        isLoading: false
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de l\'ajout aux favoris', 
        isLoading: false 
      });
      throw error;
    }
  },

  // ✅ CORRECTION : Recharger après ajout au lieu de merger
  addDemandeToFavoris: async (demandeId) => {
    set({ isLoading: true, error: null });
    try {
      await favorisApi.addDemande(demandeId);
      
      // ✅ Recharger la liste complète avec toutes les données
      const favorisDemandes = await favorisApi.getDemandes();
      
      set({
        favorisDemandes,
        isLoading: false
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de l\'ajout aux favoris', 
        isLoading: false 
      });
      throw error;
    }
  },

  // ✅ CORRECTION : Recharger après suppression
  removeFavori: async (id, type) => {
    set({ isLoading: true, error: null });
    try {
      await favorisApi.remove(id, type);
      
      // ✅ Recharger les listes pour avoir les données à jour
      if (type === 'voyage') {
        const favorisVoyages = await favorisApi.getVoyages();
        set({ favorisVoyages, isLoading: false });
      } else {
        const favorisDemandes = await favorisApi.getDemandes();
        set({ favorisDemandes, isLoading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la suppression du favori', 
        isLoading: false 
      });
      throw error;
    }
  },

  isFavoriVoyage: (voyageId) => {
    const { favorisVoyages } = get();
    return favorisVoyages.some((f) => f.voyage?.id === voyageId);
  },

  isFavoriDemande: (demandeId) => {
    const { favorisDemandes } = get();
    return favorisDemandes.some((f) => f.demande?.id === demandeId);
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({ 
    favoris: [],
    favorisVoyages: [],
    favorisDemandes: [],
    error: null 
  }),
}));