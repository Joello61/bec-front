import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Co-Bage',
    short_name: 'CB',
    description:
      'Plateforme de mise en relation entre voyageurs et personnes souhaitant faire transporter des objets',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00695c',
    orientation: 'portrait-primary',
    categories: ['travel', 'logistics', 'transport'],
    lang: 'fr-FR',
    dir: 'ltr',
    icons: [
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/images/screenshots/home-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: "Page d'accueil sur desktop",
      },
      {
        src: '/images/screenshots/home-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: "Page d'accueil sur mobile",
      },
    ],
    shortcuts: [
      {
        name: 'Rechercher un voyage',
        short_name: 'Voyages',
        description: 'Trouver un voyageur disponible',
        url: '/voyages',
        icons: [{ src: '/icons/shortcut-voyages.png', sizes: '96x96' }],
      },
      {
        name: 'Créer une demande',
        short_name: 'Demande',
        description: 'Publier une demande de transport',
        url: '/demandes',
        icons: [{ src: '/icons/shortcut-demandes.png', sizes: '96x96' }],
      },
      {
        name: 'Messages',
        short_name: 'Messages',
        description: 'Voir mes conversations',
        url: '/messages',
        icons: [{ src: '/icons/shortcut-messages.png', sizes: '96x96' }],
      },
    ],
  };
}
