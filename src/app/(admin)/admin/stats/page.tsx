import AdminStatsPageClient from "../../../../components/clients/admin/stats-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Statistiques',
  description: 'Statistiques détaillées de la plateforme : utilisateurs, voyages, demandes et transactions.',
  robots: { 
    index: false, 
    follow: false, 
    noarchive: true,
    nosnippet: true 
  },
};

export default function AdminStatsPage() {
  return <AdminStatsPageClient />;
}