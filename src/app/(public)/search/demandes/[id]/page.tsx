'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DemandeDetails } from '@/components/demande';
import { useDemande } from '@/lib/hooks';
import { ErrorState, LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';

export default function DemandeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const demandeId = parseInt(params.id as string);

  const { demande, isLoading, error, refetch } = useDemande(demandeId);

  const handleContact = () => {
    if (demande) {
      router.push(ROUTES.CONVERSATION(demande.client.id));
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
      {/* Back Button */}
      <Link
        href={ROUTES.SEARCH_DEMANDES}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux demandes
      </Link>

      {/* Content */}
      <DemandeDetails
        demande={demande}
        onContact={handleContact}
      />
    </div>
  );
}