import { create } from 'zustand';

import { adminApi } from '@/lib/api/admin';
import type {
  AdminActivityStats,
  AdminAvisFilters,
  AdminContentListFilters,
  AdminDashboardData,
  AdminDemandesStats,
  AdminEngagementStats,
  AdminLog,
  AdminLogFilters,
  AdminLogStats,
  AdminSignalementsStats,
  AdminUserActivity,
  AdminUserFilters,
  AdminUsersDetailedStats,
  AdminVoyagesStats,
  Avis,
  BanUserInput,
  DeleteContentInput,
  Demande,
  PaginationMeta,
  UpdateUserRolesInput,
  User,
  Voyage,
} from '@/types';

import { createAsyncAction } from './createAsyncAction';

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

  // Modération - voyages/demandes/avis
  voyagesList: Voyage[];
  voyagesListPagination: PaginationMeta | null;
  demandesList: Demande[];
  demandesListPagination: PaginationMeta | null;
  avisList: Avis[];
  avisPagination: PaginationMeta | null;

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
  fetchVoyagesList: (page?: number, limit?: number, filters?: AdminContentListFilters) => Promise<void>;
  fetchDemandesList: (page?: number, limit?: number, filters?: AdminContentListFilters) => Promise<void>;
  fetchAvisList: (page?: number, limit?: number, filters?: AdminAvisFilters) => Promise<void>;
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
  voyagesList: [],
  voyagesListPagination: null,
  demandesList: [],
  demandesListPagination: null,
  avisList: [],
  avisPagination: null,
  isLoading: false,
  error: null,

  // ==================== DASHBOARD ====================
  fetchDashboard: () =>
    createAsyncAction(set, async () => {
      const dashboardData = await adminApi.getDashboard();
      set({ dashboardData, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement du dashboard' }),

  fetchUsersStats: () =>
    createAsyncAction(set, async () => {
      const usersStats = await adminApi.getUsersStats();
      set({ usersStats, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des stats utilisateurs' }),

  fetchVoyagesStats: () =>
    createAsyncAction(set, async () => {
      const voyagesStats = await adminApi.getVoyagesStats();
      set({ voyagesStats, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des stats voyages' }),

  fetchDemandesStats: () =>
    createAsyncAction(set, async () => {
      const demandesStats = await adminApi.getDemandesStats();
      set({ demandesStats, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des stats demandes' }),

  fetchSignalementsStats: () =>
    createAsyncAction(set, async () => {
      const signalementsStats = await adminApi.getSignalementsStats();
      set({ signalementsStats, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des stats signalements' }),

  fetchActivityStats: () =>
    createAsyncAction(set, async () => {
      const activityStats = await adminApi.getActivityStats();
      set({ activityStats, isLoading: false });
    }, { fallbackError: "Erreur lors du chargement des stats d'activité" }),

  fetchEngagementStats: () =>
    createAsyncAction(set, async () => {
      const engagementStats = await adminApi.getEngagementStats();
      set({ engagementStats, isLoading: false });
    }, { fallbackError: "Erreur lors du chargement des stats d'engagement" }),

  // ==================== USERS ====================
  fetchUsers: (page = 1, limit = 20, filters) =>
    createAsyncAction(set, async () => {
      const response = await adminApi.getUsers(page, limit, filters);
      set({ users: response.data, usersPagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des utilisateurs' }),

  fetchUserDetails: (id) =>
    createAsyncAction(set, async () => {
      const currentUser = await adminApi.getUserDetails(id);
      set({ currentUser, isLoading: false });
    }, { fallbackError: "Erreur lors du chargement des détails de l'utilisateur" }),

  fetchUserActivity: (id) =>
    createAsyncAction(set, async () => {
      const userActivity = await adminApi.getUserActivity(id);
      set({ userActivity, isLoading: false });
    }, { fallbackError: "Erreur lors du chargement de l'activité" }),

  fetchUserAdminLogs: (id) =>
    createAsyncAction(set, async () => {
      const userAdminLogs = await adminApi.getUserAdminLogs(id);
      set({ userAdminLogs, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des logs' }),

  searchUsers: (query) =>
    createAsyncAction(set, async () => {
      const users = await adminApi.searchUsers(query);
      set({ users, isLoading: false });
      return users;
    }, { fallbackError: 'Erreur lors de la recherche', rethrow: true }),

  banUser: (id, input) =>
    createAsyncAction(set, async () => {
      await adminApi.banUser(id, input);
      set({ isLoading: false });
    }, { fallbackError: "Erreur lors du bannissement de l'utilisateur", rethrow: true }),

  unbanUser: (id) =>
    createAsyncAction(set, async () => {
      await adminApi.unbanUser(id);
      set({ isLoading: false });
    }, { fallbackError: "Erreur lors du débannissement de l'utilisateur", rethrow: true }),

  updateUserRoles: (id, input) =>
    createAsyncAction(set, async () => {
      await adminApi.updateUserRoles(id, input);
      set({ isLoading: false });
    }, { fallbackError: 'Erreur lors de la mise à jour des rôles', rethrow: true }),

  deleteUser: (id, reason) =>
    createAsyncAction(set, async () => {
      await adminApi.deleteUser(id, reason);
      set((state) => ({ users: state.users.filter((u) => u.id !== id), isLoading: false }));
    }, { fallbackError: "Erreur lors de la suppression de l'utilisateur", rethrow: true }),

  // ==================== MODÉRATION ====================
  fetchVoyagesList: (page = 1, limit = 20, filters) =>
    createAsyncAction(set, async () => {
      const response = await adminApi.getVoyagesList(page, limit, filters);
      set({ voyagesList: response.data, voyagesListPagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des voyages' }),

  fetchDemandesList: (page = 1, limit = 20, filters) =>
    createAsyncAction(set, async () => {
      const response = await adminApi.getDemandesList(page, limit, filters);
      set({ demandesList: response.data, demandesListPagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des demandes' }),

  fetchAvisList: (page = 1, limit = 20, filters) =>
    createAsyncAction(set, async () => {
      const response = await adminApi.getAvisList(page, limit, filters);
      set({ avisList: response.data, avisPagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des avis' }),

  deleteVoyage: (id, input) =>
    createAsyncAction(set, async () => {
      await adminApi.deleteVoyage(id, input);
      set({ isLoading: false });
    }, { fallbackError: 'Erreur lors de la suppression du voyage', rethrow: true }),

  deleteDemande: (id, input) =>
    createAsyncAction(set, async () => {
      await adminApi.deleteDemande(id, input);
      set({ isLoading: false });
    }, { fallbackError: 'Erreur lors de la suppression de la demande', rethrow: true }),

  deleteAvis: (id, input) =>
    createAsyncAction(set, async () => {
      await adminApi.deleteAvis(id, input);
      set({ isLoading: false });
    }, { fallbackError: "Erreur lors de la suppression de l'avis", rethrow: true }),

  deleteMessage: (id, input) =>
    createAsyncAction(set, async () => {
      await adminApi.deleteMessage(id, input);
      set({ isLoading: false });
    }, { fallbackError: 'Erreur lors de la suppression du message', rethrow: true }),

  deleteAllUserContent: (userId, input) =>
    createAsyncAction(set, async () => {
      await adminApi.deleteAllUserContent(userId, input);
      set({ isLoading: false });
    }, { fallbackError: 'Erreur lors de la suppression des contenus', rethrow: true }),

  // ==================== LOGS ====================
  fetchLogs: (page = 1, limit = 20, filters) =>
    createAsyncAction(set, async () => {
      const response = await adminApi.getLogs(page, limit, filters);
      set({ logs: response.data, logsPagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des logs' }),

  fetchLogsByAdmin: (adminId) =>
    createAsyncAction(set, async () => {
      const logs = await adminApi.getLogsByAdmin(adminId);
      set({ logs, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des logs' }),

  fetchLogsStats: () =>
    createAsyncAction(set, async () => {
      const logsStats = await adminApi.getLogsStats();
      set({ logsStats, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des stats logs' }),

  exportLogs: (filters) =>
    createAsyncAction(set, async () => {
      const blob = await adminApi.exportLogs(filters);
      set({ isLoading: false });
      return blob;
    }, { fallbackError: "Erreur lors de l'export des logs", rethrow: true }),

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
      voyagesList: [],
      voyagesListPagination: null,
      demandesList: [],
      demandesListPagination: null,
      avisList: [],
      avisPagination: null,
      error: null,
    }),
}));
