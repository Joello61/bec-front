import { Metadata } from "next";

import AdminUserDetailsPageClient from "./user-details-client";

export const metadata: Metadata = {
  title: 'Détails utilisateur',
  description: 'Informations détaillées et actions de modération pour cet utilisateur.',
  robots: { 
    index: false, 
    follow: false, 
    noarchive: true,
    nosnippet: true 
  },
};  

export default function AdminUserDetailsPage() {
  return <AdminUserDetailsPageClient />;
}