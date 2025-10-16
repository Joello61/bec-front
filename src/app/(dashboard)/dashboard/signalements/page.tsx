import SignalementsPageClient from "../../../../components/clients/dashboard/signalements-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mes signalements',
  description: 'Consultez l\'état de vos signalements et les actions entreprises par notre équipe de modération.',
  robots: { index: false, follow: false },
};  

export default function SignalementsPage() {
  return <SignalementsPageClient />;
}