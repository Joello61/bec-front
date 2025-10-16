import { Metadata } from "next";
import VoyagesPageClient from "../../../../components/clients/dashboard/mes-voyages-client";

export const metadata: Metadata = {
  title: 'Mes voyages',
  description: 'Gérez tous vos voyages publiés sur Co-Bage. Consultez les propositions, communiquez avec les expéditeurs et suivez vos transports.',
  robots: { index: false, follow: false },
};

export default function VoyagesPage() {
  return <VoyagesPageClient/>;
}