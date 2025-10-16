import AdminModerationPageClient from "../../../../components/clients/admin/moderation-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Modération',
  description: 'Centre de modération pour gérer les contenus signalés et maintenir la qualité de la plateforme.',
  robots: { 
    index: false, 
    follow: false, 
    noarchive: true,
    nosnippet: true 
  },
};

export default function AdminModerationPage() {
  return <AdminModerationPageClient />;
}