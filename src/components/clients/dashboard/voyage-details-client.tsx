'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { VoyageDetails } from '@/components/voyage';
import { PropositionModal } from '@/components/propositions';
import { Button } from '@/components/ui';
import { useVoyage, useAuth, usePropositionActions, useUserDemandes, useConversationWithUser } from '@/lib/hooks';
import { ErrorState, LoadingSpinner, useToast } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import type { CreatePropositionInput } from '@/types';

export default function VoyageDetailsPageClient() {
  const router = useRouter();
  const params = useParams();
  const voyageId = parseInt(params.id as string);

  const { user } = useAuth();
  const { voyage, isLoading, error, refetch } = useVoyage(voyageId);
  const { mesDemandes: userDemandes } = useUserDemandes(user?.id);
  const { createProposition } = usePropositionActions();
  const toast = useToast();

  // ✅ Conversation avec le voyageur
  const { conversation } = useConversationWithUser(voyage?.voyageur.id);

  const [isPropositionModalOpen, setIsPropositionModalOpen] = useState(false);

  const isOwner = user?.id === voyage?.voyageur.id;
  const canPropose = !isOwner && voyage?.statut === 'actif';

  // ✅ FILTRAGE INTELLIGENT : Demandes qui correspondent au voyage
  const relevantDemandes = useMemo(() => {
    if (!voyage || !userDemandes.length) return [];

    return userDemandes
      .filter(d => 
        // Statut actif
        d.statut === 'en_recherche' &&
        // Même ville de départ
        d.villeDepart.trim().toLowerCase() === voyage.villeDepart.trim().toLowerCase() &&
        // Même ville d'arrivée
        d.villeArrivee.trim().toLowerCase() === voyage.villeArrivee.trim().toLowerCase()
      )
      .map(d => ({
        id: d.id,
        villeDepart: d.villeDepart,
        villeArrivee: d.villeArrivee,
        dateLimite: d.dateLimite,
        prixParKilo: Number(d.converted?.prixParKilo ?? d.prixParKilo ?? 0),
        commission: Number(d.converted?.commission ?? d.commissionProposeePourUnBagage ?? 0)
      }));
  }, [voyage, userDemandes]);

  const handleContact = () => {
    if (conversation) {
      if(user?.isProfileComplete) {
        router.push(ROUTES.CONVERSATION(conversation.id));
      } else {
        toast.error("Veuillez compléter votre profil avant de contacter un voyageur.");
      }
    }
  };

  const handleCreateProposition = async (data: CreatePropositionInput) => {
    if (!voyage) return;
    
    await createProposition(voyage.id, data);
    setIsPropositionModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner fullScreen text="Chargement du voyage..." />
      </div>
    );
  }

  if (error || !voyage) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Voyage introuvable"
          message={error || "Ce voyage n'existe pas ou a été supprimé"}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <Link
        href={ROUTES.EXPLORE}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à l&apos;exploration
      </Link>

      {/* Content */}
      <VoyageDetails
        voyage={voyage}
        isOwner={isOwner}
        onContact={handleContact}
      />

      {/* Action: Faire une proposition */}
      {canPropose && (
        <div className="mt-8 card bg-primary/5 border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Intéressé par ce voyage ?
              </h3>
              <p className="text-sm text-gray-600">
                {relevantDemandes.length > 0 
                  ? `Vous avez ${relevantDemandes.length} demande${relevantDemandes.length > 1 ? 's' : ''} correspondante${relevantDemandes.length > 1 ? 's' : ''} pour ce trajet`
                  : 'Créez d\'abord une demande pour ce trajet pour faire une proposition'
                }
              </p>
            </div>
            <Button
              variant="primary"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={() => setIsPropositionModalOpen(true)}
            >
              Faire une proposition
            </Button>
          </div>
        </div>
      )}

      {/* Modal Proposition */}
      {voyage && (
        <PropositionModal
          isOpen={isPropositionModalOpen}
          onClose={() => setIsPropositionModalOpen(false)}
          voyage={voyage}
          userDemandes={relevantDemandes}
          onSubmit={handleCreateProposition}
        />
      )}
    </div>
  );
}