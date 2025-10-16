import { Metadata } from "next";
import CompleteProfilePageClient from "../../../../components/clients/dashboard/complete-profil-client";

export const metadata: Metadata = {
  title: 'Compléter mon profil',
  description: 'Complétez votre profil Co-Bage pour gagner la confiance de la communauté et accéder à toutes les fonctionnalités.',
  robots: { index: false, follow: false },
};

export default function CompleteProfilePage() {
  return <CompleteProfilePageClient/>;
}