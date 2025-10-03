export interface ApiError {
  error: boolean;
  message: string;
  statusCode: number;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  count?: number;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    roles: string[];
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
  };
}