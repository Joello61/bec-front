'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DemandeDetails } from '@/components/demande';
import { useDemande, useAuth, useConversationWithUser } from '@/lib/hooks';
import { ErrorState, LoadingSpinner, useToast } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';

export default function DemandeDetailsPageClient() {
  const router = useRouter();
  const params = useParams();
  const demandeId = parseInt(params.id as string);
  const toast = useToast();

  const { user } = useAuth();
  const { demande, isLoading, error, refetch } = useDemande(demandeId);
  
  // ✅ CORRECTION : Passer l'ID du CLIENT, pas le vôtre
  const { conversation } = useConversationWithUser(demande?.client.id);

  const isOwner = user?.id === demande?.client.id;

  const handleContact = () => {
    if (conversation) {
      if(user?.isProfileComplete) {
        router.push(ROUTES.CONVERSATION(conversation.id));
      } else {
        toast.error("Veuillez compléter votre profil avant de contacter un demandeur.");
      }
      router.push(ROUTES.CONVERSATION(conversation.id));
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner fullScreen text="Chargement de la demande..." />
      </div>
    );
  }

  if (error || !demande) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Demande introuvable"
          message={error || "Cette demande n'existe pas ou a été supprimée"}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Link
        href={ROUTES.EXPLORE}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à l&apos;exploration
      </Link>

      <DemandeDetails
        demande={demande}
        isOwner={isOwner}
        onContact={handleContact}
      />
    </div>
  );
}