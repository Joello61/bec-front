/**
 * Constantes globales de l'application
 */

import { Route } from "next";

// API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Routes
export const ROUTES = {
  HOME: '/' as Route,
  ABOUT: '/about' as Route,
  CONTACT: '/contact' as Route,
  TERMS: '/terms' as Route,
  PRIVACY: '/privacy' as Route,
  FAQ: '/faq' as Route,
  HOW_IT_WORKS: '/how-it-works' as Route,
  TRUST_SAFETY: '/trust-safety' as Route,
  LOGIN: '/auth/login' as Route,
  REGISTER: '/auth/register' as Route,
  FORGOT_PASSWORD: '/auth/forgot-password' as Route,
  RESET_PASSWORD: '/auth/reset-password' as Route,
  VOYAGES: '/dashboard/voyages' as Route,
  VOYAGE_DETAILS: (id: number) => `/dashboard/voyages/${id}` as Route,
  DEMANDES: '/dashboard/demandes' as Route,
  DEMANDE_DETAILS: (id: number) => `/dashboard/demandes/${id}` as Route,
  MESSAGES: '/dashboard/messages' as Route,
  CONVERSATION: (id: number) => `/dashboard/messages/${id}` as Route,
  NOTIFICATIONS: '/dashboard/notifications' as Route,
  FAVORIS: '/dashboard/favoris' as Route,
  PROFILE: '/dashboard/profile' as Route,
  USER_PROFILE: (id: number) => `/dashboard/users/${id}` as Route,
} as const;

// Villes du Cameroun (principales)
export const VILLES_CAMEROUN = [
  'Yaoundé',
  'Douala',
  'Bafoussam',
  'Bamenda',
  'Garoua',
  'Maroua',
  'Ngaoundéré',
  'Bertoua',
  'Buea',
  'Limbé',
  'Edéa',
  'Kribi',
  'Ebolowa',
  'Kumba',
  'Nkongsamba',
] as const;

// Villes internationales populaires
export const VILLES_INTERNATIONALES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Bruxelles',
  'Londres',
  'New York',
  'Montréal',
  'Genève',
  'Dubaï',
  'Pékin',
] as const;

export const TOUTES_VILLES = [...VILLES_CAMEROUN, ...VILLES_INTERNATIONALES];

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
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
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
  FORBIDDEN: 'Vous n\'avez pas les droits pour effectuer cette action',
  NOT_FOUND: 'La ressource demandée n\'existe pas',
  VALIDATION: 'Veuillez vérifier les informations saisies',
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
  EMAIL: 'contact@bagage-express.cm',
  PHONE: '+237 6XX XX XX XX',
  ADDRESS: 'Yaoundé, Cameroun',
} as const;