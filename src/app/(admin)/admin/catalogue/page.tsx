import { Metadata } from "next";

import AdminCataloguePageClient from "../../../../components/clients/admin/catalogue-client";

export const metadata: Metadata = {
  title: 'Catalogue',
  description: 'Gestion du catalogue des plans d\'abonnement et des offres de boost de visibilité.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true
  },
};

export default function AdminCataloguePage() {
  return <AdminCataloguePageClient />;
}
