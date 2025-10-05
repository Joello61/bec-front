/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { propositionsApi } from '@/lib/api/propositions';
import type { 
  Proposition, 
  CreatePropositionInput, 
  RespondPropositionInput 
} from '@/types';

interface PropositionState {
  propositions: Proposition[];
  myPropositionsSent: Proposition[];
  myPropositionsReceived: Proposition[];
  pendingCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createProposition: (voyageId: number, data: CreatePropositionInput) => Promise<Proposition>;
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
  propositions: [],
  myPropositionsSent: [],
  myPropositionsReceived: [],
  pendingCount: 0,
  isLoading: false,
  error: null,

  createProposition: async (voyageId, data) => {
    set({ isLoading: true, error: null });
    try {
      const proposition = await propositionsApi.create(voyageId, data);
      set((state) => ({ 
        myPropositionsSent: [proposition, ...state.myPropositionsSent],
        isLoading: false 
      }));
      return proposition;
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la création de la proposition', 
        isLoading: false 
      });
      throw error;
    }
  },

  respondToProposition: async (propositionId, data) => {
    set({ isLoading: true, error: null });
    try {
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
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la réponse à la proposition', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchPropositionsByVoyage: async (voyageId) => {
    set({ isLoading: true, error: null });
    try {
      const propositions = await propositionsApi.getByVoyage(voyageId);
      set({ propositions, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des propositions', 
        isLoading: false 
      });
    }
  },

  fetchAcceptedByVoyage: async (voyageId) => {
    set({ isLoading: true, error: null });
    try {
      const propositions = await propositionsApi.getAcceptedByVoyage(voyageId);
      set({ propositions, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des propositions acceptées', 
        isLoading: false 
      });
    }
  },

  fetchMyPropositionsSent: async () => {
    set({ isLoading: true, error: null });
    try {
      const propositions = await propositionsApi.getMySent();
      set({ myPropositionsSent: propositions, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement de vos propositions', 
        isLoading: false 
      });
    }
  },

  fetchMyPropositionsReceived: async () => {
    set({ isLoading: true, error: null });
    try {
      const propositions = await propositionsApi.getMyReceived();
      set({ myPropositionsReceived: propositions, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des propositions reçues', 
        isLoading: false 
      });
    }
  },

  fetchPendingCount: async () => {
    try {
      const count = await propositionsApi.getMyPendingCount();
      set({ pendingCount: count });
    } catch (error: any) {
      // Silent fail pour le compteur
      console.error('Erreur lors du comptage des propositions:', error);
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