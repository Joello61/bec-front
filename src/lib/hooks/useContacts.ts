import { useCallback, useEffect } from 'react';
import { useContactStore } from '@/lib/store/contactStore';
import { useAuth } from './useAuth';

/**
 * Hook pour créer un contact (formulaire public)
 */
export function useCreateContact() {
  const createContact = useContactStore((state) => state.createContact);
  const isLoading = useContactStore((state) => state.isLoading);
  const error = useContactStore((state) => state.error);
  const successMessage = useContactStore((state) => state.successMessage);
  const clearError = useContactStore((state) => state.clearError);
  const clearSuccess = useContactStore((state) => state.clearSuccess);

  return {
    createContact,
    isLoading,
    error,
    successMessage,
    clearError,
    clearSuccess,
  };
}

/**
 * Hook pour charger et gérer tous les contacts (ADMIN)
 */
export function useContacts() {
  const contacts = useContactStore((state) => state.contacts);
  const isLoading = useContactStore((state) => state.isLoading);
  const error = useContactStore((state) => state.error);
  const fetchContacts = useContactStore((state) => state.fetchContacts);

  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  useEffect(() => {
    if (isAdmin) {
      fetchContacts();
    }
  }, [isAdmin,fetchContacts]);

  const refetch = useCallback(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook pour un contact spécifique (ADMIN)
 */
export function useContact(id: number) {
  const currentContact = useContactStore((state) => state.currentContact);
  const isLoading = useContactStore((state) => state.isLoading);
  const error = useContactStore((state) => state.error);
  const fetchContact = useContactStore((state) => state.fetchContact);

  useEffect(() => {
    if (id) {
      fetchContact(id);
    }
  }, [id, fetchContact]);

  const refetch = useCallback(() => {
    fetchContact(id);
  }, [id, fetchContact]);

  return {
    contact: currentContact,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook pour les actions ADMIN sur les contacts
 */
export function useContactActions() {
  const deleteContact = useContactStore((state) => state.deleteContact);
  const isLoading = useContactStore((state) => state.isLoading);
  const error = useContactStore((state) => state.error);
  const clearError = useContactStore((state) => state.clearError);

  return {
    deleteContact,
    isLoading,
    error,
    clearError,
  };
}