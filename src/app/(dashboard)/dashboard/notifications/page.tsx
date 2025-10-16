import NotificationsPageClient from "../../../../components/clients/dashboard/notifications-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Consultez toutes vos notifications : nouvelles propositions, messages, mises à jour de voyages et alertes importantes.',
  robots: { index: false, follow: false },
};

export default function NotificationsPage() {
  return <NotificationsPageClient />;
}