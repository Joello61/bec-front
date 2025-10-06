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
  const conversationId = parseInt(params.id as string);

  const { conversation, messages, isLoading, error, sendMessage, refetch } = useConversation(conversationId);
  const { user: currentUser } = useAuth();

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner text="Chargement de la conversation..." />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Erreur de chargement"
          message="Utilisateur non connecté"
          onRetry={refetch}
        />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Erreur de chargement"
          message={error || "Aucune conversation trouvée"}
          onRetry={refetch}
        />
      </div>
    );
  }

  // Déterminer l'autre participant
  const recipient = conversation.participant1.id === currentUser.id
    ? conversation.participant2
    : conversation.participant1;

  return (
    <div className="h-[calc(85vh-4rem)]">
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
        recipient={recipient}
        currentUserId={currentUser.id}
        onSendMessage={(content) => 
          sendMessage({ 
            destinataireId: recipient.id, 
            contenu: content 
          })
        }
        onBack={() => window.history.back()}
      />
    </div>
  );
}