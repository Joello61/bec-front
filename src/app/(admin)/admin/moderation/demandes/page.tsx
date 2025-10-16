import { Metadata } from "next";
import AdminModerationDemandesPageClient from "../../../../../components/clients/admin/demandes-clients";

export const metadata: Metadata = {
  title: 'Modération des demandes',
  description: 'Modérez les demandes de transport signalées ou suspectes.',
  robots: { 
    index: false, 
    follow: false, 
    noarchive: true,
    nosnippet: true 
  },
};

export default function AdminModerationDemandesPage() {
  return <AdminModerationDemandesPageClient />;
}