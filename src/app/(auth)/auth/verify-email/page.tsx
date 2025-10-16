import { Metadata } from "next";
import VerifyEmailPageClient from "../../../../components/clients/auth/verify-email-client";

export const metadata: Metadata = {
  title: 'Réinitialiser mon mot de passe',
  description: 'Créez un nouveau mot de passe sécurisé pour votre compte Co-Bage. Choisissez un mot de passe fort pour protéger vos informations.',
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return <VerifyEmailPageClient/>;
}