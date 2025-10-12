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

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
}

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
}

// ==================== COMPLETE PROFILE RESPONSE MODIFIÉ ====================
export interface CompleteProfileResponse {
  success: true;
  message: string;
  user: {
    id: number;
    telephone: string;
    address: {
      pays: string;
      ville: string;
      quartier?: string;
      adresseLigne1?: string;
      codePostal?: string;
    };
    isProfileComplete: boolean;
  };
}

// ==================== PROFILE STATUS RESPONSE MODIFIÉ ====================
export interface ProfileStatusResponse {
  isComplete: boolean;
  missing: string[];
  emailVerifie: boolean;
  telephoneVerifie: boolean;
  hasAddress: boolean;
}