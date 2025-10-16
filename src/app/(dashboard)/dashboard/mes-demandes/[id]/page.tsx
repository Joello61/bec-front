import { Metadata } from "next";
import DemandeDetailsPageClient from "../../../../../components/clients/dashboard/mes-demande-details-client";

export const metadata: Metadata = {
  title: 'Détails de ma demande',
  description: 'Consultez les détails de votre demande de transport et les propositions des voyageurs disponibles.',
  robots: { index: false, follow: false },
};

export default function DemandeDetailsPage() {
  return <DemandeDetailsPageClient/>;
} 