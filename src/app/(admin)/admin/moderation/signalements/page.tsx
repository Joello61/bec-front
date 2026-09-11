import { Metadata } from "next";

import AdminModerationSignalementsPageClient from "../../../../../components/clients/admin/signalements-client";

export const metadata: Metadata = {
  title: 'Modération des signalements',
  description: 'Traitez les signalements de voyages, demandes, messages et utilisateurs.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true
  },
};

export default function AdminModerationSignalementsPage() {
  return <AdminModerationSignalementsPageClient />;
}
