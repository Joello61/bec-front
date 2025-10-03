'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ChatBox } from '@/components/message';
import { useAuth, useConversation } from '@/lib/hooks';
import { ErrorState, LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';

export default function ConversationPage() {
  const params = useParams();
  const userId = parseInt(params.id as string);

  const { messages, isLoading, error, sendMessage, refetch } = useConversation(userId);

  const { user: currentUser } = useAuth();

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner text="Chargement de la conversation..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Erreur de chargement"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      {/* Back Button */}
      <div className="border-b border-gray-200 px-4 py-3">
        <Link
          href={ROUTES.MESSAGES}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux messages
        </Link>
      </div>

      {/* Chat */}
      <ChatBox
        messages={messages}
        recipient={userId}
        currentUser={currentUser}
        onSendMessage={(content) => sendMessage({ destinataireId: userId, contenu: content })}
        onBack={() => window.history.back()}
      />
    </div>
  );
}