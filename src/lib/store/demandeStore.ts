/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { demandesApi } from '@/lib/api/demandes';
import type { 
  Demande, 
  CreateDemandeInput, 
  UpdateDemandeInput, 
  DemandeFilters,
  DemandeStatut,
  PaginationMeta, 
  PublicDemande
} from '@/types';
import { DEMANDE_STATUTS } from '../utils/constants';

interface DemandeState {
  demandes: Demande[];
  publicDemandes: PublicDemande[];
  mesDemandes: Demande[];
  currentDemande: Demande | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDemandes: (page?: number, limit?: number, filters?: DemandeFilters) => Promise<void>;
  fetchPublicDemandes: (page?: number, limit?: number, filters?: DemandeFilters) => Promise<void>;
  fetchDemande: (id: number) => Promise<void>;
  createDemande: (data: CreateDemandeInput) => Promise<Demande>;
  updateDemande: (id: number, data: UpdateDemandeInput) => Promise<void>;
  updateStatus: (id: number, statut: DemandeStatut) => Promise<void>;
  deleteDemande: (id: number) => Promise<void>;
  fetchUserDemandes: (userId: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useDemandeStore = create<DemandeState>((set) => ({
  demandes: [],
  publicDemandes: [],
  mesDemandes: [],
  currentDemande: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchDemandes: async (page = 1, limit = 10, filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await demandesApi.list(page, limit, filters);
      set({ 
        demandes: response.data, 
        pagination: response.pagination,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des demandes', 
        isLoading: false 
      });
    }
  },

  fetchPublicDemandes: async (page = 1, limit = 10, filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await demandesApi.publicList(page, limit, filters);
      set({ 
        publicDemandes: response.data, 
        pagination: response.pagination,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des demandes publiques', 
        isLoading: false 
      });
    }
  },

  fetchDemande: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const demande = await demandesApi.show(id);
      set({ currentDemande: demande, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement de la demande', 
        isLoading: false 
      });
    }
  },

  createDemande: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const demande = await demandesApi.create(data);
      set((state) => ({ 
        mesDemandes: [demande, ...state.mesDemandes],
        isLoading: false 
      }));
      return demande;
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la création de la demande', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateDemande: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDemande = await demandesApi.update(id, data);
      set((state) => ({
        mesDemandes: state.mesDemandes.map((d) => d.id === id ? updatedDemande : d),
        currentDemande: state.currentDemande?.id === id ? updatedDemande : state.currentDemande,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la mise à jour de la demande', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateStatus: async (id, statut) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDemande = await demandesApi.updateStatus(id, statut);
      set((state) => ({
        mesDemandes: state.mesDemandes.map((d) => d.id === id ? updatedDemande : d),
        currentDemande: state.currentDemande?.id === id ? updatedDemande : state.currentDemande,
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

  deleteDemande: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await demandesApi.delete(id);
      set((state) => ({
               mesDemandes: state.mesDemandes.map((d) =>
              d.id === id ? { ...d, status: DEMANDE_STATUTS[2]} : d
            ),
            currentDemande:
              state.currentDemande?.id === id
                ? { ...state.currentDemande, status: DEMANDE_STATUTS[2] }
                : state.currentDemande,
              isLoading: false
            }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la suppression de la demande', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchUserDemandes: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const demandes = await demandesApi.byUser(userId);
      set({ mesDemandes: demandes, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des demandes', 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({ 
    demandes: [], 
    publicDemandes: [],
    mesDemandes: [],
    currentDemande: null, 
    pagination: null, 
    error: null 
  }),
}));