import { Metadata } from "next";

import AdminTransactionsPageClient from "../../../../components/clients/admin/transactions-client";

export const metadata: Metadata = {
  title: 'Transactions',
  description: 'Paiements des abonnements et boosts, remboursements.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true
  },
};

export default function AdminTransactionsPage() {
  return <AdminTransactionsPageClient />;
}
