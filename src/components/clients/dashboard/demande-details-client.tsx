'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { DemandeDetails } from '@/components/demande';
import { VoyageCard } from '@/components/voyage';
import { useDemande, useAuth, useMatchingVoyages, useConversationWithUser } from '@/lib/hooks';
import { ErrorState, LoadingSpinner, EmptyState, useToast } from '@/components/common';
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
  
  const { 
    voyages: matchingVoyages, 
    isLoading: isLoadingMatching 
  } = useMatchingVoyages(demandeId);

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

      {/* Voyages correspondants (seulement pour les non-propriétaires) */}
      {!isOwner && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-bold text-gray-900">
              Voyages correspondants
            </h2>
          </div>

          {isLoadingMatching ? (
            <LoadingSpinner text="Recherche de voyages..." />
          ) : matchingVoyages.length === 0 ? (
            <EmptyState
              title="Aucun voyage correspondant"
              description="Aucun voyage ne correspond à cette demande pour le moment"
            />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                {matchingVoyages.length} {matchingVoyages.length > 1 ? 'voyages trouvés' : 'voyage trouvé'}
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {matchingVoyages.map((item) => (
                  <div key={item.voyage.id} className="relative">
                    <div className="absolute top-4 right-4 z-10 bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {item.score}% match
                    </div>
                    
                    <VoyageCard voyage={item.voyage} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}