/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { authApi } from '@/lib/api/auth';
import type { User, LoginInput, RegisterInput } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions principales
  login: (credentials: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  
  // Actions de vérification
  verifyEmail: (code: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
  resendVerification: (type: 'email' | 'phone') => Promise<void>;
  
  // Actions de mot de passe
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // Utilitaires
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
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
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null
      });
    }
  },

  verifyEmail: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.verifyEmail({ code });
      // Recharger les données utilisateur pour mettre à jour emailVerifie
      await get().fetchMe();
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Code invalide ou expiré', 
        isLoading: false 
      });
      throw error;
    }
  },

  verifyPhone: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.verifyPhone({ code });
      // Recharger les données utilisateur pour mettre à jour telephoneVerifie
      await get().fetchMe();
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Code invalide ou expiré', 
        isLoading: false 
      });
      throw error;
    }
  },

  resendVerification: async (type: 'email' | 'phone') => {
    set({ isLoading: true, error: null });
    try {
      await authApi.resendVerification({ type });
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du renvoi du code', 
        isLoading: false 
      });
      throw error;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du changement de mot de passe', 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));