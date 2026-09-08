import { describe, expect, it } from 'vitest';

import { createContactSchema } from '../contact.schema';

describe('createContactSchema', () => {
  const valid = {
    nom: 'Jean Dupont',
    email: 'jean@example.com',
    sujet: 'Question sur un voyage',
    message: 'Bonjour, j\'ai une question a propos de mon voyage.',
  };

  it('accepte un formulaire de contact valide', () => {
    expect(createContactSchema.safeParse(valid).success).toBe(true);
  });

  it('rejette un email invalide', () => {
    expect(createContactSchema.safeParse({ ...valid, email: 'pas-un-email' }).success).toBe(false);
  });

  it('rejette un sujet trop court (moins de 5 caracteres)', () => {
    expect(createContactSchema.safeParse({ ...valid, sujet: 'Hey' }).success).toBe(false);
  });

  it('rejette un message trop court (moins de 10 caracteres)', () => {
    expect(createContactSchema.safeParse({ ...valid, message: 'Trop bref' }).success).toBe(false);
  });

  it('rejette un message de plus de 5000 caracteres', () => {
    expect(createContactSchema.safeParse({ ...valid, message: 'x'.repeat(5001) }).success).toBe(false);
  });

  it('rejette un nom vide', () => {
    expect(createContactSchema.safeParse({ ...valid, nom: '' }).success).toBe(false);
  });
});
