import apiClient from './client';
import { endpoints } from './endpoints';
import type { 
  LoginInput, 
  RegisterInput, 
  User,
  LoginResponse,
  RegisterResponse,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  VerifyPhoneInput,
  ResendVerificationInput,
} from '@/types';

export const authApi = {
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(endpoints.auth.login, data);
    return response.data;
  },

  async register(data: RegisterInput): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(endpoints.auth.register, data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(endpoints.auth.logout);
  },

  async me(): Promise<User> {
    const response = await apiClient.get<User>(endpoints.auth.me);
    return response.data;
  },

  async verifyEmail(data: VerifyEmailInput): Promise<void> {
    await apiClient.post(endpoints.auth.verifyEmail, data);
  },

  async verifyPhone(data: VerifyPhoneInput): Promise<void> {
    await apiClient.post(endpoints.auth.verifyPhone, data);
  },

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
};