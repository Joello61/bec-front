import { describe, expect, it } from 'vitest';
import { createPropositionSchema, respondPropositionSchema } from '../proposition.schema';

describe('createPropositionSchema', () => {
  const valid = { demandeId: 1, prixParKilo: 12, commissionProposeePourUnBagage: 2000 };

  it('accepte une proposition valide sans message', () => {
    expect(createPropositionSchema.safeParse(valid).success).toBe(true);
  });

  it('rejette un demandeId non entier ou non positif', () => {
    expect(createPropositionSchema.safeParse({ ...valid, demandeId: 1.5 }).success).toBe(false);
    expect(createPropositionSchema.safeParse({ ...valid, demandeId: 0 }).success).toBe(false);
  });

  it('rejette un prix par kilo non positif', () => {
    expect(createPropositionSchema.safeParse({ ...valid, prixParKilo: 0 }).success).toBe(false);
  });

  it('rejette un message de plus de 1000 caracteres', () => {
    expect(createPropositionSchema.safeParse({ ...valid, message: 'x'.repeat(1001) }).success).toBe(false);
  });
});

describe('respondPropositionSchema', () => {
  it('accepte une acceptation sans message', () => {
    expect(respondPropositionSchema.safeParse({ action: 'accepter' }).success).toBe(true);
  });

  it('accepte un refus sans message de refus (le message reste recommande, non obligatoire)', () => {
    expect(respondPropositionSchema.safeParse({ action: 'refuser' }).success).toBe(true);
  });

  it('accepte un refus avec message de refus', () => {
    expect(respondPropositionSchema.safeParse({ action: 'refuser', messageRefus: 'Prix trop eleve' }).success).toBe(true);
  });

  it('rejette une action hors enumeration', () => {
    expect(respondPropositionSchema.safeParse({ action: 'ignorer' }).success).toBe(false);
  });

  it('rejette un message de refus vide/blanc s\'il est fourni', () => {
    expect(respondPropositionSchema.safeParse({ action: 'refuser', messageRefus: '   ' }).success).toBe(false);
  });

  it('rejette un message de refus de plus de 500 caracteres', () => {
    expect(respondPropositionSchema.safeParse({ action: 'refuser', messageRefus: 'x'.repeat(501) }).success).toBe(false);
  });
});
