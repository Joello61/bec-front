'use client';

import { DollarSign, Package } from 'lucide-react';
import CurrencyDisplay from './CurrencyDisplay';
import type { ConvertedAmount } from '@/types';

interface PriceDisplayProps {
  prixParKilo?: string | null;
  commission?: string | null;
  currency: string;
  converted?: ConvertedAmount;
  viewerCurrency?: string;
  layout?: 'horizontal' | 'vertical';
  showIcons?: boolean;
  className?: string;
}

/**
 * Composant pour afficher les prix (par kilo et commission) avec conversion
 */
export default function PriceDisplay({
  prixParKilo,
  commission,
  currency,
  converted,
  viewerCurrency,
  layout = 'vertical',
  showIcons = true,
  className = '',
}: PriceDisplayProps) {
  const containerClass = layout === 'horizontal' 
    ? 'flex gap-4' 
    : 'space-y-3';

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Prix par kilo */}
      {prixParKilo && (
        <div className="bg-primary/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-primary/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {showIcons && (
                <DollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary flex-shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Prix par kilo
              </span>
            </div>
            <CurrencyDisplay
              amount={prixParKilo}
              currency={currency}
              converted={converted}
              viewerCurrency={viewerCurrency}
              field="prixParKilo"
              className="text-base sm:text-lg lg:text-xl text-primary"
            />
          </div>
        </div>
      )}

      {/* Commission bagage */}
      {commission && (
        <div className="bg-primary/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-primary/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {showIcons && (
                <Package className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary flex-shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Commission bagage
              </span>
            </div>
            <CurrencyDisplay
              amount={commission}
              currency={currency}
              converted={converted}
              viewerCurrency={viewerCurrency}
              field="commission"
              className="text-base sm:text-lg lg:text-xl text-primary"
            />
          </div>
        </div>
      )}

      {/* Aucun prix */}
      {!prixParKilo && !commission && (
        <div className="text-sm text-gray-500 italic">
          Aucun prix spécifié
        </div>
      )}
    </div>
  );
}