import FavorisPageClient from "../../../../components/clients/dashboard/favoris-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mes favoris',
description: 'Retrouvez tous les voyages et demandes que vous avez sauvegardés pour un suivi rapide.',
  robots: { index: false, follow: false },
};

export default function FavorisPage() {
  return <FavorisPageClient/>;
}