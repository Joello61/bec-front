import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../useCurrency', () => ({
  useUserCurrency: () => ({ userCurrency: 'EUR', isLoading: false }),
}));

import { useCurrencyFormat } from '../useCurrencyFormat';

describe('useCurrencyFormat.formatAmount - formatage reel par devise', () => {
  it('formate le XAF sans decimales, suffixe FCFA', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    expect(result.current.formatAmount(1500, 'XAF')).toBe('1 500 FCFA');
  });

  it('formate le XOF comme le XAF (pas de decimales)', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    expect(result.current.formatAmount(2000, 'XOF')).toContain('FCFA');
  });

  it('formate une devise standard via Intl.NumberFormat', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    const formatted = result.current.formatAmount(19.99, 'EUR');
    expect(formatted).toContain('19,99');
  });

  it('replie sur un format simple pour un code devise malforme (Intl.NumberFormat leve)', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    // Un code de 2 caracteres ne respecte pas le format ISO 4217 (3 lettres) : Intl.NumberFormat leve une RangeError.
    expect(result.current.formatAmount(10, 'AB')).toBe('10.00 AB');
  });

  it('renvoie "-" pour un montant non numerique', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    expect(result.current.formatAmount('pas-un-nombre', 'EUR')).toBe('-');
  });

  it('accepte un montant fourni en chaine', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    expect(result.current.formatAmount('1500', 'XAF')).toBe('1 500 FCFA');
  });
});

describe('useCurrencyFormat.formatPrice - priorise le montant deja converti', () => {
  it('utilise prixParKiloFormatted si la devise cible correspond a la devise utilisateur', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    const converted = { originalCurrency: 'XAF', targetCurrency: 'EUR', prixParKiloFormatted: '12,00 €', commissionFormatted: '5,00 €' };

    expect(result.current.formatPrice(999, 'XAF', converted, 'prixParKilo')).toBe('12,00 €');
  });

  it('utilise commissionFormatted pour le champ commission', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    const converted = { originalCurrency: 'XAF', targetCurrency: 'EUR', prixParKiloFormatted: '12,00 €', commissionFormatted: '5,00 €' };

    expect(result.current.formatPrice(999, 'XAF', converted, 'commission')).toBe('5,00 €');
  });

  it('ignore le montant converti si la devise cible ne correspond pas a la devise utilisateur', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    const converted = { originalCurrency: 'XAF', targetCurrency: 'USD', prixParKiloFormatted: '12,00 $', commissionFormatted: '5,00 $' };

    expect(result.current.formatPrice(1500, 'XAF', converted, 'prixParKilo')).toBe('1 500 FCFA');
  });

  it('formate normalement en l\'absence de montant converti', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    expect(result.current.formatPrice(1500, 'XAF')).toBe('1 500 FCFA');
  });
});

describe('useCurrencyFormat.getCurrencySymbol / shouldConvert', () => {
  it('renvoie le symbole connu pour une devise donnee', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    expect(result.current.getCurrencySymbol('eur')).toBe('€');
    expect(result.current.getCurrencySymbol('XAF')).toBe('FCFA');
  });

  it('renvoie le code tel quel si le symbole est inconnu', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    expect(result.current.getCurrencySymbol('ZZZ')).toBe('ZZZ');
  });

  it('shouldConvert est faux si la devise correspond deja a celle de l\'utilisateur (insensible a la casse)', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    expect(result.current.shouldConvert('eur')).toBe(false);
  });

  it('shouldConvert est vrai si la devise differe de celle de l\'utilisateur', () => {
    const { result } = renderHook(() => useCurrencyFormat());
    expect(result.current.shouldConvert('XAF')).toBe(true);
  });
});
