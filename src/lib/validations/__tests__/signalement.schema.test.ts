import { describe, expect, it } from 'vitest';

import { createSignalementSchema, traiterSignalementSchema } from '../signalement.schema';

describe('createSignalementSchema', () => {
  const validDescription = 'Ce contenu me semble frauduleux et suspect.';

  it('accepte un signalement de voyage valide', () => {
    const result = createSignalementSchema.safeParse({
      voyageId: 1,
      motif: 'spam',
      description: validDescription,
    });
    expect(result.success).toBe(true);
  });

  it('accepte un signalement d\'utilisateur (sans voyage/demande/message)', () => {
    const result = createSignalementSchema.safeParse({
      utilisateurSignaleId: 7,
      motif: 'arnaque',
      description: validDescription,
    });
    expect(result.success).toBe(true);
  });

  it('rejette si aucune cible n\'est fournie (ni voyage, ni demande, ni message, ni utilisateur)', () => {
    const result = createSignalementSchema.safeParse({
      motif: 'spam',
      description: validDescription,
    });
    expect(result.success).toBe(false);
  });

  it('rejette un motif hors enumeration', () => {
    const result = createSignalementSchema.safeParse({
      voyageId: 1,
      motif: 'motif_inconnu',
      description: validDescription,
    });
    expect(result.success).toBe(false);
  });

  it('rejette une description trop courte (moins de 20 caracteres)', () => {
    const result = createSignalementSchema.safeParse({
      voyageId: 1,
      motif: 'spam',
      description: 'Trop court.',
    });
    expect(result.success).toBe(false);
  });
});

describe('traiterSignalementSchema', () => {
  it('accepte un traitement valide', () => {
    expect(traiterSignalementSchema.safeParse({ statut: 'traite' }).success).toBe(true);
    expect(traiterSignalementSchema.safeParse({ statut: 'rejete', reponseAdmin: 'Non fonde' }).success).toBe(true);
  });

  it('rejette un statut hors enumeration', () => {
    expect(traiterSignalementSchema.safeParse({ statut: 'en_attente' }).success).toBe(false);
  });

  it('rejette une reponse admin de plus de 500 caracteres', () => {
    expect(traiterSignalementSchema.safeParse({ statut: 'traite', reponseAdmin: 'x'.repeat(501) }).success).toBe(false);
  });
});
