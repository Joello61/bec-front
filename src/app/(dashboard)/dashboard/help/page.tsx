import HelpPageClient from "../../../../components/clients/dashboard/help-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Centre d\'aide',
  description: 'Trouvez des réponses à vos questions ou contactez notre support pour obtenir de l\'aide sur Co-Bage.',
  robots: { index: false, follow: false },
};

export default function HelpPage() {
  return <HelpPageClient/>;
}