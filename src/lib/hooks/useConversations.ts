/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useConversationStore } from '@/lib/store/conversationStore';

/**
 * Hook pour gérer la liste des conversations
 */
export function useConversations() {
  const conversations = useConversationStore((state) => state.conversations);
  const isLoading = useConversationStore((state) => state.isLoading);
  const error = useConversationStore((state) => state.error);
  const fetchConversations = useConversationStore((state) => state.fetchConversations);

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    isLoading,
    error,
    refetch: fetchConversations,
  };
}

/**
 * Hook pour une conversation spécifique par son ID
 */
export function useConversation(conversationId?: number) {
  const currentConversation = useConversationStore((state) => state.currentConversation);
  const isLoading = useConversationStore((state) => state.isLoading);
  const error = useConversationStore((state) => state.error);
  const fetchConversation = useConversationStore((state) => state.fetchConversation);
  const sendMessage = useConversationStore((state) => state.sendMessage);
  const markAsRead = useConversationStore((state) => state.markAsRead);

  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId);
      markAsRead(conversationId);
    }
  }, [conversationId]);

  return {
    conversation: currentConversation,
    messages: currentConversation?.messages || [],
    isLoading,
    error,
    sendMessage,
    refetch: () => conversationId && fetchConversation(conversationId),
  };
}

/**
 * Hook pour récupérer ou créer une conversation avec un utilisateur
 */
export function useConversationWithUser(userId?: number) {
  const currentConversation = useConversationStore((state) => state.currentConversation);
  const isLoading = useConversationStore((state) => state.isLoading);
  const error = useConversationStore((state) => state.error);
  const getOrCreateConversationWithUser = useConversationStore((state) => state.getOrCreateConversationWithUser);
  const sendMessage = useConversationStore((state) => state.sendMessage);
  const markAsRead = useConversationStore((state) => state.markAsRead);

  useEffect(() => {
    if (userId) {
      getOrCreateConversationWithUser(userId).then((conversation) => {
        if (conversation) {
          markAsRead(conversation.id);
        }
      });
    }
  }, [userId]);

  return {
    conversation: currentConversation,
    messages: currentConversation?.messages || [],
    isLoading,
    error,
    sendMessage,
    refetch: () => userId && getOrCreateConversationWithUser(userId),
  };
}

/**
 * Hook pour le compteur de messages non lus
 */
export function useUnreadMessages() {
  const unreadCount = useConversationStore((state) => state.unreadCount);
  const fetchUnreadCount = useConversationStore((state) => state.fetchUnreadCount);

  useEffect(() => {
    fetchUnreadCount();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    unreadCount,
    refetch: fetchUnreadCount,
  };
}