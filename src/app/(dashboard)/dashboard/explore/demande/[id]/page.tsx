import { Metadata } from "next";

import DemandeDetailsPageClient from "../../../../../../components/clients/dashboard/demande-details-client";

export const metadata: Metadata = {
  title: 'Détails de demande',
  robots: { index: false, follow: false },
};

export default function DemandeDetailsPage() {
  return <DemandeDetailsPageClient/>;
} 