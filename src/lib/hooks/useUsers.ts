/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useUserStore } from '@/lib/store';

/**
 * Hook pour charger un utilisateur spécifique
 */
export function useUser(id: number) {
  const currentUser = useUserStore((state) => state.currentUser);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  return {
    user: currentUser,
    isLoading,
    error,
    refetch: () => fetchUser(id),
  };
}

/**
 * Hook pour rechercher des utilisateurs
 */
export function useSearchUsers(query: string) {
  const searchResults = useUserStore((state) => state.searchResults);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);
  const searchUsers = useUserStore((state) => state.searchUsers);

  useEffect(() => {
    if (query && query.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchUsers(query);
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    }
  }, [query]);

  return {
    users: searchResults,
    isLoading,
    error,
  };
}

/**
 * Hook pour mettre à jour le profil utilisateur
 */
export function useUpdateProfile() {
  const updateMe = useUserStore((state) => state.updateMe);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);
  const clearError = useUserStore((state) => state.clearError);

  return {
    updateMe,
    isLoading,
    error,
    clearError,
  };
}