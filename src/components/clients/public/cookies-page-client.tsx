'use client';

import React, { useEffect, useState } from 'react';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { LoadingSpinner } from '@/components/common';

export default function CookiePolicyPageClient() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        // Chemin du fichier Markdown pour ta politique de cookies
        const response = await fetch('/legal/variant_A/cookies.md');
        
        if (!response.ok) {
          throw new Error('Impossible de charger la politique relative aux cookies');
        }
        
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Erreur</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-8xl mx-auto">
          <div className="card">
            {/* Info Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-amber-700">
                <strong>Cookies & traceurs :</strong> 
                cette page explique comment Co-Bage utilise des cookies pour améliorer votre expérience 
                et analyser la fréquentation du site. Vous pouvez gérer vos préférences à tout moment.
              </p>
            </div>

            {/* Markdown Content */}
            <MarkdownRenderer content={content} />

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Vous pouvez modifier vos préférences de cookies dans la section{' '}
                <a href="/parametres/confidentialite" className="text-primary hover:text-primary-dark">
                  Paramètres de confidentialité
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
