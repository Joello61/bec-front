import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Date actuelle pour lastModified
  const now = new Date();

  // URLs statiques principales (haute priorité)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0, // Page d'accueil = priorité max
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9, // Important pour conversion
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // URLs légales (priorité moyenne)
  const legalRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/trust-safety`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // URLs d'authentification (priorité basse - ne seront pas indexées mais on les liste)
  const authRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/auth/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4, // Légèrement plus important pour conversion
    },
  ];

  // ========================================
  // SECTION DYNAMIQUE (Optionnel si API disponible)
  // ========================================
  // Si vous voulez ajouter des pages de voyages/demandes publiques plus tard :
  /*
  let dynamicVoyages: MetadataRoute.Sitemap = [];
  let dynamicDemandes: MetadataRoute.Sitemap = [];

  try {
    // Exemple : Récupérer les voyages publics depuis l'API
    const voyagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/voyages/public`);
    if (voyagesResponse.ok) {
      const voyages = await voyagesResponse.json();
      dynamicVoyages = voyages.data.map((voyage: any) => ({
        url: `${baseUrl}/voyages/${voyage.slug}`,
        lastModified: new Date(voyage.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }

    // Exemple : Récupérer les demandes publiques depuis l'API
    const demandesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/demandes/public`);
    if (demandesResponse.ok) {
      const demandes = await demandesResponse.json();
      dynamicDemandes = demandes.data.map((demande: any) => ({
        url: `${baseUrl}/demandes/${demande.slug}`,
        lastModified: new Date(demande.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour le sitemap:', error);
  }
  */

  // Combiner toutes les routes
  return [
    ...staticRoutes,
    ...legalRoutes,
    ...authRoutes,
    // ...dynamicVoyages,  // Décommenter si vous avez des pages publiques
    // ...dynamicDemandes, // Décommenter si vous avez des pages publiques
  ];
}
