/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";

import { logger } from '@/lib/utils/logger';

// Types pour le consentement
interface ConsentState {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_personalization: "granted" | "denied";
}

interface CookieConsent {
  accepted: boolean;
  timestamp: string;
  consent: ConsentState;
}

const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialiser gtag dès que possible pour éviter les erreurs
  useEffect(() => {
    if (!isMounted) return;
    
    if (typeof window !== "undefined" && !(window as any).gtag) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        (window as any).dataLayer.push(arguments);
      };
    }
  }, [isMounted]);

  // Définir le consentement par défaut (refusé) dès l'arrivée
  useEffect(() => {
    if (!isMounted) return;
    
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_personalization: "denied",
      });
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    // Chargés sans condition, y compris avant tout choix de l'utilisateur (corrigé
    // 2026-09-10) : Google Consent Mode v2 (default "denied" ci-dessus, déjà en place
    // avant ce chargement) est spécifiquement conçu pour ça - les scripts s'exécutent
    // en mode restreint tant que le consentement n'est pas explicitement accordé, jamais
    // besoin d'attendre un clic pour les charger. Nécessaire pour que le message de
    // consentement certifié de Google (AdSense > Confidentialité et messages, EEE/UK/CH)
    // ait l'occasion de s'afficher : il se déclenche via ce même script AdSense, jamais
    // chargé auparavant tant qu'aucun choix n'était fait sur CETTE bannière.
    loadGoogleScripts();

    // Vérifier si l'utilisateur a déjà fait un choix
    const checkConsent = () => {
      try {
        const savedConsent = localStorage.getItem("cookieConsent");
        if (!savedConsent) {
          setShowBanner(true);
        } else {
          const consent: CookieConsent = JSON.parse(savedConsent);
          updateGoogleConsent(consent.consent);
        }
      } catch (error) {
        logger.error("Erreur lors de la lecture du consentement:", error);
        setShowBanner(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkConsent();
  }, [isMounted]);

  // Mise à jour du consentement Google (Consent Mode v2)
  const updateGoogleConsent = (consent: ConsentState) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: consent.analytics_storage,
        ad_storage: consent.ad_storage,
        ad_personalization: consent.ad_personalization,
      });
    }
  };

  // Chargement des scripts Google (Analytics + AdSense)
  const loadGoogleScripts = () => {
    if (typeof window === "undefined") return;

    const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";
    const ADSENSE_ID =
      process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-XXXXXXXXXXXXXXXX";

    // Initialiser gtag avant de charger les scripts
    (window as any).dataLayer = (window as any).dataLayer || [];
    if (!(window as any).gtag) {
      (window as any).gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        (window as any).dataLayer.push(arguments);
      };
      (window as any).gtag("js", new Date());
    }

    // Le consentement par défaut est déjà défini dans useEffect

    // Charger Google Analytics
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(gaScript);

      gaScript.onload = () => {
        (window as any).gtag("config", GA_ID, {
          anonymize_ip: true,
          cookie_flags: "SameSite=None;Secure",
        });
      };
    }

    // Charger Google AdSense
    if (!document.querySelector(`script[data-ad-client="${ADSENSE_ID}"]`)) {
      const adsenseScript = document.createElement("script");
      adsenseScript.async = true;
      adsenseScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
      adsenseScript.crossOrigin = "anonymous";
      adsenseScript.setAttribute("data-ad-client", ADSENSE_ID);
      document.head.appendChild(adsenseScript);
    }
  };

  // Gérer l'acceptation des cookies
  const handleAccept = () => {
    const consent: CookieConsent = {
      accepted: true,
      timestamp: new Date().toISOString(),
      consent: {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_personalization: "granted",
      },
    };

    try {
      localStorage.setItem("cookieConsent", JSON.stringify(consent));
      
      // Déclencher un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('cookieConsentChange', { 
        detail: consent 
      }));

      // loadGoogleScripts() déjà appelé sans condition au montage - inutile de le
      // refaire ici, updateGoogleConsent() suffit à faire passer les scripts déjà
      // chargés en mode "granted".
      updateGoogleConsent(consent.consent);
      setShowBanner(false);
    } catch (error) {
      logger.error("Erreur lors de la sauvegarde du consentement:", error);
    }
  };

  // Gérer le refus des cookies
  const handleDecline = () => {
    const consent: CookieConsent = {
      accepted: false,
      timestamp: new Date().toISOString(),
      consent: {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_personalization: "denied",
      },
    };

    try {
      localStorage.setItem("cookieConsent", JSON.stringify(consent));
      
      // Déclencher un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('cookieConsentChange', { 
        detail: consent 
      }));
      
      updateGoogleConsent(consent.consent);
      setShowBanner(false);
    } catch (error) {
      logger.error("Erreur lors de la sauvegarde du consentement:", error);
    }
  };

  // Ne rien afficher pendant le chargement ou si pas encore monté
  if (!isMounted || isLoading || !showBanner) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow-2xl border border-gray-200">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Contenu principal */}
              <div className="flex-1">
                <h3
                  id="cookie-consent-title"
                  className="text-lg font-semibold text-gray-900 mb-2"
                >
                  Respect de votre vie privée
                </h3>
                <p
                  id="cookie-consent-description"
                  className="text-sm text-gray-700 leading-relaxed"
                >
                  Nous utilisons des cookies pour améliorer votre expérience,
                  analyser notre trafic et personnaliser les publicités. En
                  acceptant, vous consentez à l&apos;utilisation de Google Analytics
                  et Google AdSense conformément au RGPD.{" "}
                  <a
                    href="/legal/cookies"
                    className="text-[#00695c] hover:text-[#004d40] underline font-medium transition-colors"
                    aria-label="En savoir plus sur notre politique de cookies"
                  >
                    En savoir plus
                  </a>
                </p>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 shrink-0">
                <button
                  onClick={handleDecline}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                  aria-label="Refuser les cookies"
                >
                  Refuser
                </button>
                <button
                  onClick={handleAccept}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#00695c] rounded-lg hover:bg-[#004d40] focus:outline-none focus:ring-2 focus:ring-[#00695c] focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                  aria-label="Accepter les cookies"
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour gérer les préférences (à placer dans le footer)
export const CookiePreferencesButton: React.FC = () => {
  const handleOpenPreferences = () => {
    // Supprimer le consentement existant pour rouvrir la bannière
    try {
      localStorage.removeItem("cookieConsent");
      
      // Déclencher l'événement pour notifier les composants
      window.dispatchEvent(new CustomEvent('cookieConsentChange', { 
        detail: { accepted: false } 
      }));
      
      // Recharger la page pour réafficher la bannière
      window.location.reload();
    } catch (error) {
      logger.error("Erreur lors de la réinitialisation du consentement:", error);
    }
  };

  return (
    <button
      onClick={handleOpenPreferences}
      className="text-sm text-gray-600 hover:text-[#00695c] underline transition-colors"
      aria-label="Gérer mes préférences de cookies"
    >
      Gérer mes préférences cookies
    </button>
  );
};

export default CookieConsentBanner;