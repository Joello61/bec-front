import { Metadata } from "next";

import ChangePasswordPageClient from "../../../../../components/clients/dashboard/change-password-client";

export const metadata: Metadata = {
  title: 'Changer mon mot de passe',
  description: 'Modifiez votre mot de passe pour sécuriser davantage votre compte Co-Bage.',
  robots: { index: false, follow: false },
};

export default function ChangePasswordPage() {
  return <ChangePasswordPageClient />;
}