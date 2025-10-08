import apiClient from './client';
import { endpoints } from './endpoints';
import type { 
  Signalement, 
  CreateSignalementInput, 
  TraiterSignalementInput,
  PaginatedResponse,
} from '@/types';

export const signalementsApi = {
  async list(page = 1, limit = 10, statut?: string): Promise<PaginatedResponse<Signalement>> {
    const response = await apiClient.get<PaginatedResponse<Signalement>>(endpoints.signalements.list, {
      params: { page, limit, statut },
    });
    return response.data;
  },

  async me(page = 1, limit = 10, statut?: string): Promise<PaginatedResponse<Signalement>> {
    const response = await apiClient.get<PaginatedResponse<Signalement>>(endpoints.signalements.me, {
      params: {page, limit, statut },
    });
    return response.data;
  },

  async create(data: CreateSignalementInput): Promise<Signalement> {
    const response = await apiClient.post<Signalement>(endpoints.signalements.create, data);
    return response.data;
  },

  async process(id: number, data: TraiterSignalementInput): Promise<Signalement> {
    const response = await apiClient.patch<Signalement>(endpoints.signalements.process(id), data);
    return response.data;
  },

  async getPendingCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(endpoints.signalements.pendingCount);
    return response.data.count || 0;
  },
};