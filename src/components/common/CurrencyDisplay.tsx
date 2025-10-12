'use client';

import { Info } from 'lucide-react';
import { useCurrencyFormat } from '@/lib/hooks/useCurrencyFormat';
import type { ConvertedAmount } from '@/types';

interface CurrencyDisplayProps {
  amount: number | string;
  currency: string;
  converted?: ConvertedAmount;
  viewerCurrency?: string;
  showOriginal?: boolean; // Afficher l'original en tooltip
  field?: 'prixParKilo' | 'commission'; // Quel champ afficher
  className?: string;
}

export default function CurrencyDisplay({
  amount,
  currency,
  converted,
  viewerCurrency,
  showOriginal = true,
  field = 'prixParKilo',
  className = '',
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

  // Montant original pour le tooltip
  const originalAmount = formatAmount(amount, currency);

  if (!hasConversion || !showOriginal) {
    // Pas de conversion ou tooltip désactivé
    return (
      <span className={`font-semibold ${className}`}>
        {displayAmount}
      </span>
    );
  }

  // Avec conversion et tooltip
  return (
    <div className="flex items-center gap-2 group relative">
      <span className={`font-semibold ${className}`}>
        {displayAmount}
      </span>
      
      {/* Icône de conversion avec tooltip */}
      <div className="relative">
        <Info className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity cursor-help" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
          <div className="text-center">
            <div className="text-gray-300 mb-1">Montant original</div>
            <div className="font-semibold">{originalAmount}</div>
          </div>
          {/* Flèche du tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
}