import { promises as fs } from 'fs';
import path from 'path';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

export default async function CookiesContent() {
  const filePath = path.join(process.cwd(), 'public', 'legal', 'variant_A', 'cookies.md');
  const content = await fs.readFile(filePath, 'utf-8');

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
