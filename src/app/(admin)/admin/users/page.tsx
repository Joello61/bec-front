import { Metadata } from "next";

import AdminUsersPageClient from "./users-client";

export const metadata: Metadata = {
  title: 'Gestion des utilisateurs',
  description: 'Consultez et gérez tous les utilisateurs de la plateforme Co-Bage.',
  robots: { 
    index: false, 
    follow: false, 
    noarchive: true,
    nosnippet: true 
  },
};

export default function AdminUsersPage() {
  return <AdminUsersPageClient/>;
}