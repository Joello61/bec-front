import { Metadata } from "next";
import OAuthCallbackPageClient from "../../../../components/clients/auth/oauth-callback-client";

export const metadata: Metadata = {
  title: 'Connexion en cours...',
  description: 'Authentification en cours. Vous allez être redirigé vers votre tableau de bord Co-Bage.',
  robots: { index: false, follow: false },
};

export default function OAuthCallbackPage() {
  return <OAuthCallbackPageClient/>;
}