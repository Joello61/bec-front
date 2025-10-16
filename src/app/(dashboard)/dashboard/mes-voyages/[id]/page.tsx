import { Metadata } from "next";
import VoyageDetailsPageClient from "../../../../../components/clients/dashboard/mes-voyage-details-client";

export const metadata: Metadata = {
  title: 'Détails de mon voyage',
  description: 'Consultez les détails de votre voyage, gérez les propositions reçues et communiquez avec les expéditeurs intéressés.',
  robots: { index: false, follow: false },
};

export default function VoyageDetailsPage() {
  return <VoyageDetailsPageClient/>;
}