import { Metadata } from "next";
import ResetPasswordPageClient from "../../../../components/clients/auth/reset-password-client";

export const metadata: Metadata = {
  title: 'Réinitialiser mon mot de passe',
  description: 'Créez un nouveau mot de passe sécurisé pour votre compte Co-Bage. Choisissez un mot de passe fort pour protéger vos informations.',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient/>;
}