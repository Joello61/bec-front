import { promises as fs } from 'fs';
import path from 'path';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

export default async function TermsContent() {
  const filePath = path.join(process.cwd(), 'public', 'legal', 'variant_A', 'cgu.md');
  const content = await fs.readFile(filePath, 'utf-8');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-8xl mx-auto">
          <div className="card">

            {/* Markdown Content */}
            <MarkdownRenderer content={content} />

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Pour toute question concernant ces conditions, veuillez nous contacter à{' '}
                <a href="mailto:legal@example.com" className="text-primary hover:text-primary-dark">
                  legal@example.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
