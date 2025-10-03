/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useMessageStore } from '@/lib/store';

/**
 * Hook pour gérer les conversations
 */
export function useConversations() {
  const conversations = useMessageStore((state) => state.conversations);
  const isLoading = useMessageStore((state) => state.isLoading);
  const error = useMessageStore((state) => state.error);
  const fetchConversations = useMessageStore((state) => state.fetchConversations);

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
 * Hook pour une conversation spécifique
 */
export function useConversation(userId: number) {
  const currentConversation = useMessageStore((state) => state.currentConversation);
  const isLoading = useMessageStore((state) => state.isLoading);
  const error = useMessageStore((state) => state.error);
  const fetchConversation = useMessageStore((state) => state.fetchConversation);
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const markAsRead = useMessageStore((state) => state.markAsRead);

  useEffect(() => {
    if (userId) {
      fetchConversation(userId);
      markAsRead(userId);
    }
  }, [userId]);

  return {
    messages: currentConversation,
    isLoading,
    error,
    sendMessage,
    refetch: () => fetchConversation(userId),
  };
}

/**
 * Hook pour le compteur de messages non lus
 */
export function useUnreadMessages() {
  const unreadCount = useMessageStore((state) => state.unreadCount);
  const fetchUnreadCount = useMessageStore((state) => state.fetchUnreadCount);

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