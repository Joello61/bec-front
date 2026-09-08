import { promises as fs } from 'fs';
import path from 'path';

import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

export default async function TrustSafetyContent() {
  const filePath = path.join(process.cwd(), 'public', 'legal', 'variant_A', 'trust_safety.md');
  const content = await fs.readFile(filePath, 'utf-8');

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
