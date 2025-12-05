/**
 * Constantes globales de l'application
 */

import { Route } from 'next';

// API
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Routes
export const ROUTES = {
  HOME: '/' as Route,
  ABOUT: '/about' as Route,
  PUBLIC_EXPLORE: '/explore' as Route,
  CONTACT: '/contact' as Route,
  TERMS: '/legal/terms' as Route,
  PRIVACY: '/legal/privacy' as Route,
  COOKIES: '/legal/cookies' as Route,
  FAQ: '/faq' as Route,
  HOW_IT_WORKS: '/how-it-works' as Route,
  TRUST_SAFETY: '/legal/trust-safety' as Route,
  LOGIN: '/auth/login' as Route,
  REGISTER: '/auth/register' as Route,
  FORGOT_PASSWORD: '/auth/forgot-password' as Route,
  RESET_PASSWORD: '/auth/reset-password' as Route,
  AUTH_CHANGE_PASSWORD: '/dashboard/profile/change-password' as Route,

  // ==================== NOUVELLES ROUTES AUTH ====================
  VERIFY_EMAIL: '/auth/verify-email' as Route,
  COMPLETE_PROFILE: '/dashboard/complete-profile' as Route,

  DASHBOARD: '/dashboard' as Route,
  EXPLORE: '/dashboard/explore' as Route,
  VOYAGE_DETAILS: (id: number) => `/dashboard/explore/voyage/${id}` as Route,
  DEMANDE_DETAILS: (id: number) => `/dashboard/explore/demande/${id}` as Route,
  MES_VOYAGES: '/dashboard/mes-voyages' as Route,
  MES_VOYAGE_DETAILS: (id: number) => `/dashboard/mes-voyages/${id}` as Route,
  MES_DEMANDES: '/dashboard/mes-demandes' as Route,
  MES_DEMANDE_DETAILS: (id: number) => `/dashboard/mes-demandes/${id}` as Route,
  MES_PROPOSITIONS: '/dashboard/mes-propositions' as Route,
  MES_PROPOSITION_DETAILS: (id: number) =>
    `/dashboard/mes-propositions/${id}` as Route,
  MESSAGES: '/dashboard/messages' as Route,
  CONVERSATION: (id: number) => `/dashboard/messages/${id}` as Route,
  NOTIFICATIONS: '/dashboard/notifications' as Route,
  FAVORIS: '/dashboard/favoris' as Route,
  PROFILE: '/dashboard/profile' as Route,
  USER_PROFILE: (id: number) => `/dashboard/users/${id}` as Route,
  PROFILE_ADDRESS: '/dashboard/profile/address' as Route,
  SETTINGS: '/dashboard/settings' as Route,
  HELP: '/dashboard/help' as Route,
  SIGNALEMENTS: '/dashboard/signalements' as Route,
  ADMIN: '/admin' as Route,
  ADMIN_DASHBOARD: '/admin' as Route,
  ADMIN_STATS: '/admin/stats' as Route,
  ADMIN_USERS: '/admin/users' as Route,
  ADMIN_USER_DETAILS: (id: number) => `/admin/users/${id}` as Route,
  ADMIN_MODERATION: '/admin/moderation' as Route,
  ADMIN_MODERATION_VOYAGES: '/admin/moderation/voyages' as Route,
  ADMIN_MODERATION_DEMANDES: '/admin/moderation/demandes' as Route,
  ADMIN_MODERATION_AVIS: '/admin/moderation/avis' as Route,
  ADMIN_LOGS: '/admin/logs' as Route,
} as const;


// Statuts
export const VOYAGE_STATUTS = [
  { value: 'actif', label: 'Actif', color: 'success' },
  { value: 'complet', label: 'Complet', color: 'warning' },
  { value: 'termine', label: 'Terminé', color: 'neutral' },
  { value: 'annule', label: 'Annulé', color: 'error' },
] as const;

export const DEMANDE_STATUTS = [
  { value: 'en_recherche', label: 'En recherche', color: 'info' },
  { value: 'voyageur_trouve', label: 'Voyageur trouvé', color: 'success' },
  { value: 'annulee', label: 'Annulée', color: 'error' },
] as const;

export const SIGNALEMENT_MOTIFS = [
  { value: 'contenu_inapproprie', label: 'Contenu inapproprié' },
  { value: 'spam', label: 'Spam' },
  { value: 'arnaque', label: 'Arnaque' },
  { value: 'objet_illegal', label: 'Objet illégal' },
  { value: 'autre', label: 'Autre' },
] as const;

// Notes
export const NOTES = [1, 2, 3, 4, 5] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

// Limites
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MAX_BIO_LENGTH = 500;

// Durées (en ms)
export const TOAST_DURATION = 3000;
export const DEBOUNCE_DELAY = 300;
export const NOTIFICATION_REFRESH_INTERVAL = 30000; // 30s
export const MESSAGE_REFRESH_INTERVAL = 30000; // 30s

// Règles métier
export const MIN_WEIGHT = 0.1;
export const MAX_WEIGHT = 100;
export const MIN_AVIS_NOTE = 1;
export const MAX_AVIS_NOTE = 5;

// Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Une erreur est survenue',
  NETWORK: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette page',
  FORBIDDEN: "Vous n'avez pas les droits pour effectuer cette action",
  NOT_FOUND: "La ressource demandée n'existe pas",
  VALIDATION: 'Veuillez vérifier les informations saisies',
  // ==================== NOUVEAU ====================
  PROFILE_INCOMPLETE:
    'Vous devez compléter votre profil pour effectuer cette action',
  EMAIL_NOT_VERIFIED: 'Veuillez vérifier votre adresse email',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN: 'Connexion réussie',
  REGISTER: 'Inscription réussie',
  LOGOUT: 'Déconnexion réussie',
  CREATE: 'Création réussie',
  UPDATE: 'Modification réussie',
  DELETE: 'Suppression réussie',
  MESSAGE_SENT: 'Message envoyé',
  AVIS_CREATED: 'Avis publié',
  FAVORI_ADDED: 'Ajouté aux favoris',
  FAVORI_REMOVED: 'Retiré des favoris',
  SIGNALEMENT_SENT: 'Signalement envoyé',
  // ==================== NOUVEAU ====================
  EMAIL_VERIFIED: 'Email vérifié avec succès',
  PHONE_VERIFIED: 'Téléphone vérifié avec succès',
  PROFILE_COMPLETED: 'Profil complété avec succès',
} as const;

// Liens sociaux
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com',
  TWITTER: 'https://twitter.com',
  INSTAGRAM: 'https://instagram.com',
  LINKEDIN: 'https://linkedin.com',
} as const;

// Contact
export const CONTACT = {
  EMAIL: 'support@cobage.joeltech.dev',
  PHONE: '+330752892073',
  ADDRESS: 'Toulouse, France',
} as const;
