import type { 
  ChangePasswordInput,
  CompleteProfileInput,
  ForgotPasswordInput,
  LoginInput, 
  LoginResponse,
  RegisterInput, 
  RegisterResponse,
  ResendVerificationInput,
  ResetPasswordInput,
  User,
  VerifyEmailInput,
  VerifyPhoneInput,
} from '@/types';
import type { 
  CompleteProfileResponse,
  ProfileStatusResponse,
  VerifyEmailResponse} from '@/types/api';

import apiClient from './client';
import { endpoints } from './endpoints';

export const authApi = {
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(endpoints.auth.login, data);
    return response.data;
  },

  // ==================== REGISTER MODIFIÉ ====================
  // Plus de téléphone dans les données, pas de JWT retourné
  async register(data: RegisterInput): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(endpoints.auth.register, data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(endpoints.auth.logout);

    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    } catch {
      // Purge best-effort : ne doit jamais faire echouer la deconnexion
    }
  },

  async me(): Promise<User> {
    const response = await apiClient.get<User>(endpoints.auth.me);
    return response.data;
  },

  // ==================== VERIFY EMAIL MODIFIÉ ====================
  // Retourne maintenant user + JWT dans cookie
  async verifyEmail(data: VerifyEmailInput): Promise<VerifyEmailResponse> {
    const response = await apiClient.post<VerifyEmailResponse>(
      endpoints.auth.verifyEmail, 
      data
    );
    return response.data;
  },

  async verifyPhone(data: VerifyPhoneInput): Promise<void> {
    await apiClient.post(endpoints.auth.verifyPhone, data);
  },

  // ==================== RESEND VERIFICATION MODIFIÉ ====================
  // Nécessite l'email pour resend email (utilisateur pas encore authentifié)
  async resendVerification(data: ResendVerificationInput): Promise<void> {
    await apiClient.post(endpoints.auth.resendVerification, data);
  },

  async forgotPassword(data: ForgotPasswordInput): Promise<void> {
    await apiClient.post(endpoints.auth.forgotPassword, data);
  },

  async resetPassword(data: ResetPasswordInput): Promise<void> {
    await apiClient.post(endpoints.auth.resetPassword, data);
  },

  async changePassword(data: ChangePasswordInput): Promise<void> {
    await apiClient.post(endpoints.auth.changePassword, data);
  },

  async getGoogleAuthUrl(): Promise<{ authUrl: string; state: string }> {
    const response = await apiClient.get(endpoints.auth.googleAuth);
    return response.data;
  },

  async getFacebookAuthUrl(): Promise<{ authUrl: string; state: string }> {
    const response = await apiClient.get(endpoints.auth.facebookAuth);
    return response.data;
  },

  // ==================== NOUVEAUX ENDPOINTS ====================

  /**
   * Vérifie le statut du profil (complet ou non)
   */
  async getProfileStatus(): Promise<ProfileStatusResponse> {
    const response = await apiClient.get<ProfileStatusResponse>(
      endpoints.users.profileStatus
    );
    return response.data;
  },

  /**
   * Compléter le profil après inscription
   * Envoie un SMS de vérification automatiquement
   */
  async completeProfile(data: CompleteProfileInput): Promise<CompleteProfileResponse> {
    const response = await apiClient.post<CompleteProfileResponse>(
      endpoints.users.completeProfile,
      data
    );
    return response.data;
  },
};