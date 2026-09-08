import { create } from 'zustand';
import { conversationsApi } from '@/lib/api/conversations';
import { messagesApi } from '@/lib/api/messages';
import { createAsyncAction } from './createAsyncAction';
import type { ApiError, Conversation, ConversationDetail, SendMessageInput } from '@/types';

interface ConversationState {
  conversations: Conversation[];
  currentConversation: ConversationDetail | null;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchConversations: () => Promise<void>;
  fetchConversation: (conversationId: number) => Promise<void>;
  getOrCreateConversationWithUser: (userId: number) => Promise<ConversationDetail>;
  sendMessage: (data: SendMessageInput) => Promise<void>;
  markAsRead: (conversationId: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  deleteConversation: (conversationId: number) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchConversations: () =>
    createAsyncAction(set, async () => {
      const conversations = await conversationsApi.list();
      set({ conversations, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des conversations' }),

  fetchConversation: (conversationId) =>
    createAsyncAction(set, async () => {
      const conversation = await conversationsApi.show(conversationId);
      set({ currentConversation: conversation, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement de la conversation' }),

  getOrCreateConversationWithUser: (userId) =>
    createAsyncAction(set, async () => {
      const conversation = await conversationsApi.withUser(userId);
      set({ currentConversation: conversation, isLoading: false });
      return conversation;
    }, { fallbackError: 'Erreur lors de la récupération de la conversation', rethrow: true }),

  sendMessage: (data) =>
    createAsyncAction(set, async () => {
      const message = await messagesApi.send(data);

      set((state) => {
        if (!state.currentConversation) return state;
        return {
          currentConversation: {
            ...state.currentConversation,
            messages: [...state.currentConversation.messages, message]
          },
          isLoading: false
        };
      });

      // Rafraichissement fire-and-forget, comme dans le code d'origine
      get().fetchConversations();
    }, { fallbackError: "Erreur lors de l'envoi du message", rethrow: true }),

  // Ne pilote pas isLoading (comportement d'origine) - hors du helper.
  markAsRead: async (conversationId) => {
    try {
      await conversationsApi.markAsRead(conversationId);

      set((state) => {
        if (!state.currentConversation || state.currentConversation.id !== conversationId) {
          return state;
        }
        return {
          currentConversation: {
            ...state.currentConversation,
            messages: state.currentConversation.messages.map((msg) => ({
              ...msg,
              lu: true
            }))
          }
        };
      });

      await get().fetchUnreadCount();
      await get().fetchConversations();
    } catch (error) {
      set({ error: (error as ApiError).message });
    }
  },

  // Compteur silencieux : ne pilote pas isLoading/error, comme authStore.checkProfileStatus.
  fetchUnreadCount: async () => {
    try {
      const unreadCount = await conversationsApi.getUnreadCount();
      set({ unreadCount });
    } catch (error) {
      console.log('Erreur compteur messages non lus:', error);
    }
  },

  deleteConversation: (conversationId) =>
    createAsyncAction(set, async () => {
      await conversationsApi.delete(conversationId);
      set((state) => ({
        conversations: state.conversations.filter((conv) => conv.id !== conversationId),
        currentConversation: state.currentConversation?.id === conversationId
          ? null
          : state.currentConversation,
        isLoading: false
      }));
    }, { fallbackError: 'Erreur lors de la suppression de la conversation', rethrow: true }),

  deleteMessage: (messageId) =>
    createAsyncAction(set, async () => {
      await messagesApi.delete(messageId);
      set((state) => {
        if (!state.currentConversation) return { isLoading: false };
        return {
          currentConversation: {
            ...state.currentConversation,
            messages: state.currentConversation.messages.filter((msg) => msg.id !== messageId)
          },
          isLoading: false
        };
      });
    }, { fallbackError: 'Erreur lors de la suppression du message', rethrow: true }),

  clearError: () => set({ error: null }),

  reset: () => set({
    conversations: [],
    currentConversation: null,
    unreadCount: 0,
    error: null
  }),
}));
