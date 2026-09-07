import { describe, expect, it } from 'vitest';
import { decodeJwtRoles } from '@/lib/utils/jwt';

function base64url(value: object | string): string {
  const json = typeof value === 'string' ? value : JSON.stringify(value);
  return Buffer.from(json)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fakeJwt(payload: object): string {
  const header = base64url({ alg: 'RS256', typ: 'JWT' });
  const body = base64url(payload);
  return `${header}.${body}.fake-signature`;
}

describe('decodeJwtRoles', () => {
  it('extrait ROLE_ADMIN quand present dans le payload', () => {
    const token = fakeJwt({ roles: ['ROLE_USER', 'ROLE_ADMIN'] });
    expect(decodeJwtRoles(token)).toContain('ROLE_ADMIN');
  });

  it('ne contient pas ROLE_ADMIN pour un utilisateur standard', () => {
    const token = fakeJwt({ roles: ['ROLE_USER'] });
    expect(decodeJwtRoles(token)).not.toContain('ROLE_ADMIN');
  });

  it('retourne un tableau vide si le token n a pas 3 segments', () => {
    expect(decodeJwtRoles('pas-un-jwt')).toEqual([]);
  });

  it('retourne un tableau vide si le payload n est pas du JSON valide', () => {
    const token = `${base64url('header')}.not-base64-json.sig`;
    expect(decodeJwtRoles(token)).toEqual([]);
  });

  it('retourne un tableau vide si le payload n a pas de champ roles', () => {
    const token = fakeJwt({ id: 1 });
    expect(decodeJwtRoles(token)).toEqual([]);
  });

  it('ne leve jamais d exception sur une entree vide', () => {
    expect(() => decodeJwtRoles('')).not.toThrow();
    expect(decodeJwtRoles('')).toEqual([]);
  });
});
