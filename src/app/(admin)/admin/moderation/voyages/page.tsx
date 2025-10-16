import AdminModerationVoyagesPageClient from "../../../../../components/clients/admin/voyages-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Modération des voyages',
  description: 'Modérez les annonces de voyages signalées ou suspectes.',
  robots: { 
    index: false, 
    follow: false, 
    noarchive: true,
    nosnippet: true 
  },
};

export default function AdminModerationVoyagesPage() {
  return <AdminModerationVoyagesPageClient />;
}