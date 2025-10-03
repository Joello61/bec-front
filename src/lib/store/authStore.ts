/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { authApi } from '@/lib/api/auth';
import type { User, LoginInput, RegisterInput } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // Nouveau
  error: string | null;
  
  login: (credentials: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Important: true au départ
  isInitialized: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.login(credentials);
      const user = await authApi.me();
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        isInitialized: true
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur de connexion', 
        isLoading: false,
        isInitialized: true,
        user: null,
        isAuthenticated: false
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.register(data);
      set({ 
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de l\'inscription', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        isInitialized: true,
        error: null 
      });
    } catch (error: any) {
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: error.message || 'Erreur lors de la déconnexion'
      });
    }
  },

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.me();
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        isInitialized: true
      });
    } catch (error: any) {
      console.log(error)
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true, // Important
        error: null
      });
    }
  },

  clearError: () => set({ error: null }),
}));