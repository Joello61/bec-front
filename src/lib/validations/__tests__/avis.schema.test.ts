import { describe, expect, it } from 'vitest';

import { createAvisSchema } from '../avis.schema';

describe('createAvisSchema', () => {
  const valid = { cibleId: 42, note: 4 };

  it('accepte un avis valide sans commentaire ni voyage', () => {
    expect(createAvisSchema.safeParse(valid).success).toBe(true);
  });

  it('accepte une note limite (1 et 5)', () => {
    expect(createAvisSchema.safeParse({ ...valid, note: 1 }).success).toBe(true);
    expect(createAvisSchema.safeParse({ ...valid, note: 5 }).success).toBe(true);
  });

  it('rejette une note hors bornes [1, 5]', () => {
    expect(createAvisSchema.safeParse({ ...valid, note: 0 }).success).toBe(false);
    expect(createAvisSchema.safeParse({ ...valid, note: 6 }).success).toBe(false);
  });

  it('rejette une note non entiere', () => {
    expect(createAvisSchema.safeParse({ ...valid, note: 3.5 }).success).toBe(false);
  });

  it('rejette un cibleId non positif', () => {
    expect(createAvisSchema.safeParse({ ...valid, cibleId: 0 }).success).toBe(false);
    expect(createAvisSchema.safeParse({ ...valid, cibleId: -1 }).success).toBe(false);
  });

  it('rejette un commentaire de plus de 500 caracteres', () => {
    expect(createAvisSchema.safeParse({ ...valid, commentaire: 'x'.repeat(501) }).success).toBe(false);
  });
});
