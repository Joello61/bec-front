import type { User } from '@/types/user';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Type global partagé entre tous les handlers d'événements Mercure.
 * Il fournit les fonctions de refetch et les helpers stables issus du hook useMercureEvents().
 */
export interface StableContext {
  // === Données utilisateur ===
  userId: number;
  user?: User;
  isAdmin?: boolean;

  // === Navigation ===
  router: AppRouterInstance;

  // === Notifications in-app ===
  showNotification: (
    title: string,
    message: string,
    options?: { icon?: React.ReactNode; duration?: number }
  ) => void;

  // === Fonctions de refetch (issues des stores ou hooks) ===
  refetchNotif?: () => void;
  refetchNotifCount?: () => void;
  refetchConvs?: () => void;
  refetchMessageCount?: () => void;
  refetchDemandes?: () => void;
  refetchUserDemandes?: (userId: number) => void;
  refetchVoyages?: () => void;
  refetchUserVoyages?: (userId: number) => void;
  refetchFavoris?: () => void;
  refetchFavorisDemandes?: () => void;
  refetchFavorisVoyages?: () => void;
  refetchUser?: () => void;
  refetchAdminStats?: () => void;
  refetchUsers?: () => void;
  refetchPropositions?: () => void;
  refetchPropositionsVoyage?: (voyageId: number) => void;
  refetchContacts?: () => void;

  // === Autres fonctions optionnelles ===
  refetchSignalements?: () => void;
  refetchUserAvis?: (userId: number) => void;

  // === Helpers ===
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logEvent?: (type: string, data: any) => void;
}
