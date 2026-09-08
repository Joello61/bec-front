import { create } from 'zustand';
import { contactsApi } from '@/lib/api/contacts';
import { createAsyncAction } from './createAsyncAction';
import type { Contact, CreateContactInput } from '@/types';

interface ContactState {
  contacts: Contact[];
  currentContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Actions
  createContact: (data: CreateContactInput) => Promise<void>;
  fetchContacts: () => Promise<void>;
  fetchContact: (id: number) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  reset: () => void;
}

export const useContactStore = create<ContactState>((set) => ({
  contacts: [],
  currentContact: null,
  isLoading: false,
  error: null,
  successMessage: null,

  createContact: (data) => {
    set({ successMessage: null });
    return createAsyncAction(set, async () => {
      const response = await contactsApi.create(data);
      set({ successMessage: response.message, isLoading: false });
    }, { fallbackError: "Erreur lors de l'envoi du message", rethrow: true });
  },

  fetchContacts: () =>
    createAsyncAction(set, async () => {
      const contacts = await contactsApi.list();
      set({ contacts, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des contacts' }),

  fetchContact: (id) =>
    createAsyncAction(set, async () => {
      const contact = await contactsApi.show(id);
      set({ currentContact: contact, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement du contact' }),

  deleteContact: (id) =>
    createAsyncAction(set, async () => {
      await contactsApi.delete(id);
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
        currentContact: state.currentContact?.id === id ? null : state.currentContact,
        isLoading: false
      }));
    }, { fallbackError: 'Erreur lors de la suppression du contact', rethrow: true }),

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: null }),

  reset: () => set({
    contacts: [],
    currentContact: null,
    error: null,
    successMessage: null
  }),
}));
