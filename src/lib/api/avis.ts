import apiClient from './client';
import { endpoints } from './endpoints';
import type { Avis, CreateAvisInput, AvisWithStats } from '@/types';

export const avisApi = {
  async byUser(userId: number): Promise<AvisWithStats> {
    const response = await apiClient.get<AvisWithStats>(endpoints.avis.byUser(userId));
    return response.data;
  },

  async create(data: CreateAvisInput): Promise<Avis> {
    const response = await apiClient.post<Avis>(endpoints.avis.create, data);
    return response.data;
  },

  async update(id: number, data: CreateAvisInput): Promise<Avis> {
    const response = await apiClient.put<Avis>(endpoints.avis.update(id), data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(endpoints.avis.delete(id));
  },
};