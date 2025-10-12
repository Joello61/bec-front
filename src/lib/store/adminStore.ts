/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { adminApi } from '@/lib/api/admin';
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
  PaginationMeta,
  AdminUsersDetailedStats,
} from '@/types';

interface AdminState {
  // Dashboard & Stats
  dashboardData: AdminDashboardData | null;
  usersStats: AdminUsersDetailedStats | null;
  voyagesStats: AdminVoyagesStats | null;
  demandesStats: AdminDemandesStats | null;
  signalementsStats: AdminSignalementsStats | null;
  activityStats: AdminActivityStats | null;
  engagementStats: AdminEngagementStats | null;

  // Users
  users: User[];
  currentUser: User | null;
  userActivity: AdminUserActivity | null;
  userAdminLogs: AdminLog[];
  usersPagination: PaginationMeta | null;

  // Logs
  logs: AdminLog[];
  logsStats: AdminLogStats | null;
  logsPagination: PaginationMeta | null;

  // Loading & Error
  isLoading: boolean;
  error: string | null;

  // ==================== ACTIONS ====================

  // Dashboard
  fetchDashboard: () => Promise<void>;
  fetchUsersStats: () => Promise<void>;
  fetchVoyagesStats: () => Promise<void>;
  fetchDemandesStats: () => Promise<void>;
  fetchSignalementsStats: () => Promise<void>;
  fetchActivityStats: () => Promise<void>;
  fetchEngagementStats: () => Promise<void>;

  // Users
  fetchUsers: (page?: number, limit?: number, filters?: AdminUserFilters) => Promise<void>;
  fetchUserDetails: (id: number) => Promise<void>;
  fetchUserActivity: (id: number) => Promise<void>;
  fetchUserAdminLogs: (id: number) => Promise<void>;
  searchUsers: (query: string) => Promise<User[]>;
  banUser: (id: number, input: BanUserInput) => Promise<void>;
  unbanUser: (id: number) => Promise<void>;
  updateUserRoles: (id: number, input: UpdateUserRolesInput) => Promise<void>;
  deleteUser: (id: number, reason: string) => Promise<void>;

  // Modération
  deleteVoyage: (id: number, input: DeleteContentInput) => Promise<void>;
  deleteDemande: (id: number, input: DeleteContentInput) => Promise<void>;
  deleteAvis: (id: number, input: DeleteContentInput) => Promise<void>;
  deleteMessage: (id: number, input: DeleteContentInput) => Promise<void>;
  deleteAllUserContent: (userId: number, input: DeleteContentInput) => Promise<void>;

  // Logs
  fetchLogs: (page?: number, limit?: number, filters?: AdminLogFilters) => Promise<void>;
  fetchLogsByAdmin: (adminId: number) => Promise<void>;
  fetchLogsStats: () => Promise<void>;
  exportLogs: (filters?: AdminLogFilters) => Promise<Blob>;

  // Utils
  clearError: () => void;
  reset: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Initial state
  dashboardData: null,
  usersStats: null,
  voyagesStats: null,
  demandesStats: null,
  signalementsStats: null,
  activityStats: null,
  engagementStats: null,
  users: [],
  currentUser: null,
  userActivity: null,
  userAdminLogs: [],
  usersPagination: null,
  logs: [],
  logsStats: null,
  logsPagination: null,
  isLoading: false,
  error: null,

  // ==================== DASHBOARD ====================
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const dashboardData = await adminApi.getDashboard();
      set({ dashboardData, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors du chargement du dashboard',
        isLoading: false,
      });
    }
  },

  fetchUsersStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const usersStats = await adminApi.getUsersStats();
      set({ usersStats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors du chargement des stats utilisateurs',
        isLoading: false,
      });
    }
  },

  fetchVoyagesStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const voyagesStats = await adminApi.getVoyagesStats();
      set({ voyagesStats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors du chargement des stats voyages',
        isLoading: false,
      });
    }
  },

  fetchDemandesStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const demandesStats = await adminApi.getDemandesStats();
      set({ demandesStats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors du chargement des stats demandes',
        isLoading: false,
      });
    }
  },

  fetchSignalementsStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const signalementsStats = await adminApi.getSignalementsStats();
      set({ signalementsStats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors du chargement des stats signalements',
        isLoading: false,
      });
    }
  },

  fetchActivityStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const activityStats = await adminApi.getActivityStats();
      set({ activityStats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Erreur lors du chargement des stats d'activité",
        isLoading: false,
      });
    }
  },

  fetchEngagementStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const engagementStats = await adminApi.getEngagementStats();
      set({ engagementStats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Erreur lors du chargement des stats d'engagement",
        isLoading: false,
      });
    }
  },

  // ==================== USERS ====================
  fetchUsers: async (page = 1, limit = 20, filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminApi.getUsers(page, limit, filters);
      set({
        users: response.data,
        usersPagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors du chargement des utilisateurs',
        isLoading: false,
      });
    }
  },

  fetchUserDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = await adminApi.getUserDetails(id);
      set({ currentUser, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Erreur lors du chargement des détails de l'utilisateur",
        isLoading: false,
      });
    }
  },

  fetchUserActivity: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const userActivity = await adminApi.getUserActivity(id);
      set({ userActivity, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Erreur lors du chargement de l'activité",
        isLoading: false,
      });
    }
  },

  fetchUserAdminLogs: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const userAdminLogs = await adminApi.getUserAdminLogs(id);
      set({ userAdminLogs, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors du chargement des logs',
        isLoading: false,
      });
    }
  },

  searchUsers: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const users = await adminApi.searchUsers(query);
      set({ users, isLoading: false });
      return users;
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors de la recherche',
        isLoading: false,
      });
      throw error;
    }
  },

  banUser: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.banUser(id, input);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Erreur lors du bannissement de l'utilisateur",
        isLoading: false,
      });
      throw error;
    }
  },

  unbanUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.unbanUser(id);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Erreur lors du débannissement de l'utilisateur",
        isLoading: false,
      });
      throw error;
    }
  },

  updateUserRoles: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.updateUserRoles(id, input);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors de la mise à jour des rôles',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id, reason) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteUser(id, reason);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Erreur lors de la suppression de l'utilisateur",
        isLoading: false,
      });
      throw error;
    }
  },

  // ==================== MODÉRATION ====================
  deleteVoyage: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteVoyage(id, input);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors de la suppression du voyage',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteDemande: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteDemande(id, input);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors de la suppression de la demande',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteAvis: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteAvis(id, input);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Erreur lors de la suppression de l'avis",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteMessage: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteMessage(id, input);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors de la suppression du message',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteAllUserContent: async (userId, input) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteAllUserContent(userId, input);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors de la suppression des contenus',
        isLoading: false,
      });
      throw error;
    }
  },

  // ==================== LOGS ====================
  fetchLogs: async (page = 1, limit = 20, filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminApi.getLogs(page, limit, filters);
      set({
        logs: response.data,
        logsPagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors du chargement des logs',
        isLoading: false,
      });
    }
  },

  fetchLogsByAdmin: async (adminId) => {
    set({ isLoading: true, error: null });
    try {
      const logs = await adminApi.getLogsByAdmin(adminId);
      set({ logs, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors du chargement des logs',
        isLoading: false,
      });
    }
  },

  fetchLogsStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const logsStats = await adminApi.getLogsStats();
      set({ logsStats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors du chargement des stats logs',
        isLoading: false,
      });
    }
  },

  exportLogs: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const blob = await adminApi.exportLogs(filters);
      set({ isLoading: false });
      return blob;
    } catch (error: any) {
      set({
        error: error.message || "Erreur lors de l'export des logs",
        isLoading: false,
      });
      throw error;
    }
  },

  // ==================== UTILS ====================
  clearError: () => set({ error: null }),

  reset: () =>
    set({
      dashboardData: null,
      usersStats: null,
      voyagesStats: null,
      demandesStats: null,
      signalementsStats: null,
      activityStats: null,
      engagementStats: null,
      users: [],
      currentUser: null,
      userActivity: null,
      userAdminLogs: [],
      usersPagination: null,
      logs: [],
      logsStats: null,
      logsPagination: null,
      error: null,
    }),
}));