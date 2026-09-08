import { promises as fs } from 'fs';
import path from 'path';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

export default async function PrivacyContent() {
  const filePath = path.join(process.cwd(), 'public', 'legal', 'variant_A', 'politique_confidentialite.md');
  const content = await fs.readFile(filePath, 'utf-8');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-8xl mx-auto">
          <div className="card">
            {/* Info Banner */}
            <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-8">
              <p className="text-sm text-info-dark">
                <strong>Important :</strong> Nous prenons très au sérieux la protection de vos données personnelles.
                Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
            </div>

            {/* Markdown Content */}
            <MarkdownRenderer content={content} />

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Pour toute question concernant vos données personnelles, contactez notre DPO à{' '}
                <a href="mailto:dpo@example.com" className="text-primary hover:text-primary-dark">
                  dpo@example.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
