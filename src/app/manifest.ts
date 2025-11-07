import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Co-Bage - Transport Collaboratif de Colis",
    short_name: "Co-Bage",
    description:
      "Plateforme de transport collaboratif de colis entre le Cameroun, l'Afrique et leur diaspora. Envoyez moins cher, transportez et gagnez.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "window-controls-overlay"],
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#00695c",
    lang: "fr-FR",
    dir: "ltr",
    categories: ["travel", "logistics", "business", "utilities"],

    icons: [
      { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png", purpose: "any" },
      { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png", purpose: "any" },
      { src: "/favicon-96x96.png", sizes: "96x96", type: "image/png", purpose: "any" },
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/android-chrome-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],

    screenshots: [
      {
        src: "/images/screenshots/home-desktop.png",
        sizes: "1242x714",
        type: "image/png",
        form_factor: "wide",
        label: "Page d'accueil Co-Bage sur ordinateur",
      },
      {
        src: "/images/screenshots/mobile-explore.png",
        sizes: "782x1662",
        type: "image/png",
        form_factor: "narrow",
        label: "Exploration des voyages sur mobile",
      },
    ],

    shortcuts: [
      {
        name: "Explorer les voyages",
        short_name: "Explorer",
        description: "Rechercher des voyages disponibles",
        url: "/dashboard/explore",
        icons: [{ src: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Mes voyages",
        short_name: "Voyages",
        description: "Gérer mes voyages",
        url: "/dashboard/mes-voyages",
        icons: [{ src: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Messages",
        short_name: "Messages",
        description: "Accéder à la messagerie",
        url: "/dashboard/messages",
        icons: [{ src: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }],
      },
    ],

    protocol_handlers: [{ protocol: "web+cobage", url: "/%s" }],

    share_target: {
      action: "/dashboard/mes-demandes",
      method: "GET",
      enctype: "application/x-www-form-urlencoded",
      params: {
        title: "title",
        text: "text",
        url: "url",
      },
    },

    related_applications: [],
    prefer_related_applications: false,
  };
}
