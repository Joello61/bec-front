import { describe, expect, it } from 'vitest';

import { getSafeRedirect, isSafeRedirect } from '@/lib/utils/redirect';

describe('isSafeRedirect', () => {
  it('accepte un chemin interne relatif simple', () => {
    expect(isSafeRedirect('/dashboard')).toBe(true);
  });

  it('accepte un chemin interne relatif avec query string', () => {
    expect(isSafeRedirect('/dashboard/explore?x=1')).toBe(true);
  });

  it('refuse une URL absolue http', () => {
    expect(isSafeRedirect('http://evil.tld')).toBe(false);
  });

  it('refuse une URL absolue https', () => {
    expect(isSafeRedirect('https://evil.tld')).toBe(false);
  });

  it('refuse une protocol-relative URL', () => {
    expect(isSafeRedirect('//evil.tld')).toBe(false);
  });

  it('refuse une variante backslash', () => {
    expect(isSafeRedirect('/\\evil.tld')).toBe(false);
  });

  it('refuse un schema javascript:', () => {
    expect(isSafeRedirect('javascript:alert(1)')).toBe(false);
  });

  it('refuse une chaine ne commencant pas par /', () => {
    expect(isSafeRedirect('dashboard')).toBe(false);
  });

  it('refuse une chaine vide', () => {
    expect(isSafeRedirect('')).toBe(false);
  });

  it('refuse null', () => {
    expect(isSafeRedirect(null)).toBe(false);
  });

  it('refuse undefined', () => {
    expect(isSafeRedirect(undefined)).toBe(false);
  });
});

describe('getSafeRedirect', () => {
  it('retourne le chemin fourni quand il est sur', () => {
    expect(getSafeRedirect('/dashboard/explore', '/auth/login')).toBe('/dashboard/explore');
  });

  it('retourne le fallback quand le chemin est une URL externe', () => {
    expect(getSafeRedirect('https://evil.tld', '/auth/login')).toBe('/auth/login');
  });

  it('retourne le fallback quand le chemin est absent', () => {
    expect(getSafeRedirect(null, '/auth/login')).toBe('/auth/login');
  });
});
