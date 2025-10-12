/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { authApi } from '@/lib/api/auth';
import type { 
  User, 
  LoginInput, 
  RegisterInput,
  CompleteProfileInput 
} from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // ==================== NOUVEAU : EMAIL TEMPORAIRE ====================
  // Pour stocker l'email pendant le flux verify-email (avant auth)
  pendingEmail: string | null;
  
  // Actions principales
  login: (credentials: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  
  // Actions de vérification
  verifyEmail: (code: string, email: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
  resendVerification: (type: 'email' | 'phone', email?: string) => Promise<void>;
  
  // ==================== NOUVEAU : COMPLETE PROFILE ====================
  completeProfile: (data: CompleteProfileInput) => Promise<void>;
  checkProfileStatus: () => Promise<boolean>;
  
  // Actions de mot de passe
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // Utilitaires
  clearError: () => void;
  setPendingEmail: (email: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  error: null,
  pendingEmail: null,

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
      // ==================== GESTION EMAIL NON VÉRIFIÉ ====================
      // Si l'email n'est pas vérifié, le backend retourne une erreur
      if (error.message?.includes('vérifier') || error.message?.includes('verify')) {
        set({ 
          error: 'EMAIL_NOT_VERIFIED',
          isLoading: false,
          isInitialized: true,
          user: null,
          isAuthenticated: false,
          pendingEmail: credentials.email, // Stocker l'email
        });
        throw new Error('EMAIL_NOT_VERIFIED');
      }
      
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

  // ==================== REGISTER MODIFIÉ ====================
  // Stocker l'email pour la page de vérification
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.register(data);
      set({ 
        isLoading: false,
        error: null,
        pendingEmail: data.email, // ⬅️ Stocker l'email
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
        error: null,
        pendingEmail: null,
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

  // ==================== VERIFY EMAIL MODIFIÉ ====================
  // Authentifie automatiquement l'utilisateur après vérification
  verifyEmail: async (code: string, email: string) => {
    set({ isLoading: true, error: null });
    try {
      // Vérifier l'email (backend retourne JWT dans cookie)
      const response = await authApi.verifyEmail({ code, email });
      
      // Récupérer les données utilisateur complètes
      const user = await authApi.me();
      
      set({ 
        user,
        isAuthenticated: true,
        isLoading: false,
        pendingEmail: null, // Nettoyer l'email temporaire
      });
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

  // ==================== RESEND VERIFICATION MODIFIÉ ====================
  // Accepte l'email pour les utilisateurs non authentifiés
  resendVerification: async (type: 'email' | 'phone', email?: string) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.resendVerification({ 
        type,
        email: type === 'email' ? (email || get().pendingEmail || '') : undefined
      });
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du renvoi du code', 
        isLoading: false 
      });
      throw error;
    }
  },

  // ==================== NOUVEAU : COMPLETE PROFILE ====================
  completeProfile: async (data: CompleteProfileInput) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.completeProfile(data);
      // Recharger les données utilisateur
      await get().fetchMe();
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la complétion du profil', 
        isLoading: false 
      });
      throw error;
    }
  },

  // ==================== NOUVEAU : CHECK PROFILE STATUS ====================
  checkProfileStatus: async () => {
    try {
      const status = await authApi.getProfileStatus();
      return status.isComplete;
    } catch (error: any) {
      console.error('Erreur vérification profil:', error);
      return false;
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
  
  setPendingEmail: (email: string) => set({ pendingEmail: email }),
}));