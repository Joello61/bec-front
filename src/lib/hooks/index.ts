/**
 * Export centralisé de tous les hooks personnalisés
 */

// Auth hooks
export { useAuth, useRequireAuth } from './useAuth';

// Voyage hooks
export { 
  useMatchingDemandes,
  useUserVoyages,
  useVoyage, 
  useVoyageActions, 
  useVoyages} from './useVoyages';

// Demande hooks
export {
  useConversation,
  useConversations,
  useConversationWithUser,
  useUnreadMessages} from './useConversations'
export { 
  useDemande, 
  useDemandeActions, 
  useDemandes, 
  useMatchingVoyages,
  useUserDemandes} from './useDemandes';

// Notification hooks
export { 
  useNotifications, 
  useUnreadNotificationCount, 
  useUnreadNotifications} from './useNotifications';

// User hooks
export { 
  useSearchUsers, 
  useUpdateProfile, 
  useUser} from './useUsers';

// Favori hooks
export { 
  useFavoriActions, 
  useFavoris, 
  useFavorisDemandes, 
  useFavorisVoyages} from './useFavoris';

// Avis hooks
export { 
  useAvisActions, 
  useUserAvis} from './useAvis';

// Signalement hooks
export { useAddress, useAddressModificationInfo, useCanModifyAddress } from './useAddress';
export * from './useAdmin';
export * from './useCurrency'; // <- AJOUT
export * from './useCurrencyFormat'; // <- AJOUT
export {
  useAcceptedPropositions,
  useMyPropositionsReceived,
  useMyPropositionsSent,
  usePendingPropositionsCount,
  usePropositionActions,
  useVoyagePropositions
} from './usePropositions'
export {
  useSettings,
  useSettingsActions
} from './useSettings'
export { 
  usePendingSignalements, 
  useSignalementActions, 
  useSignalements} from './useSignalement';
export {
  useSubscription,
  useSubscriptionActions,
  useSubscriptionPlans
} from './useSubscription'