'use client';

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui';

interface MessageInputProps {
  onSend: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function MessageInput({ 
  onSend, 
  isLoading = false,
  placeholder = 'Écrivez votre message...' 
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    onSend(trimmedMessage);
    setMessage('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-end gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow max-h-32"
          style={{
            height: 'auto',
            minHeight: '44px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
        <Button
          variant="primary"
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          isLoading={isLoading}
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Appuyez sur Entrée pour envoyer, Shift + Entrée pour un retour à la ligne
      </p>
    </div>
  );
}