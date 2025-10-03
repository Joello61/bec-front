/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { messagesApi } from '@/lib/api/messages';
import type { Message, SendMessageInput, Conversation } from '@/types';

interface MessageState {
  conversations: Conversation[];
  currentConversation: Message[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchConversation: (userId: number) => Promise<void>;
  sendMessage: (data: SendMessageInput) => Promise<void>;
  markAsRead: (userId: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  conversations: [],
  currentConversation: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const conversations = await messagesApi.getConversations();
      set({ conversations, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des conversations', 
        isLoading: false 
      });
    }
  },

  fetchConversation: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const messages = await messagesApi.getConversation(userId);
      set({ currentConversation: messages, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement de la conversation', 
        isLoading: false 
      });
    }
  },

  sendMessage: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const message = await messagesApi.send(data);
      set((state) => ({
        currentConversation: [...state.currentConversation, message],
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de l\'envoi du message', 
        isLoading: false 
      });
      throw error;
    }
  },

  markAsRead: async (userId) => {
    try {
      await messagesApi.markAsRead(userId);
      set((state) => ({
        currentConversation: state.currentConversation.map((msg) => ({
          ...msg,
          lu: msg.destinataire.id === userId ? true : msg.lu
        }))
      }));
      // Rafraîchir le compteur
      const unreadCount = await messagesApi.getUnreadCount();
      set({ unreadCount });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const unreadCount = await messagesApi.getUnreadCount();
      set({ unreadCount });
    } catch (error: any) {
      console.error('Erreur compteur messages non lus:', error);
    }
  },

  deleteMessage: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await messagesApi.delete(id);
      set((state) => ({
        currentConversation: state.currentConversation.filter((msg) => msg.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la suppression du message', 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({ 
    conversations: [], 
    currentConversation: [], 
    unreadCount: 0,
    error: null 
  }),
}));