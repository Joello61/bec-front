import PropositionsPageClient from "@/components/clients/dashboard/mes-propositions-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mes propositions',
  description: 'Gérez toutes vos propositions publiées sur Co-Bage. Consultez les détails, acceptez ou refusez les offres, et communiquez avec les expéditeurs.',
  robots: { index: false, follow: false },
};

export default function PropositionsPage() {
  return <PropositionsPageClient />;
}