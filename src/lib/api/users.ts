import apiClient from './client';
import { endpoints } from './endpoints';
import type { User, UpdateUserInput, PaginatedResponse, DashboardData } from '@/types';

export const usersApi = {
  async list(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(endpoints.users.list, {
      params: { page, limit },
    });
    return response.data;
  },

  async show(id: number): Promise<User> {
    const response = await apiClient.get<User>(endpoints.users.show(id));
    return response.data;
  },

  async updateMe(data: UpdateUserInput): Promise<User> {
    const response = await apiClient.put<User>(endpoints.users.updateMe, data);
    return response.data;
  },

  async search(query: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(endpoints.users.search, {
      params: { q: query },
    });
    return response.data;
  },

  async dashboard(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>(endpoints.users.dashboard);
    return response.data;
  },
};