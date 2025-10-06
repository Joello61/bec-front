'use client';

import { ConversationList } from '@/components/message';
import { useAuth, useConversations } from '@/lib/hooks';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/utils/constants';

export default function MessagesPage() {
  const router = useRouter();
  const { conversations, isLoading, error, refetch } = useConversations();

  const { user: currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Erreur de chargement"
          message="Impossible de trouver l'utilisateur courant"
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner text="Chargement des conversations..." />
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
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      {conversations.length === 0 ? (
        <EmptyState
          title="Aucune conversation"
          description="Vous n'avez pas encore de messages. Contactez un voyageur ou un expéditeur pour commencer une conversation."
        />
      ) : (
        <ConversationList
          conversations={conversations}
          currentUserId={currentUser.id}
          onConversationClick={(conversationId) =>
            router.push(ROUTES.CONVERSATION(conversationId))
          }
        />
      )}
    </div>
  );
}