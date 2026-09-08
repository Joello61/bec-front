import { create } from 'zustand';
import { avisApi } from '@/lib/api/avis';
import { createAsyncAction } from './createAsyncAction';
import type { Avis, CreateAvisInput, AvisWithStats } from '@/types';

interface AvisState {
  avisWithStats: AvisWithStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserAvis: (userId: number) => Promise<void>;
  createAvis: (data: CreateAvisInput) => Promise<Avis>;
  updateAvis: (id: number, data: CreateAvisInput) => Promise<void>;
  deleteAvis: (id: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useAvisStore = create<AvisState>((set) => ({
  avisWithStats: null,
  isLoading: false,
  error: null,

  fetchUserAvis: (userId) =>
    createAsyncAction(set, async () => {
      const avisWithStats = await avisApi.byUser(userId);
      set({ avisWithStats, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des avis' }),

  createAvis: (data) =>
    createAsyncAction(set, async () => {
      const avis = await avisApi.create(data);
      set((state) => {
        if (!state.avisWithStats) return { isLoading: false };
        return {
          avisWithStats: {
            ...state.avisWithStats,
            avis: [avis, ...state.avisWithStats.avis],
            stats: {
              ...state.avisWithStats.stats,
              total: state.avisWithStats.stats.total + 1
            }
          },
          isLoading: false
        };
      });
      return avis;
    }, { fallbackError: "Erreur lors de la création de l'avis", rethrow: true }),

  updateAvis: (id, data) =>
    createAsyncAction(set, async () => {
      const updatedAvis = await avisApi.update(id, data);
      set((state) => {
        if (!state.avisWithStats) return { isLoading: false };
        return {
          avisWithStats: {
            ...state.avisWithStats,
            avis: state.avisWithStats.avis.map((a) =>
              a.id === id ? updatedAvis : a
            )
          },
          isLoading: false
        };
      });
    }, { fallbackError: "Erreur lors de la mise à jour de l'avis", rethrow: true }),

  deleteAvis: (id) =>
    createAsyncAction(set, async () => {
      await avisApi.delete(id);
      set((state) => {
        if (!state.avisWithStats) return { isLoading: false };
        return {
          avisWithStats: {
            ...state.avisWithStats,
            avis: state.avisWithStats.avis.filter((a) => a.id !== id),
            stats: {
              ...state.avisWithStats.stats,
              total: Math.max(0, state.avisWithStats.stats.total - 1)
            }
          },
          isLoading: false
        };
      });
    }, { fallbackError: "Erreur lors de la suppression de l'avis", rethrow: true }),

  clearError: () => set({ error: null }),

  reset: () => set({
    avisWithStats: null,
    error: null
  }),
}));
