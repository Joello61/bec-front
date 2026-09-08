import { describe, expect, it } from 'vitest';

import { searchUserSchema, updateUserSchema } from '../user.schema';

describe('updateUserSchema', () => {
  it('accepte un objet vide (tous les champs optionnels)', () => {
    expect(updateUserSchema.safeParse({}).success).toBe(true);
  });

  it('accepte une mise a jour partielle valide', () => {
    expect(updateUserSchema.safeParse({ nom: 'Dupont' }).success).toBe(true);
  });

  it('accepte un telephone au format international', () => {
    expect(updateUserSchema.safeParse({ telephone: '+237612345678' }).success).toBe(true);
  });

  it('accepte une chaine vide pour telephone/bio (champs optionnels avec fallback litteral)', () => {
    expect(updateUserSchema.safeParse({ telephone: '', bio: '' }).success).toBe(true);
  });

  it('rejette un telephone mal forme (non vide et invalide)', () => {
    expect(updateUserSchema.safeParse({ telephone: 'pas-un-numero' }).success).toBe(false);
  });

  it('rejette un nom trop court', () => {
    expect(updateUserSchema.safeParse({ nom: 'D' }).success).toBe(false);
  });

  it('rejette une bio de plus de 500 caracteres', () => {
    expect(updateUserSchema.safeParse({ bio: 'x'.repeat(501) }).success).toBe(false);
  });
});

describe('searchUserSchema', () => {
  it('accepte une recherche de 2 caracteres ou plus', () => {
    expect(searchUserSchema.safeParse({ query: 'Jo' }).success).toBe(true);
  });

  it('rejette une recherche de moins de 2 caracteres', () => {
    expect(searchUserSchema.safeParse({ query: 'J' }).success).toBe(false);
  });

  it('rejette une recherche de plus de 100 caracteres', () => {
    expect(searchUserSchema.safeParse({ query: 'x'.repeat(101) }).success).toBe(false);
  });
});
