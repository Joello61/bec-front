/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { signalementsApi } from '@/lib/api/signalement';
import type { 
  Signalement, 
  CreateSignalementInput, 
  TraiterSignalementInput,
  PaginationMeta, 
} from '@/types';

interface SignalementState {
  signalements: Signalement[];
  mesSignalements: Signalement[];
  currentSignalement: Signalement | null;
  pagination: PaginationMeta | null;
  pendingCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSignalements: (page?: number, limit?: number, statut?: string) => Promise<void>;
  fetchMesSignalements: (page?: number, limit?: number, statut?: string) => Promise<void>;
  createSignalement: (data: CreateSignalementInput) => Promise<Signalement>;
  processSignalement: (id: number, data: TraiterSignalementInput) => Promise<void>;
  fetchPendingCount: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useSignalementStore = create<SignalementState>((set) => ({
  signalements: [],
  mesSignalements: [],
  currentSignalement: null,
  pagination: null,
  pendingCount: 0,
  isLoading: false,
  error: null,

  fetchSignalements: async (page = 1, limit = 10, statut) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signalementsApi.list(page, limit, statut);
      set({ 
        signalements: response.data, 
        pagination: response.pagination,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des signalements', 
        isLoading: false 
      });
    }
  },

  fetchMesSignalements: async (page = 1, limit = 10, statut) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signalementsApi.me(page, limit, statut);
      set({ 
        mesSignalements: response.data, 
        pagination: response.pagination,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des signalements', 
        isLoading: false 
      });
    }
  },

  createSignalement: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const signalement = await signalementsApi.create(data);
      set((state) => ({
        signalements: [signalement, ...state.signalements],
        pendingCount: state.pendingCount + 1,
        isLoading: false
      }));
      return signalement;
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la création du signalement', 
        isLoading: false 
      });
      throw error;
    }
  },

  processSignalement: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSignalement = await signalementsApi.process(id, data);
      set((state) => ({
        signalements: state.signalements.map((s) => 
          s.id === id ? updatedSignalement : s
        ),
        currentSignalement: state.currentSignalement?.id === id 
          ? updatedSignalement 
          : state.currentSignalement,
        pendingCount: Math.max(0, state.pendingCount - 1),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du traitement du signalement', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchPendingCount: async () => {
    try {
      const pendingCount = await signalementsApi.getPendingCount();
      set({ pendingCount });
    } catch (error: any) {
      console.error('Erreur compteur signalements:', error);
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({ 
    signalements: [],
    currentSignalement: null,
    pagination: null,
    pendingCount: 0,
    error: null 
  }),
}));