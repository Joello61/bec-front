import PropositionDetailsPageClient from "@/components/clients/dashboard/mes-proposition-details-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Détails de ma proposition',
  description: 'Consultez les détails de votre proposition, gérez les offres reçues et communiquez avec les expéditeurs intéressés.',
  robots: { index: false, follow: false },
};

export default function PropositionDetailsPage() {
  return <PropositionDetailsPageClient />;
}