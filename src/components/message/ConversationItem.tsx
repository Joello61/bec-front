'use client';

import { motion } from 'framer-motion';
import { Avatar, Badge } from '@/components/ui';
import { formatDateRelative, truncate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Conversation, User } from '@/types';

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: number;
  isActive?: boolean;
  onClick: () => void;
}

export default function ConversationItem({ 
  conversation,
  currentUserId,
  isActive = false,
  onClick 
}: ConversationItemProps) {
  // Déterminer l'autre participant
  const otherUser: User = conversation.participant1.id === currentUserId 
    ? conversation.participant2 
    : conversation.participant1;

  const hasUnread = conversation.messagesNonLus > 0;
  const lastMessage = conversation.dernierMessage;

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'w-full p-5 flex items-start gap-3 text-left border-2 border-primary shadow-xl rounded-3xl transition-colors',
        isActive ? 'bg-primary/10' : 'hover:bg-gray-50',
        hasUnread && 'bg-primary/5'
      )}
    >
      <Avatar
        src={otherUser.photo || undefined}
        fallback={`${otherUser.nom} ${otherUser.prenom}`}
        size="md"
        verified={otherUser.emailVerifie}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className={cn(
            'font-medium truncate',
            hasUnread ? 'text-gray-900' : 'text-gray-700'
          )}>
            {otherUser.prenom} {otherUser.nom}
          </p>
          {lastMessage && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatDateRelative(lastMessage.createdAt)}
            </span>
          )}
        </div>

        {lastMessage ? (
          <div className="flex items-center gap-2">
            <p className={cn(
              'text-sm truncate flex-1',
              hasUnread ? 'text-gray-900 font-medium' : 'text-gray-600'
            )}>
              {truncate(lastMessage.contenu, 50)}
            </p>
            {hasUnread && (
              <Badge variant="default" size="sm">
                {conversation.messagesNonLus}
              </Badge>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Aucun message
          </p>
        )}
      </div>
    </motion.button>
  );
}