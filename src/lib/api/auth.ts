import apiClient from './client';
import { endpoints } from './endpoints';
import type { 
  LoginInput, 
  RegisterInput, 
  User,
  LoginResponse,
  RegisterResponse,
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
};