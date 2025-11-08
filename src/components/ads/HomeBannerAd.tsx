"use client";

import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface HomeBannerAdProps {
  /**
   * Slot ID de la publicité (data-ad-slot)
   * @example "1234567890"
   */
  adSlot: string;
  /**
   * Format de la publicité
   * @default "auto"
   */
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal";
  /**
   * Style personnalisé pour le conteneur
   */
  className?: string;
  /**
   * Variante d'affichage
   * - display: Bannière adaptative (recommandé)
   * - infeed: Publicité dans le flux de contenu
   * - article: Publicité dans un article
   */
  variant?: "display" | "infeed" | "article";
}

export default function HomeBannerAd({
  adSlot,
  adFormat = "auto",
  className = "",
  variant = "display",
}: HomeBannerAdProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const adRef = useRef<HTMLDivElement>(null);
  const hasLoaded = useRef(false);

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Vérifier le consentement cookies
  useEffect(() => {
    if (!isMounted) return;

    const checkConsent = () => {
      try {
        const savedConsent = localStorage.getItem("cookieConsent");
        if (savedConsent) {
          const consent = JSON.parse(savedConsent);
          setHasConsent(consent.accepted === true);
        } else {
          setHasConsent(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du consentement:", error);
        setHasConsent(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConsent();

    // Écouter l'événement personnalisé cookieConsentChange
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setHasConsent(customEvent.detail.accepted === true);
        setIsLoading(false);
      }
    };

    // Écouter les changements de consentement (même onglet)
    window.addEventListener("cookieConsentChange", handleConsentChange);

    // Écouter les changements dans d'autres onglets
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cookieConsent") {
        checkConsent();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cookieConsentChange", handleConsentChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isMounted]);

  // Charger la publicité avec IntersectionObserver pour lazy loading
  useEffect(() => {
    if (!isMounted || !hasConsent || !adRef.current || hasLoaded.current) return;

    const loadAd = () => {
      const adElement = adRef.current?.querySelector(".adsbygoogle");
      if (!adElement) return;

      // Vérifier que l'élément a des dimensions valides
      const rect = adElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setTimeout(loadAd, 200);
        return;
      }

      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          hasLoaded.current = true;
        } else {
          // Attendre que le script soit chargé
          const checkScript = setInterval(() => {
            if (window.adsbygoogle) {
              clearInterval(checkScript);
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              hasLoaded.current = true;
            }
          }, 100);

          setTimeout(() => clearInterval(checkScript), 5000);
        }
      } catch (error) {
        console.error("Erreur chargement pub:", error);
      }
    };

    // Utiliser IntersectionObserver pour charger uniquement quand visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded.current) {
            setTimeout(loadAd, 300);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.01,
      }
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [isMounted, hasConsent]);

  // Ne rien afficher si pas encore monté
  if (!isMounted) {
    return null;
  }

  // Skeleton loader pendant le chargement
  if (isLoading) {
    return (
      <div className={`w-full flex justify-center py-6 ${className}`}>
        <div className="w-full max-w-[970px] h-[250px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-sm">Chargement...</span>
        </div>
      </div>
    );
  }

  // Message si pas de consentement
  if (!hasConsent) {
    return (
      <div className={`w-full flex justify-center py-6 ${className}`}>
        <div className="w-full max-w-[728px] h-[90px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4">
          <p className="text-gray-500 text-sm text-center">
            Acceptez les cookies pour afficher les publicités
          </p>
        </div>
      </div>
    );
  }

  // Styles selon la variante
  const getAdStyles = () => {
    switch (variant) {
      case "infeed":
        return { display: "block" };
      case "article":
        return { display: "block", textAlign: "center" as const };
      default:
        return { display: "block" };
    }
  };

  return (
    <div
      ref={adRef}
      className={`w-full flex justify-center py-6 ${className}`}
      aria-label="Publicité"
    >
      <div className="w-full max-w-[970px]">
        <ins
          className="adsbygoogle"
          style={getAdStyles()}
          data-ad-client="ca-pub-5153747283423220"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}