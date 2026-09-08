import { Metadata } from "next";

import SettingsPageClient from "../../../../components/clients/dashboard/settings-client";

export const metadata: Metadata = {
  title: 'Paramètres',
  description: 'Configurez vos préférences de notifications, confidentialité et paramètres RGPD sur Co-Bage.',
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return <SettingsPageClient/>;
}