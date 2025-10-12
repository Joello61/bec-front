import apiClient from './client';
import { endpoints } from './endpoints';
import type {
  AdminDashboardData,
  AdminVoyagesStats,
  AdminDemandesStats,
  AdminSignalementsStats,
  AdminActivityStats,
  AdminEngagementStats,
  User,
  AdminUserActivity,
  AdminLog,
  AdminLogFilters,
  AdminLogStats,
  BanUserInput,
  UpdateUserRolesInput,
  DeleteContentInput,
  AdminUserFilters,
  PaginatedResponse,
  AdminUsersDetailedStats,
} from '@/types';

// ==================== DASHBOARD ====================
export const adminApi = {
  // Dashboard global
  getDashboard: async (): Promise<AdminDashboardData> => {
    const { data } = await apiClient.get(endpoints.admin.dashboard);
    return data;
  },

  // Stats détaillées par type
  getUsersStats: async (): Promise<AdminUsersDetailedStats> => {
    const { data } = await apiClient.get(endpoints.admin.stats('users'));
    return data;
  },

  getVoyagesStats: async (): Promise<AdminVoyagesStats> => {
    const { data } = await apiClient.get(endpoints.admin.stats('voyages'));
    return data;
  },

  getDemandesStats: async (): Promise<AdminDemandesStats> => {
    const { data } = await apiClient.get(endpoints.admin.stats('demandes'));
    return data;
  },

  getSignalementsStats: async (): Promise<AdminSignalementsStats> => {
    const { data } = await apiClient.get(endpoints.admin.stats('signalements'));
    return data;
  },

  getActivityStats: async (): Promise<AdminActivityStats> => {
    const { data } = await apiClient.get(endpoints.admin.stats('activity'));
    return data;
  },

  getEngagementStats: async (): Promise<AdminEngagementStats> => {
    const { data } = await apiClient.get(endpoints.admin.stats('engagement'));
    return data;
  },

  // ==================== USERS ====================
  getUsers: async (
    page = 1,
    limit = 20,
    filters?: AdminUserFilters
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get(endpoints.admin.users, {
      params: { page, limit, ...filters },
    });
    return data;
  },

  getUserDetails: async (id: number): Promise<User> => {
    const { data } = await apiClient.get(endpoints.admin.userDetails(id));
    return data;
  },

  getUserActivity: async (id: number): Promise<AdminUserActivity> => {
    const { data } = await apiClient.get(endpoints.admin.userActivity(id));
    return data;
  },

  getUserAdminLogs: async (id: number): Promise<AdminLog[]> => {
    const { data } = await apiClient.get(endpoints.admin.userAdminLogs(id));
    return data;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const { data } = await apiClient.get(endpoints.admin.searchUsers, {
      params: { q: query },
    });
    return data;
  },

  banUser: async (id: number, input: BanUserInput): Promise<void> => {
    await apiClient.post(endpoints.admin.banUser(id), input);
  },

  unbanUser: async (id: number): Promise<void> => {
    await apiClient.post(endpoints.admin.unbanUser(id));
  },

  updateUserRoles: async (id: number, input: UpdateUserRolesInput): Promise<void> => {
    await apiClient.patch(endpoints.admin.updateRoles(id), input);
  },

  deleteUser: async (id: number, reason: string): Promise<void> => {
    await apiClient.delete(endpoints.admin.deleteUser(id), {
      data: { reason },
    });
  },

  // ==================== MODÉRATION ====================
  deleteVoyage: async (id: number, input: DeleteContentInput): Promise<void> => {
    await apiClient.delete(endpoints.admin.deleteVoyage(id), {
      data: input,
    });
  },

  deleteDemande: async (id: number, input: DeleteContentInput): Promise<void> => {
    await apiClient.delete(endpoints.admin.deleteDemande(id), {
      data: input,
    });
  },

  deleteAvis: async (id: number, input: DeleteContentInput): Promise<void> => {
    await apiClient.delete(endpoints.admin.deleteAvis(id), {
      data: input,
    });
  },

  deleteMessage: async (id: number, input: DeleteContentInput): Promise<void> => {
    await apiClient.delete(endpoints.admin.deleteMessage(id), {
      data: input,
    });
  },

  deleteAllUserContent: async (userId: number, input: DeleteContentInput): Promise<void> => {
    await apiClient.delete(endpoints.admin.deleteAllUserContent(userId), {
      data: input,
    });
  },

  getModerationStats: async () => {
    const { data } = await apiClient.get(endpoints.admin.moderationStats);
    return data;
  },

  // ==================== LOGS ====================
  getLogs: async (
    page = 1,
    limit = 20,
    filters?: AdminLogFilters
  ): Promise<PaginatedResponse<AdminLog>> => {
    const { data } = await apiClient.get(endpoints.admin.logs, {
      params: { page, limit, ...filters },
    });
    return data;
  },

  getLogsByAdmin: async (adminId: number): Promise<AdminLog[]> => {
    const { data } = await apiClient.get(endpoints.admin.logsByAdmin(adminId));
    return data;
  },

  getLogsStats: async (): Promise<AdminLogStats> => {
    const { data } = await apiClient.get(endpoints.admin.logsStats);
    return data;
  },

  exportLogs: async (filters?: AdminLogFilters): Promise<Blob> => {
    const { data } = await apiClient.get(endpoints.admin.exportLogs, {
      params: filters,
      responseType: 'blob',
    });
    return data;
  },
};