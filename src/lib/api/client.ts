import axios, { AxiosError } from 'axios';
import type { ApiError } from '@/types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  // CRITIQUE : Envoyer les cookies dans toutes les requêtes
  withCredentials: true,
  timeout: 10000,
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Erreur avec réponse du serveur
      const apiError: ApiError = {
        success: false,
        message: error.response.data?.message || 'Une erreur est survenue',
        statusCode: error.response.status,
        errors: error.response.data?.errors,
        debug: error.response.data?.debug,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      // Requête envoyée mais pas de réponse
      return Promise.reject({
        success: false,
        message: 'Impossible de contacter le serveur',
        statusCode: 0,
      });
    } else {
      // Erreur lors de la configuration de la requête
      return Promise.reject({
        success: false,
        message: error.message || 'Erreur inconnue',
        statusCode: 0,
      });
    }
  }
);

export default apiClient;