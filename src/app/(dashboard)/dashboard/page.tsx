import { Metadata } from "next";
import DashboardPageClient from "../../../components/clients/dashboard/dashboard-page-client";

export const metadata: Metadata = {
  title: 'Tableau de bord',
  description: 'Gérez vos voyages, demandes de colis, messages et notifications. Accédez à toutes vos activités Co-Bage en un coup d\'œil.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardPageClient/>;
}