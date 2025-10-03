/**
 * Export centralisé de tous les hooks personnalisés
 */

// Auth hooks
export { useAuth, useRequireAuth } from './useAuth';

// Voyage hooks
export { 
  useVoyages, 
  useVoyage, 
  useVoyageActions, 
  useUserVoyages 
} from './useVoyages';

// Demande hooks
export { 
  useDemandes, 
  useDemande, 
  useDemandeActions, 
  useUserDemandes 
} from './useDemandes';

// Message hooks
export { 
  useConversations, 
  useConversation, 
  useUnreadMessages 
} from './useMessages';

// Notification hooks
export { 
  useNotifications, 
  useUnreadNotifications, 
  useUnreadNotificationCount 
} from './useNotifications';

// User hooks
export { 
  useUser, 
  useSearchUsers, 
  useUpdateProfile 
} from './useUsers';

// Favori hooks
export { 
  useFavoris, 
  useFavorisVoyages, 
  useFavorisDemandes, 
  useFavoriActions 
} from './useFavoris';

// Avis hooks
export { 
  useUserAvis, 
  useAvisActions 
} from './useAvis';

// Signalement hooks
export { 
  useSignalements, 
  useSignalementActions, 
  usePendingSignalements 
} from './useSignalement';