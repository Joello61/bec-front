import { Metadata } from "next";
import RechercherPageClient from "../../../../components/clients/dashboard/explore-client";

export const metadata: Metadata = {
  title: 'Explorer les voyages et demandes',
  description: 'Trouvez des voyageurs ou des demandes de transport correspondant à vos besoins. Filtrez par destination, date et prix.',
  robots: { index: false, follow: false },
};

export default function RechercherPage() {
  return <RechercherPageClient/>;
}