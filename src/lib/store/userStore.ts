/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { usersApi } from '@/lib/api/users';
import type { User, UpdateUserInput, PaginationMeta } from '@/types';

interface UserState {
  users: User[];
  currentUser: User | null;
  pagination: PaginationMeta | null;
  searchResults: User[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
  updateMe: (data: UpdateUserInput) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  currentUser: null,
  pagination: null,
  searchResults: [],
  isLoading: false,
  error: null,

  fetchUsers: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersApi.list(page, limit);
      set({ 
        users: response.data, 
        pagination: response.pagination,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des utilisateurs', 
        isLoading: false 
      });
    }
  },

  fetchUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const user = await usersApi.show(id);
      set({ currentUser: user, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement de l\'utilisateur', 
        isLoading: false 
      });
    }
  },

  updateMe: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const user = await usersApi.updateMe(data);
      set({ currentUser: user, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la mise à jour du profil', 
        isLoading: false 
      });
      throw error;
    }
  },

  searchUsers: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const searchResults = await usersApi.search(query);
      set({ searchResults, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la recherche', 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({ 
    users: [], 
    currentUser: null, 
    pagination: null,
    searchResults: [],
    error: null 
  }),
}));