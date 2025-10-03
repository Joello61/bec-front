/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { voyagesApi } from '@/lib/api/voyages';
import type { 
  Voyage, 
  CreateVoyageInput, 
  UpdateVoyageInput, 
  VoyageFilters, 
  VoyageStatut,
  PaginationMeta 
} from '@/types';

interface VoyageState {
  voyages: Voyage[];
  currentVoyage: Voyage | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchVoyages: (page?: number, limit?: number, filters?: VoyageFilters) => Promise<void>;
  fetchVoyage: (id: number) => Promise<void>;
  createVoyage: (data: CreateVoyageInput) => Promise<Voyage>;
  updateVoyage: (id: number, data: UpdateVoyageInput) => Promise<void>;
  updateStatus: (id: number, statut: VoyageStatut) => Promise<void>;
  deleteVoyage: (id: number) => Promise<void>;
  fetchUserVoyages: (userId: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useVoyageStore = create<VoyageState>((set, get) => ({
  voyages: [],
  currentVoyage: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchVoyages: async (page = 1, limit = 10, filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await voyagesApi.list(page, limit, filters);
      set({ 
        voyages: response.data, 
        pagination: response.pagination,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des voyages', 
        isLoading: false 
      });
    }
  },

  fetchVoyage: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const voyage = await voyagesApi.show(id);
      set({ currentVoyage: voyage, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement du voyage', 
        isLoading: false 
      });
    }
  },

  createVoyage: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const voyage = await voyagesApi.create(data);
      set((state) => ({ 
        voyages: [voyage, ...state.voyages],
        isLoading: false 
      }));
      return voyage;
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la création du voyage', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateVoyage: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedVoyage = await voyagesApi.update(id, data);
      set((state) => ({
        voyages: state.voyages.map((v) => v.id === id ? updatedVoyage : v),
        currentVoyage: state.currentVoyage?.id === id ? updatedVoyage : state.currentVoyage,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la mise à jour du voyage', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateStatus: async (id, statut) => {
    set({ isLoading: true, error: null });
    try {
      const updatedVoyage = await voyagesApi.updateStatus(id, statut);
      set((state) => ({
        voyages: state.voyages.map((v) => v.id === id ? updatedVoyage : v),
        currentVoyage: state.currentVoyage?.id === id ? updatedVoyage : state.currentVoyage,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la mise à jour du statut', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteVoyage: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await voyagesApi.delete(id);
      set((state) => ({
        voyages: state.voyages.filter((v) => v.id !== id),
        currentVoyage: state.currentVoyage?.id === id ? null : state.currentVoyage,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la suppression du voyage', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchUserVoyages: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const voyages = await voyagesApi.byUser(userId);
      set({ voyages, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des voyages', 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({ 
    voyages: [], 
    currentVoyage: null, 
    pagination: null, 
    error: null 
  }),
}));