import { create } from 'zustand';

import { propositionsApi } from '@/lib/api/propositions';
import { logger } from '@/lib/utils/logger';
import type {
  CreatePropositionInput,
  Proposition,
  RespondPropositionInput
} from '@/types';

import { createAsyncAction } from './createAsyncAction';

interface PropositionState {
  currentProposition: Proposition | null;
  propositions: Proposition[];
  myPropositionsSent: Proposition[];
  myPropositionsReceived: Proposition[];
  pendingCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  getById: (propositionId: number) => Promise<Proposition>;
  createProposition: (voyageId: number, data: CreatePropositionInput) => Promise<Proposition>;
  deleteProposition: (propositionId: number) => Promise<void>;
  respondToProposition: (propositionId: number, data: RespondPropositionInput) => Promise<void>;
  fetchPropositionsByVoyage: (voyageId: number) => Promise<void>;
  fetchAcceptedByVoyage: (voyageId: number) => Promise<void>;
  fetchMyPropositionsSent: () => Promise<void>;
  fetchMyPropositionsReceived: () => Promise<void>;
  fetchPendingCount: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const usePropositionStore = create<PropositionState>((set) => ({
  currentProposition: null,
  propositions: [],
  myPropositionsSent: [],
  myPropositionsReceived: [],
  pendingCount: 0,
  isLoading: false,
  error: null,

  getById: (propositionId) =>
    createAsyncAction(set, async () => {
      const proposition = await propositionsApi.getById(propositionId);
      set({ currentProposition: proposition, isLoading: false });
      return proposition;
    }, { fallbackError: 'Erreur lors du chargement de la proposition', rethrow: true }),

  createProposition: (voyageId, data) =>
    createAsyncAction(set, async () => {
      const proposition = await propositionsApi.create(voyageId, data);
      set((state) => ({ myPropositionsSent: [proposition, ...state.myPropositionsSent], isLoading: false }));
      return proposition;
    }, { fallbackError: 'Erreur lors de la création de la proposition', rethrow: true }),

  respondToProposition: (propositionId, data) =>
    createAsyncAction(set, async () => {
      const updatedProposition = await propositionsApi.respond(propositionId, data);
      set((state) => ({
        myPropositionsReceived: state.myPropositionsReceived.map((p) =>
          p.id === propositionId ? updatedProposition : p
        ),
        propositions: state.propositions.map((p) =>
          p.id === propositionId ? updatedProposition : p
        ),
        isLoading: false
      }));
    }, { fallbackError: 'Erreur lors de la réponse à la proposition', rethrow: true }),

  deleteProposition: (propositionId) =>
    createAsyncAction(set, async () => {
      await propositionsApi.delete(propositionId);
      set((state) => ({
        myPropositionsSent: state.myPropositionsSent.map((p) =>
          p.id === propositionId ? { ...p, status: 'annulee' } : p
        ),
        propositions: state.propositions.map((p) =>
          p.id === propositionId ? { ...p, status: 'annulee' } : p
        ),
        isLoading: false
      }));
    }, { fallbackError: "Erreur lors de l'annulation de la proposition", rethrow: true }),

  fetchPropositionsByVoyage: (voyageId) =>
    createAsyncAction(set, async () => {
      const propositions = await propositionsApi.getByVoyage(voyageId);
      set({ propositions, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des propositions' }),

  fetchAcceptedByVoyage: (voyageId) =>
    createAsyncAction(set, async () => {
      const propositions = await propositionsApi.getAcceptedByVoyage(voyageId);
      set({ propositions, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des propositions acceptées' }),

  fetchMyPropositionsSent: () =>
    createAsyncAction(set, async () => {
      const propositions = await propositionsApi.getMySent();
      set({ myPropositionsSent: propositions, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement de vos propositions' }),

  fetchMyPropositionsReceived: () =>
    createAsyncAction(set, async () => {
      const propositions = await propositionsApi.getMyReceived();
      set({ myPropositionsReceived: propositions, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des propositions reçues' }),

  // Compteur silencieux (badge) : ne pilote pas isLoading/error, comme
  // authStore.checkProfileStatus - hors du helper.
  fetchPendingCount: async () => {
    try {
      const count = await propositionsApi.getMyPendingCount();
      set({ pendingCount: count });
    } catch (error) {
      logger.error('Erreur lors du comptage des propositions:', error);
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set({
    propositions: [],
    myPropositionsSent: [],
    myPropositionsReceived: [],
    pendingCount: 0,
    error: null
  }),
}));
