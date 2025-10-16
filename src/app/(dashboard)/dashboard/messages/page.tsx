import MessagesPageClient from "../../../../components/clients/dashboard/messages-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Messagerie',
  description: 'Communiquez en toute sécurité avec les voyageurs et expéditeurs. Organisez vos transports de colis via notre messagerie intégrée.',
  robots: { index: false, follow: false },
};

export default function MessagesPage() {
  return <MessagesPageClient/>;
}