import AddressPageClient from "../../../../../components/clients/dashboard/address-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mes adresses',
  description: 'Gérez vos adresses de prise en charge et de livraison pour faciliter vos transports de colis.',
  robots: { index: false, follow: false },
};

export default function AddressPage() {
  return <AddressPageClient />;
}