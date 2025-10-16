import NotFoundClient from '../components/clients/public/not-found-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page non trouvée - 404',
  description:
    "La page que vous recherchez n'existe pas ou a été déplacée. Retournez à l'accueil de Co-Bage.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
