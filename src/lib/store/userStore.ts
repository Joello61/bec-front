import { create } from 'zustand';
import { usersApi } from '@/lib/api/users';
import { createAsyncAction } from './createAsyncAction';
import type { User, UpdateUserInput, PaginationMeta } from '@/types';

interface UserState {
  users: User[];
  currentUser: User | null;
  pagination: PaginationMeta | null;
  searchResults: User[];
  isLoading: boolean;
  error: string | null;
  isUploadingAvatar: boolean;

  // Actions
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
  updateMe: (data: UpdateUserInput) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
  deleteAvatar: () => Promise<void>;

  clearError: () => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUser: null,
  pagination: null,
  searchResults: [],
  isLoading: false,
  error: null,
  isUploadingAvatar: false,

  fetchUsers: (page = 1, limit = 10) =>
    createAsyncAction(set, async () => {
      const response = await usersApi.list(page, limit);
      set({ users: response.data, pagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des utilisateurs' }),

  fetchUser: (id) =>
    createAsyncAction(set, async () => {
      const user = await usersApi.show(id);
      set({ currentUser: user, isLoading: false });
    }, { fallbackError: "Erreur lors du chargement de l'utilisateur" }),

  updateMe: (data) =>
    createAsyncAction(set, async () => {
      const user = await usersApi.updateMe(data);
      set({ currentUser: user, isLoading: false });
    }, { fallbackError: 'Erreur lors de la mise à jour du profil', rethrow: true }),

  searchUsers: (query) =>
    createAsyncAction(set, async () => {
      const searchResults = await usersApi.search(query);
      set({ searchResults, isLoading: false });
    }, { fallbackError: 'Erreur lors de la recherche' }),

  uploadAvatar: (file) =>
    createAsyncAction<UserState, string | null>(set, async () => {
      const response = await usersApi.uploadAvatar(file);
      const currentUser = get().currentUser;
      if (currentUser) {
        set({ currentUser: { ...currentUser, photo: response.photoUrl }, isUploadingAvatar: false });
      } else {
        set({ isUploadingAvatar: false });
      }
      return response.photoUrl;
    }, {
      fallbackError: "Erreur lors de l'upload de l'avatar",
      loadingKey: 'isUploadingAvatar',
      // rethrow:true fixe le type de retour a Promise<string|null> (jamais undefined) ;
      // onError lance lui-meme une Error normalisee avant d'y arriver, comme pour login().
      rethrow: true,
      onError: (error) => {
        const message = error.message || "Erreur lors de l'upload de l'avatar";
        set({ error: message, isUploadingAvatar: false });
        throw new Error(message);
      },
    }),

  deleteAvatar: () =>
    createAsyncAction(set, async () => {
      await usersApi.deleteAvatar();
      const currentUser = get().currentUser;
      if (currentUser) {
        set({ currentUser: { ...currentUser, photo: null }, isUploadingAvatar: false });
      } else {
        set({ isUploadingAvatar: false });
      }
    }, {
      fallbackError: "Erreur lors de la suppression de l'avatar",
      loadingKey: 'isUploadingAvatar',
      rethrow: true,
      onError: (error) => {
        const message = error.message || "Erreur lors de la suppression de l'avatar";
        set({ error: message, isUploadingAvatar: false });
        throw new Error(message);
      },
    }),

  clearError: () => set({ error: null }),

  reset: () => set({
    users: [],
    currentUser: null,
    pagination: null,
    searchResults: [],
    error: null,
    isUploadingAvatar: false,
  }),
}));
