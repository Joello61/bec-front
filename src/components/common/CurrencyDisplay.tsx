'use client';

import { useCurrencyFormat } from '@/lib/hooks/useCurrencyFormat';
import type { ConvertedAmount } from '@/types';

interface CurrencyDisplayProps {
  amount: number | string;
  currency: string;
  converted?: ConvertedAmount;
  viewerCurrency?: string;
  showOriginal?: boolean;
  field?: 'prixParKilo' | 'commission';
  className?: string;
  compact?: boolean; // Mode compact pour les cards mobiles
}

export default function CurrencyDisplay({
  amount,
  currency,
  converted,
  viewerCurrency,
  showOriginal = true,
  field = 'prixParKilo',
  className = '',
  compact = false,
}: CurrencyDisplayProps) {
  const { formatPrice, formatAmount } = useCurrencyFormat();

  // Vérifier si une conversion est disponible et applicable
  const hasConversion = converted && 
    converted.targetCurrency === viewerCurrency &&
    currency !== viewerCurrency;

  // Montant à afficher
  const displayAmount = hasConversion
    ? formatPrice(amount, currency, converted, field)
    : formatAmount(amount, currency);

  // Pas de conversion ou tooltip désactivé
  if (!hasConversion || !showOriginal) {
    return (
      <span className={`font-bold ${className}`}>
        {displayAmount}
      </span>
    );
  }

  // Mode compact (pour les cards mobiles)
  if (compact) {
    return (
      <>
        <div className="flex items-center gap-1.5 group">
          <span className={`font-bold ${className}`}>
            {displayAmount}
          </span>
        </div>
      </>
    );
  }

  // Mode desktop normal (avec tooltip hover)
  return (
    <div className="flex items-center gap-2 group relative">
      <span className={`font-bold ${className}`}>
        {displayAmount}
      </span>
    </div>
  );
}