'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { VoyageDetails } from '@/components/voyage';
import { useVoyage } from '@/lib/hooks';
import { ErrorState, LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';

export default function VoyageDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const voyageId = parseInt(params.id as string);

  const { voyage, isLoading, error, refetch } = useVoyage(voyageId);


  const handleContact = () => {
    if (voyage) {
      router.push(ROUTES.CONVERSATION(voyage.voyageur.id));
    }
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
        href={ROUTES.SEARCH_VOYAGES}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux voyages
      </Link>

      {/* Content */}
      <VoyageDetails
        voyage={voyage}
        onContact={handleContact}
      />
    </div>
  );
}