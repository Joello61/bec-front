import { useAdminStore } from '@/lib/store/adminStore';

/**
 * Hook personnalisé pour simplifier l'utilisation du store admin
 * Permet d'accéder facilement aux données et actions admin
 */
export function useAdmin() {
  const store = useAdminStore();

  return {
    // State
    dashboardData: store.dashboardData,
    usersStats: store.usersStats,
    voyagesStats: store.voyagesStats,
    demandesStats: store.demandesStats,
    signalementsStats: store.signalementsStats,
    activityStats: store.activityStats,
    engagementStats: store.engagementStats,
    users: store.users,
    currentUser: store.currentUser,
    userActivity: store.userActivity,
    userAdminLogs: store.userAdminLogs,
    usersPagination: store.usersPagination,
    logs: store.logs,
    logsStats: store.logsStats,
    logsPagination: store.logsPagination,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    fetchDashboard: store.fetchDashboard,
    fetchUsersStats: store.fetchUsersStats,
    fetchVoyagesStats: store.fetchVoyagesStats,
    fetchDemandesStats: store.fetchDemandesStats,
    fetchSignalementsStats: store.fetchSignalementsStats,
    fetchActivityStats: store.fetchActivityStats,
    fetchEngagementStats: store.fetchEngagementStats,
    fetchUsers: store.fetchUsers,
    fetchUserDetails: store.fetchUserDetails,
    fetchUserActivity: store.fetchUserActivity,
    fetchUserAdminLogs: store.fetchUserAdminLogs,
    searchUsers: store.searchUsers,
    banUser: store.banUser,
    unbanUser: store.unbanUser,
    updateUserRoles: store.updateUserRoles,
    deleteUser: store.deleteUser,
    deleteVoyage: store.deleteVoyage,
    deleteDemande: store.deleteDemande,
    deleteAvis: store.deleteAvis,
    deleteMessage: store.deleteMessage,
    deleteAllUserContent: store.deleteAllUserContent,
    fetchLogs: store.fetchLogs,
    fetchLogsByAdmin: store.fetchLogsByAdmin,
    fetchLogsStats: store.fetchLogsStats,
    exportLogs: store.exportLogs,
    clearError: store.clearError,
    reset: store.reset,
  };
}