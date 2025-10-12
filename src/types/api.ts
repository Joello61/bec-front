import { User } from "./user";

export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  debug?: {
    exception: string;
    file: string;
    line: number;
    trace: string;
  };
  // ==================== NOUVEAU : ERREUR PROFIL INCOMPLET ====================
  error?: 'PROFILE_INCOMPLETE' | 'ACCESS_DENIED';
  profileComplete?: boolean;
  details?: string[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Réponse standard de l'API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
}

// ==================== LOGIN RESPONSE (inchangé) ====================
export interface LoginResponse {
  success: true;
  message: string;
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    roles: string[];
    emailVerifie: boolean;
    telephoneVerifie: boolean;
    photo: string | null;
  };
}

// ==================== REGISTER RESPONSE (modifié) ====================
// Plus de JWT retourné, juste les infos user
export interface RegisterResponse {
  success: true;
  message: string;
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
  };
}

// ==================== NOUVEAU : VERIFY EMAIL RESPONSE ====================
// Retourne maintenant un JWT après vérification
export interface VerifyEmailResponse {
  success: true;
  message: string;
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    emailVerifie: boolean;
    isProfileComplete: boolean;
  };
  // Le JWT est dans le cookie, pas dans la réponse JSON
}

// ==================== NOUVEAU : COMPLETE PROFILE RESPONSE ====================
export interface CompleteProfileResponse {
  success: true;
  message: string;
  user: {
    id: number;
    telephone: string;
    pays: string;
    ville: string;
    quartier?: string;
    adresseLigne1?: string;
    codePostal?: string;
    isProfileComplete: boolean;
  };
}

// ==================== NOUVEAU : PROFILE STATUS RESPONSE ====================
export interface ProfileStatusResponse {
  isComplete: boolean;
  missing: string[];
  emailVerifie: boolean;
  telephoneVerifie: boolean;
}