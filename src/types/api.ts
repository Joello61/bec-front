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

// Réponse du login (correspond au backend)
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

// Réponse du register
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
