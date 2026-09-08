import { create } from 'zustand';

import { demandesApi } from '@/lib/api/demandes';
import type {
  CreateDemandeInput,
  Demande,
  DemandeFilters,
  DemandeStatut,
  PaginationMeta,
  PublicDemande,
  UpdateDemandeInput} from '@/types';

import { DEMANDE_STATUTS } from '../utils/constants';
import { createAsyncAction } from './createAsyncAction';

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

  fetchDemandes: (page = 1, limit = 10, filters) =>
    createAsyncAction(set, async () => {
      const response = await demandesApi.list(page, limit, filters);
      set({ demandes: response.data, pagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des demandes' }),

  fetchPublicDemandes: (page = 1, limit = 10, filters) =>
    createAsyncAction(set, async () => {
      const response = await demandesApi.publicList(page, limit, filters);
      set({ publicDemandes: response.data, pagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des demandes publiques' }),

  fetchDemande: (id) =>
    createAsyncAction(set, async () => {
      const demande = await demandesApi.show(id);
      set({ currentDemande: demande, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement de la demande' }),

  createDemande: (data) =>
    createAsyncAction(set, async () => {
      const demande = await demandesApi.create(data);
      set((state) => ({ mesDemandes: [demande, ...state.mesDemandes], isLoading: false }));
      return demande;
    }, { fallbackError: 'Erreur lors de la création de la demande', rethrow: true }),

  updateDemande: (id, data) =>
    createAsyncAction(set, async () => {
      const updatedDemande = await demandesApi.update(id, data);
      set((state) => ({
        mesDemandes: state.mesDemandes.map((d) => d.id === id ? updatedDemande : d),
        currentDemande: state.currentDemande?.id === id ? updatedDemande : state.currentDemande,
        isLoading: false
      }));
    }, { fallbackError: 'Erreur lors de la mise à jour de la demande', rethrow: true }),

  updateStatus: (id, statut) =>
    createAsyncAction(set, async () => {
      const updatedDemande = await demandesApi.updateStatus(id, statut);
      set((state) => ({
        mesDemandes: state.mesDemandes.map((d) => d.id === id ? updatedDemande : d),
        currentDemande: state.currentDemande?.id === id ? updatedDemande : state.currentDemande,
        isLoading: false
      }));
    }, { fallbackError: 'Erreur lors de la mise à jour du statut', rethrow: true }),

  deleteDemande: (id) =>
    createAsyncAction(set, async () => {
      await demandesApi.delete(id);
      set((state) => ({
        mesDemandes: state.mesDemandes.map((d) =>
          d.id === id ? { ...d, status: DEMANDE_STATUTS[2] } : d
        ),
        currentDemande:
          state.currentDemande?.id === id
            ? { ...state.currentDemande, status: DEMANDE_STATUTS[2] }
            : state.currentDemande,
        isLoading: false
      }));
    }, { fallbackError: 'Erreur lors de la suppression de la demande', rethrow: true }),

  fetchUserDemandes: (userId) =>
    createAsyncAction(set, async () => {
      const demandes = await demandesApi.byUser(userId);
      set({ mesDemandes: demandes, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des demandes' }),

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
