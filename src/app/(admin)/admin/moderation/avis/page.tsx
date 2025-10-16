import AdminModerationAvisPageClient from "../../../../../components/clients/admin/avis-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Modération des avis',
  description: 'Modérez les avis et évaluations laissés par les utilisateurs.',
  robots: { 
    index: false, 
    follow: false, 
    noarchive: true,
    nosnippet: true 
  },
};

export default function AdminModerationAvisPage() {
  return <AdminModerationAvisPageClient />;
}