import { useCallback } from 'react';

import { useAdminStore } from '@/lib/store/adminStore';
import { logger } from '@/lib/utils/logger';

/**
 * Hook personnalisé pour simplifier l'utilisation du store admin
 * Permet d'accéder facilement aux données et actions admin
 */
export function useAdmin() {
  const store = useAdminStore();

  const refetchAdminStats = useCallback(async () => {
    try {
      // Call the stable functions directly from the store instance
      await Promise.all([
        store.fetchDashboard(),
        store.fetchUsersStats(),
        store.fetchVoyagesStats(),
        store.fetchDemandesStats(),
        store.fetchSignalementsStats(),
        store.fetchActivityStats(),
        store.fetchEngagementStats(),
      ]);
      logger.log('[Admin] Statistiques rechargées avec succès');
    } catch (err) {
      logger.error('[Admin] Erreur lors du refetch des stats', err);
    }
  }, [store]);

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
    voyagesList: store.voyagesList,
    voyagesListPagination: store.voyagesListPagination,
    demandesList: store.demandesList,
    demandesListPagination: store.demandesListPagination,
    avisList: store.avisList,
    avisPagination: store.avisPagination,
    subscriptionPlans: store.subscriptionPlans,
    boostOffers: store.boostOffers,
    revenueStats: store.revenueStats,
    transactions: store.transactions,
    transactionsPagination: store.transactionsPagination,
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
    fetchVoyagesList: store.fetchVoyagesList,
    fetchDemandesList: store.fetchDemandesList,
    fetchAvisList: store.fetchAvisList,
    deleteVoyage: store.deleteVoyage,
    deleteDemande: store.deleteDemande,
    deleteAvis: store.deleteAvis,
    deleteMessage: store.deleteMessage,
    deleteAllUserContent: store.deleteAllUserContent,
    fetchLogs: store.fetchLogs,
    fetchLogsByAdmin: store.fetchLogsByAdmin,
    fetchLogsStats: store.fetchLogsStats,
    exportLogs: store.exportLogs,
    fetchSubscriptionPlans: store.fetchSubscriptionPlans,
    createSubscriptionPlan: store.createSubscriptionPlan,
    updateSubscriptionPlan: store.updateSubscriptionPlan,
    deleteSubscriptionPlan: store.deleteSubscriptionPlan,
    fetchBoostOffers: store.fetchBoostOffers,
    createBoostOffer: store.createBoostOffer,
    updateBoostOffer: store.updateBoostOffer,
    deleteBoostOffer: store.deleteBoostOffer,
    fetchRevenueStats: store.fetchRevenueStats,
    fetchTransactions: store.fetchTransactions,
    refundTransaction: store.refundTransaction,
    clearError: store.clearError,
    reset: store.reset,
    refetchAdminStats,
  };
}