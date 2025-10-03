import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour les cookies
});

// Intercepteur de réponse pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.data) {
      // Erreur API structurée
      return Promise.reject(error.response.data);
    }
    
    // Erreur réseau ou autre
    return Promise.reject({
      error: true,
      message: error.message || 'Une erreur est survenue',
      statusCode: error.response?.status || 500,
    } as ApiError);
  }
);

export default apiClient;