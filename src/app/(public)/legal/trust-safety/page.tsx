'use client';

import React, { useEffect, useState } from 'react';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { LoadingSpinner } from '@/components/common';

export default function TrustSafetyPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        const response = await fetch('/legal/variant_A/trust_safety.md');
        
        if (!response.ok) {
          throw new Error('Impossible de charger les informations de sécurité');
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
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-8">
              <p className="text-sm text-success">
                <strong>Notre engagement :</strong> Nous mettons tout en œuvre pour assurer la sécurité 
                et la confiance au sein de notre communauté.
              </p>
            </div>

            {/* Markdown Content */}
            <MarkdownRenderer content={content} />

            {/* Footer avec CTA */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Besoin d&apos;aide ?
                </h3>
                <p className="text-gray-600 mb-4">
                  Notre équipe est là pour vous aider à signaler tout comportement inapproprié
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <a 
                    href="/contact" 
                    className="btn btn-primary"
                  >
                    Nous contacter
                  </a>
                  <a 
                    href="/dashboard/help" 
                    className="btn btn-outline"
                  >
                    Centre d&apos;aide
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}