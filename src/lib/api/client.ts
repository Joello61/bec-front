import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/lib/store'; // 1. Importer le store Auth
import { ROUTES } from '@/lib/utils/constants'; // Pour la redirection
import { logger } from '@/lib/utils/logger';
import type { ApiError } from '@/types'; // Garder si utilisé

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api', // Assurez-vous que /api est inclus si nécessaire
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // Ajouter Accept
  },
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // /login et /register peuvent legitimement renvoyer 401/400 sur des identifiants
    // invalides, sans qu'aucune session n'ait jamais existe - tenter un refresh dans ce
    // cas est a la fois inutile (aucun refresh token a rafraichir) et trompeur pour
    // l'utilisateur (rechargement complet de la page au lieu du message d'erreur du
    // formulaire). Cf. plan-correction-cobage.md, Phase 13/Lot F1.
    const isAuthEndpoint = originalRequest?.url === '/login' || originalRequest?.url === '/register';

    if (error.response?.status === 401 && originalRequest && !isAuthEndpoint && originalRequest.url !== '/token/refresh' && !originalRequest._retry) {

      // Si un refresh est déjà en cours, mettre la requête en attente
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      // Marquer comme tentative de retry et démarrer le refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        logger.log('[API Interceptor] Token JWT expiré. Tentative de rafraîchissement...');
        await apiClient.post('/token/refresh');

        logger.log('[API Interceptor] Token rafraîchi avec succès. Reprise des requêtes...');
        processQueue(null); // Libérer les requêtes en attente (sans erreur)
        return apiClient(originalRequest); // Réessayer la requête originale avec le nouveau cookie bagage_token

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (refreshError: any) {
        logger.error('[API Interceptor] Échec du rafraîchissement du token:', refreshError);
        processQueue(refreshError);

        useAuthStore.getState().logout();

        if (typeof window !== 'undefined') {
          window.location.replace(ROUTES.LOGIN);
        }

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      const apiError: ApiError = {
        success: false,
        message: error.response.data?.message || 'Une erreur est survenue',
        statusCode: error.response.status,
        errors: error.response.data?.errors,
        debug: error.response.data?.debug,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      return Promise.reject({
        success: false,
        message: 'Impossible de contacter le serveur',
        statusCode: 0,
      });
    } else {
      return Promise.reject({
        success: false,
        message: error.message || 'Erreur inconnue',
        statusCode: 0,
      });
    }
  }
);

export default apiClient;