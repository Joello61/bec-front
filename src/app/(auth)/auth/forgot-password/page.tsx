import { Metadata } from "next";
import ForgotPasswordPageClient from "../../../../components/clients/auth/forgot-password-client";

export const metadata: Metadata = {
  title: 'Mot de passe oublié',
  description: 'Réinitialisez votre mot de passe Co-Bage en quelques clics. Recevez un lien de réinitialisation par email pour accéder à nouveau à votre compte en toute sécurité.',
  keywords: [
    'mot de passe oublié Co-Bage',
    'réinitialiser mot de passe',
    'récupération compte Co-Bage',
    'reset password',
  ],
  robots: {
    index: false, // Ne pas indexer cette page
    follow: true,
  },
  alternates: {
    canonical: '/auth/forgot-password',
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}