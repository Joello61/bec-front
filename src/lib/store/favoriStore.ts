import { create } from 'zustand';
import { favorisApi } from '@/lib/api/favoris';
import { createAsyncAction } from './createAsyncAction';
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

  fetchFavoris: () =>
    createAsyncAction(set, async () => {
      const favoris = await favorisApi.list();
      set({ favoris, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des favoris' }),

  fetchFavorisVoyages: () =>
    createAsyncAction(set, async () => {
      const favorisVoyages = await favorisApi.getVoyages();
      set({ favorisVoyages, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des voyages favoris' }),

  fetchFavorisDemandes: () =>
    createAsyncAction(set, async () => {
      const favorisDemandes = await favorisApi.getDemandes();
      set({ favorisDemandes, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des demandes favorites' }),

  // Recharge la liste complete apres ajout plutot que de merger localement
  addVoyageToFavoris: (voyageId) =>
    createAsyncAction(set, async () => {
      await favorisApi.addVoyage(voyageId);
      const favorisVoyages = await favorisApi.getVoyages();
      set({ favorisVoyages, isLoading: false });
    }, { fallbackError: "Erreur lors de l'ajout aux favoris", rethrow: true }),

  addDemandeToFavoris: (demandeId) =>
    createAsyncAction(set, async () => {
      await favorisApi.addDemande(demandeId);
      const favorisDemandes = await favorisApi.getDemandes();
      set({ favorisDemandes, isLoading: false });
    }, { fallbackError: "Erreur lors de l'ajout aux favoris", rethrow: true }),

  removeFavori: (id, type) =>
    createAsyncAction(set, async () => {
      await favorisApi.remove(id, type);
      if (type === 'voyage') {
        const favorisVoyages = await favorisApi.getVoyages();
        set({ favorisVoyages, isLoading: false });
      } else {
        const favorisDemandes = await favorisApi.getDemandes();
        set({ favorisDemandes, isLoading: false });
      }
    }, { fallbackError: 'Erreur lors de la suppression du favori', rethrow: true }),

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
