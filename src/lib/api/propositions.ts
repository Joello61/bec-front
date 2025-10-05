import apiClient from './client';
import { endpoints } from './endpoints';
import type { 
  Proposition, 
  CreatePropositionInput, 
  RespondPropositionInput 
} from '@/types';

export const propositionsApi = {
  /**
   * Créer une proposition sur un voyage
   */
  async create(voyageId: number, data: CreatePropositionInput): Promise<Proposition> {
    const response = await apiClient.post<Proposition>(
      endpoints.propositions.create(voyageId),
      data
    );
    return response.data;
  },

  /**
   * Répondre à une proposition (accepter/refuser)
   */
  async respond(propositionId: number, data: RespondPropositionInput): Promise<Proposition> {
    const response = await apiClient.patch<Proposition>(
      endpoints.propositions.respond(propositionId),
      data
    );
    return response.data;
  },

  /**
   * Récupérer toutes les propositions pour un voyage
   */
  async getByVoyage(voyageId: number): Promise<Proposition[]> {
    const response = await apiClient.get<Proposition[]>(
      endpoints.propositions.byVoyage(voyageId)
    );
    return response.data;
  },

  /**
   * Récupérer les propositions acceptées pour un voyage
   */
  async getAcceptedByVoyage(voyageId: number): Promise<Proposition[]> {
    const response = await apiClient.get<Proposition[]>(
      endpoints.propositions.acceptedByVoyage(voyageId)
    );
    return response.data;
  },

  /**
   * Récupérer mes propositions envoyées
   */
  async getMySent(): Promise<Proposition[]> {
    const response = await apiClient.get<Proposition[]>(
      endpoints.propositions.mySent
    );
    return response.data;
  },

  /**
   * Récupérer mes propositions reçues
   */
  async getMyReceived(): Promise<Proposition[]> {
    const response = await apiClient.get<Proposition[]>(
      endpoints.propositions.myReceived
    );
    return response.data;
  },

  /**
   * Compter mes propositions en attente
   */
  async getMyPendingCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(
      endpoints.propositions.myPendingCount
    );
    return response.data.count;
  },
};