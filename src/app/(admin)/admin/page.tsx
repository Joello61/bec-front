import { Metadata } from "next";

import AdminDashboardPageClient from "../../../components/clients/admin/dashboard-client";

export const metadata: Metadata = {
  title: 'Administration',
  description: 'Panneau d\'administration Co-Bage. Vue d\'ensemble des statistiques et actions rapides.',
  robots: { 
    index: false, 
    follow: false, 
    noarchive: true,
    nosnippet: true 
  },
};

export default function AdminDashboardPage() {
  return <AdminDashboardPageClient />;
}