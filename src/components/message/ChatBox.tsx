'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/ui';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import type { Message, User } from '@/types';

interface ChatBoxProps {
  messages: Message[];
  recipient: User;
  currentUserId: number;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export default function ChatBox({
  messages,
  recipient,
  currentUserId,
  onSendMessage,
  onBack,
  isLoading = false,
}: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
        {onBack && (
          <button
            onClick={onBack}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <Avatar
          src={recipient.photo || undefined}
          fallback={`${recipient.nom} ${recipient.prenom}`}
          size="md"
          verified={recipient.emailVerifie}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">
            {recipient.prenom} {recipient.nom}
          </p>
          {recipient.bio && (
            <p className="text-sm text-gray-600 truncate">{recipient.bio}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-600">
              Commencez la conversation en envoyant un message
            </p>
          </motion.div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.expediteur.id === currentUserId;
              const prevMessage = messages[index - 1];
              const showAvatar =
                !prevMessage || prevMessage.expediteur.id !== message.expediteur.id;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
}