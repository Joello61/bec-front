import { Metadata } from "next";

import VoyageDetailsPageClient from "../../../../../../components/clients/dashboard/voyage-details-client";

export const metadata: Metadata = {
  title: 'Détails de voyage',
  robots: { index: false, follow: false },
};

export default function VoyageDetailsPage() {
  return <VoyageDetailsPageClient/>;
}