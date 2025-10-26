import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { StableContext } from '@/types/realtime';

import {
  useAdmin,
  useAuth,
  useUserAvis,
  useConversations,
  useUnreadMessages,
  useDemandes,
  useUserDemandes,
  useFavoris,
  useNotifications,
  useUnreadNotificationCount,
  useVoyagePropositions,
  useSignalements,
  useVoyages,
  useUserVoyages,
} from '@/lib/hooks';
import { useInAppNotification } from './useInAppNotification';
import { useContacts } from './useContacts';
import { useGlobalMercureSubscription } from './useMercureSubscription';

export function useMercureEvents() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const { showNotification } = useInAppNotification();

  // === Récupération de tous les hooks refetch ===
  const { refetch: refetchNotif } = useNotifications();
  const { refetch: refetchNotifCount } = useUnreadNotificationCount(isAuthenticated);
  const { refetch: refetchConvs } = useConversations();
  const { refetch: refetchMessageCount } = useUnreadMessages(isAuthenticated);
  const { refetch: refetchDemandes } = useDemandes();
  const { refetch: refetchUserDemandes } = useUserDemandes(user?.id);
  const { refetch: refetchVoyages } = useVoyages();
  const { refetch: refetchUserVoyages } = useUserVoyages(user?.id);
  const { refetch: refetchFavoris } = useFavoris();
  const { refetchAdminStats } = useAdmin();
  const { refetch: refetchPropositionsVoyage } = useVoyagePropositions();
  const { refetch: adminRefetchSignalements } = useSignalements();
  const { refetch: adminRefetchContacts } = useContacts();
  const { refetch: refetchUserAvis } = useUserAvis(user?.id);

  // === Contexte stable partagé pour tous les handlers ===
  const stable = useMemo<StableContext>(
    () => ({
      userId: user?.id ?? 0,
      user: user ?? undefined,
      isAdmin,
      router,
      showNotification,
      refetchNotif,
      refetchNotifCount,
      refetchConvs,
      refetchMessageCount,
      refetchDemandes,
      refetchVoyages,
      refetchUserDemandes,
      refetchUserVoyages,
      refetchFavoris,
      refetchFavorisVoyages: refetchFavoris,
      refetchFavorisDemandes: refetchFavoris,
      refetchAdminStats: isAdmin ? refetchAdminStats : undefined,
      refetchPropositionsVoyage,
      refetchSignalements: isAdmin ? adminRefetchSignalements : undefined,
      refetchContacts: isAdmin ? adminRefetchContacts : undefined,
      refetchUserAvis,
    }),
    [
      user,
      isAdmin,
      router,
      showNotification,
      refetchNotif,
      refetchNotifCount,
      refetchConvs,
      refetchMessageCount,
      refetchDemandes,
      refetchVoyages,
      refetchUserDemandes,
      refetchUserVoyages,
      refetchFavoris,
      refetchAdminStats,
      refetchPropositionsVoyage,
      adminRefetchSignalements,
      adminRefetchContacts,
      refetchUserAvis,
    ]
  );

  // Hook de souscription Mercure (appelé directement)
  useGlobalMercureSubscription(stable);

  // Simple log d’état
  useEffect(() => {
    console.log('[Mercure] Prêt à dispatcher les événements via handlers...');
  }, []);
}
