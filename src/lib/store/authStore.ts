import { create } from 'zustand';

import { authApi } from '@/lib/api/auth';
import { usersApi } from '@/lib/api/users';
import { logger } from '@/lib/utils/logger';
import type {
  CompleteProfileInput,
  CompleteProfileResponse,
  LoginInput,
  RegisterInput,
  RegisterResponse,
  User} from '@/types';

import { createAsyncAction } from './createAsyncAction';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  pendingEmail: string | null;

  // Actions principales
  login: (credentials: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<User | null>;

  // Actions de vérification
  verifyEmail: (code: string, email: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
  resendVerification: (type: 'email' | 'phone', email?: string) => Promise<void>;

  // Actions profil
  completeProfile: (data: CompleteProfileInput) => Promise<CompleteProfileResponse>;
  checkProfileStatus: () => Promise<boolean>;

  // Actions de mot de passe
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;

  // Suppression de compte (self-service, RGPD)
  deleteAccount: (currentPassword?: string) => Promise<void>;

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

  login: (credentials) =>
    createAsyncAction<AuthState, void>(set, async () => {
      await authApi.login(credentials);
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
    }, {
      fallbackError: 'Erreur de connexion',
      rethrow: true,
      onError: (error) => {
        if (error.message?.includes('vérifier') || error.message?.includes('verify')) {
          // Normalise vers un message stable independant du texte backend :
          // login-client.tsx/useAuth.ts comparent error.message === 'EMAIL_NOT_VERIFIED'.
          set({
            error: 'EMAIL_NOT_VERIFIED',
            isLoading: false,
            isInitialized: true,
            user: null,
            isAuthenticated: false,
            pendingEmail: credentials.email,
          });
          throw new Error('EMAIL_NOT_VERIFIED');
        }
        return {
          error: error.message || 'Erreur de connexion',
          isLoading: false,
          isInitialized: true,
          user: null,
          isAuthenticated: false,
        };
      },
    }),

  register: (data) =>
    createAsyncAction(set, async () => {
      const response = await authApi.register(data);
      set({ isLoading: false, error: null, pendingEmail: data.email });
      return response;
    }, { fallbackError: "Erreur lors de l'inscription", rethrow: true }),

  logout: () =>
    createAsyncAction(set, async () => {
      await authApi.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
        pendingEmail: null,
      });
    }, {
      fallbackError: 'Erreur lors de la déconnexion',
      onError: (error) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: error.message || 'Erreur lors de la déconnexion',
      }),
    }),

  fetchMe: async () => {
    const user = await createAsyncAction<AuthState, User>(set, async () => {
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
      return user;
    }, {
      fallbackError: 'Erreur lors de la récupération du profil',
      onError: () => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      }),
    });
    return user ?? null;
  },

  verifyEmail: (code, email) =>
    createAsyncAction(set, async () => {
      await authApi.verifyEmail({ code, email });
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false, pendingEmail: null });
    }, { fallbackError: 'Code invalide ou expiré', rethrow: true }),

  verifyPhone: (code) =>
    createAsyncAction(set, async () => {
      await authApi.verifyPhone({ code });
      await get().fetchMe();
      set({ isLoading: false });
    }, { fallbackError: 'Code invalide ou expiré', rethrow: true }),

  resendVerification: (type, email) =>
    createAsyncAction(set, async () => {
      await authApi.resendVerification({
        type,
        email: type === 'email' ? (email || get().pendingEmail || '') : undefined,
      });
      set({ isLoading: false });
    }, { fallbackError: 'Erreur lors du renvoi du code', rethrow: true }),

  completeProfile: (data) =>
    createAsyncAction(set, async () => {
      const response = await authApi.completeProfile(data);
      await get().fetchMe();
      set({ isLoading: false });
      return response;
    }, { fallbackError: 'Erreur lors de la complétion du profil', rethrow: true }),

  // Verification silencieuse (pas de spinner global) : ne passe pas par createAsyncAction,
  // qui piloterait isLoading/error sans que cette action l'ait jamais fait auparavant.
  checkProfileStatus: async () => {
    try {
      const status = await authApi.getProfileStatus();
      return status.isComplete;
    } catch (error) {
      logger.error('Erreur vérification profil:', error);
      return false;
    }
  },

  changePassword: (currentPassword, newPassword) =>
    createAsyncAction(set, async () => {
      await authApi.changePassword({ currentPassword, newPassword });
      set({ isLoading: false });
    }, { fallbackError: 'Erreur lors du changement de mot de passe', rethrow: true }),

  deleteAccount: (currentPassword) =>
    createAsyncAction(set, async () => {
      await usersApi.deleteAccount(currentPassword);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
        pendingEmail: null,
      });
    }, {
      // Echec (mot de passe incorrect, compte admin...) : l'utilisateur reste connecte,
      // contrairement a logout() dont l'echec ne peut de toute facon plus etre annule cote API.
      fallbackError: 'Erreur lors de la suppression du compte',
      rethrow: true,
    }),

  clearError: () => set({ error: null }),

  setPendingEmail: (email: string) => set({ pendingEmail: email }),
}));
