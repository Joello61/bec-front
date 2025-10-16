import { Metadata } from "next";
import AdminLogsPageClient from "../../../../components/clients/admin/logs-client";

export const metadata: Metadata = {
  title: 'Journaux système',
  description: 'Consultez les logs système et les activités de la plateforme.',
  robots: { 
    index: false, 
    follow: false, 
    noarchive: true,
    nosnippet: true 
  },
};

export default function AdminLogsPage() {
  return <AdminLogsPageClient />;
}