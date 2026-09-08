import { create } from 'zustand';

import { voyagesApi } from '@/lib/api/voyages';
import type {
  CreateVoyageInput,
  PaginationMeta,
  PublicVoyage,
  UpdateVoyageInput,
  Voyage,
  VoyageFilters,
  VoyageStatut} from '@/types';

import { VOYAGE_STATUTS } from '../utils/constants';
import { createAsyncAction } from './createAsyncAction';

interface VoyageState {
  voyages: Voyage[];
  publicVoyages: PublicVoyage[];
  mesVoyages: Voyage[];
  currentVoyage: Voyage | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchVoyages: (page?: number, limit?: number, filters?: VoyageFilters) => Promise<void>;
  fetchPublicVoyages: (page?: number, limit?: number, filters?: VoyageFilters) => Promise<void>;
  fetchVoyage: (id: number) => Promise<void>;
  createVoyage: (data: CreateVoyageInput) => Promise<Voyage>;
  updateVoyage: (id: number, data: UpdateVoyageInput) => Promise<void>;
  updateStatus: (id: number, statut: VoyageStatut) => Promise<void>;
  deleteVoyage: (id: number) => Promise<void>;
  fetchUserVoyages: (userId: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useVoyageStore = create<VoyageState>((set) => ({
  voyages: [],
  publicVoyages: [],
  mesVoyages: [],
  currentVoyage: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchVoyages: (page = 1, limit = 10, filters) =>
    createAsyncAction(set, async () => {
      const response = await voyagesApi.list(page, limit, filters);
      set({ voyages: response.data, pagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des voyages' }),

  fetchPublicVoyages: (page = 1, limit = 10, filters) =>
    createAsyncAction(set, async () => {
      const response = await voyagesApi.publicList(page, limit, filters);
      set({ publicVoyages: response.data, pagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des voyages publics' }),

  fetchVoyage: (id) =>
    createAsyncAction(set, async () => {
      const voyage = await voyagesApi.show(id);
      set({ currentVoyage: voyage, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement du voyage' }),

  createVoyage: (data) =>
    createAsyncAction(set, async () => {
      const voyage = await voyagesApi.create(data);
      set((state) => ({ mesVoyages: [voyage, ...state.mesVoyages], isLoading: false }));
      return voyage;
    }, { fallbackError: 'Erreur lors de la création du voyage', rethrow: true }),

  updateVoyage: (id, data) =>
    createAsyncAction(set, async () => {
      const updatedVoyage = await voyagesApi.update(id, data);
      set((state) => ({
        mesVoyages: state.mesVoyages.map((v) => v.id === id ? updatedVoyage : v),
        currentVoyage: state.currentVoyage?.id === id ? updatedVoyage : state.currentVoyage,
        isLoading: false
      }));
    }, { fallbackError: 'Erreur lors de la mise à jour du voyage', rethrow: true }),

  updateStatus: (id, statut) =>
    createAsyncAction(set, async () => {
      const updatedVoyage = await voyagesApi.updateStatus(id, statut);
      set((state) => ({
        mesVoyages: state.mesVoyages.map((v) => v.id === id ? updatedVoyage : v),
        currentVoyage: state.currentVoyage?.id === id ? updatedVoyage : state.currentVoyage,
        isLoading: false
      }));
    }, { fallbackError: 'Erreur lors de la mise à jour du statut', rethrow: true }),

  deleteVoyage: (id) =>
    createAsyncAction(set, async () => {
      await voyagesApi.delete(id);
      set((state) => ({
        mesVoyages: state.mesVoyages.map((v) =>
          v.id === id ? { ...v, status: VOYAGE_STATUTS[3] } : v
        ),
        currentVoyage:
          state.currentVoyage?.id === id
            ? { ...state.currentVoyage, status: VOYAGE_STATUTS[3] }
            : state.currentVoyage,
        isLoading: false
      }));
    }, { fallbackError: 'Erreur lors de la suppression du voyage', rethrow: true }),

  fetchUserVoyages: (userId) =>
    createAsyncAction(set, async () => {
      const voyages = await voyagesApi.byUser(userId);
      set({ mesVoyages: voyages, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des voyages' }),

  clearError: () => set({ error: null }),

  reset: () => set({
    voyages: [],
    publicVoyages: [],
    mesVoyages: [],
    currentVoyage: null,
    pagination: null,
    error: null
  }),
}));
