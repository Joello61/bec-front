'use client';

import { motion } from 'framer-motion';
import ConversationItem from './ConversationItem';
import type { Conversation } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: number;
  activeConversationId?: number;
  onConversationClick: (conversationId: number) => void;
  isLoading?: boolean;
}

export default function ConversationList({
  conversations,
  currentUserId,
  activeConversationId,
  onConversationClick,
  isLoading = false,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 px-4"
      >
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1">
          Aucune conversation
        </h3>
        <p className="text-sm text-gray-600 text-center">
          Commencez à échanger avec des voyageurs ou des clients
        </p>
      </motion.div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          currentUserId={currentUserId}
          isActive={activeConversationId === conversation.id}
          onClick={() => onConversationClick(conversation.id)}
        />
      ))}
    </div>
  );
}