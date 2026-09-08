import { create } from 'zustand';
import { signalementsApi } from '@/lib/api/signalement';
import { createAsyncAction } from './createAsyncAction';
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

  fetchSignalements: (page = 1, limit = 10, statut) =>
    createAsyncAction(set, async () => {
      const response = await signalementsApi.list(page, limit, statut);
      set({ signalements: response.data, pagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des signalements' }),

  fetchMesSignalements: (page = 1, limit = 10, statut) =>
    createAsyncAction(set, async () => {
      const response = await signalementsApi.me(page, limit, statut);
      set({ mesSignalements: response.data, pagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des signalements' }),

  createSignalement: (data) =>
    createAsyncAction(set, async () => {
      const signalement = await signalementsApi.create(data);
      set((state) => ({
        signalements: [signalement, ...state.signalements],
        pendingCount: state.pendingCount + 1,
        isLoading: false
      }));
      return signalement;
    }, { fallbackError: 'Erreur lors de la création du signalement', rethrow: true }),

  processSignalement: (id, data) =>
    createAsyncAction(set, async () => {
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
    }, { fallbackError: 'Erreur lors du traitement du signalement', rethrow: true }),

  // Compteur silencieux : ne pilote pas isLoading/error, comme authStore.checkProfileStatus.
  fetchPendingCount: async () => {
    try {
      const pendingCount = await signalementsApi.getPendingCount();
      set({ pendingCount });
    } catch (error) {
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
