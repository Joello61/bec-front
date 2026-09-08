import { Metadata } from "next";

import ConversationPageClient from "../../../../../components/clients/dashboard/conversation-client";

export const metadata: Metadata = {
  title: 'Conversation',
  description: 'Échangez avec votre interlocuteur pour organiser le transport de colis en toute sécurité.',
  robots: { index: false, follow: false },
};

export default function ConversationPage() {
  return <ConversationPageClient/>;
}