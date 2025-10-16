import ProfilePageClient from "../../../../components/clients/dashboard/profile-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mon profil',
  description: 'Gérez vos informations personnelles, votre photo de profil et vos préférences sur Co-Bage.',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}