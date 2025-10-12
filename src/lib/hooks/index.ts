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
  useUserVoyages,
  useMatchingDemandes
} from './useVoyages';

// Demande hooks
export { 
  useDemandes, 
  useDemande, 
  useDemandeActions, 
  useUserDemandes,
  useMatchingVoyages
} from './useDemandes';

export {
  useConversation,
  useConversationWithUser,
  useUnreadMessages,
  useConversations
} from './useConversations'

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

export {
  useSettings,
  useSettingsActions
} from './useSettings'

export {
  useAcceptedPropositions,
  useMyPropositionsReceived,
  useMyPropositionsSent,
  usePendingPropositionsCount,
  usePropositionActions,
  useVoyagePropositions
} from './usePropositions'

export { useAddress, useAddressModificationInfo, useCanModifyAddress } from './useAddress';

export * from './useAdmin';
export * from './useCurrency'; // ⬅️ AJOUT
export * from './useCurrencyFormat'; // ⬅️ AJOUT