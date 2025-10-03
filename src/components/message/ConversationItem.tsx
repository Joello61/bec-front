'use client';

import { motion } from 'framer-motion';
import { Avatar, Badge } from '@/components/ui';
import { formatDateRelative, truncate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Conversation } from '@/types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick: () => void;
}

export default function ConversationItem({ 
  conversation, 
  isActive = false,
  onClick 
}: ConversationItemProps) {
  const isUnread = !conversation.lastMessage.lu && 
    conversation.lastMessage.destinataire.id !== conversation.user.id;

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'w-full p-4 flex items-start gap-3 rounded-lg text-left transition-colors',
        isActive ? 'bg-primary/10' : 'hover:bg-gray-50',
        isUnread && 'bg-primary/5'
      )}
    >
      <Avatar
        src={conversation.user.photo || undefined}
        fallback={`${conversation.user.nom} ${conversation.user.prenom}`}
        size="md"
        verified={conversation.user.emailVerifie}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className={cn(
            'font-medium truncate',
            isUnread ? 'text-gray-900' : 'text-gray-700'
          )}>
            {conversation.user.prenom} {conversation.user.nom}
          </p>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {formatDateRelative(conversation.lastMessage.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <p className={cn(
            'text-sm truncate flex-1',
            isUnread ? 'text-gray-900 font-medium' : 'text-gray-600'
          )}>
            {truncate(conversation.lastMessage.contenu, 50)}
          </p>
          {isUnread && (
            <Badge variant="default" size="sm">
              New
            </Badge>
          )}
        </div>
      </div>
    </motion.button>
  );
}