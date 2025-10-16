import { Metadata } from "next";
import DemandesPageClient from "../../../../components/clients/dashboard/mes-demandes-client";

export const metadata: Metadata = {
  title: 'Mes demandes de transport',
  description: 'Gérez vos demandes d\'envoi de colis. Consultez les propositions des voyageurs et organisez vos expéditions.',
  robots: { index: false, follow: false },
};

export default function DemandesPage() {
  return <DemandesPageClient/>;
}