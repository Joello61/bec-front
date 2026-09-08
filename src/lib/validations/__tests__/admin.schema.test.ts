import { describe, expect, it } from 'vitest';

import { banUserSchema, deleteContentSchema, logFiltersSchema, updateRolesSchema, userFiltersSchema } from '../admin.schema';

describe('banUserSchema', () => {
  const base = { reason: 'Comportement abusif repete envers plusieurs utilisateurs.', notifyUser: true, deleteContent: false };

  it('accepte un bannissement permanent sans date de fin', () => {
    expect(banUserSchema.safeParse({ ...base, type: 'permanent' }).success).toBe(true);
  });

  it('accepte un bannissement temporaire avec une date de fin', () => {
    expect(banUserSchema.safeParse({ ...base, type: 'temporary', bannedUntil: '2027-01-01' }).success).toBe(true);
  });

  it('rejette un bannissement temporaire sans date de fin', () => {
    const result = banUserSchema.safeParse({ ...base, type: 'temporary' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('bannedUntil');
    }
  });

  it('rejette une raison trop courte (moins de 10 caracteres)', () => {
    expect(banUserSchema.safeParse({ ...base, type: 'permanent', reason: 'Trop bref' }).success).toBe(false);
  });

  it('rejette un type hors enumeration', () => {
    expect(banUserSchema.safeParse({ ...base, type: 'illimite' }).success).toBe(false);
  });
});

describe('updateRolesSchema', () => {
  it('accepte des roles valides incluant ROLE_USER', () => {
    expect(updateRolesSchema.safeParse({ roles: ['ROLE_USER'], notifyUser: false }).success).toBe(true);
  });

  it('rejette une liste de roles sans ROLE_USER', () => {
    expect(updateRolesSchema.safeParse({ roles: ['ROLE_ADMIN'], notifyUser: false }).success).toBe(false);
  });

  it('rejette une liste de roles vide', () => {
    expect(updateRolesSchema.safeParse({ roles: [], notifyUser: false }).success).toBe(false);
  });

  it('rejette la combinaison ROLE_ADMIN + ROLE_MODERATOR simultanee', () => {
    const result = updateRolesSchema.safeParse({ roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR'], notifyUser: false });
    expect(result.success).toBe(false);
  });

  it('accepte ROLE_ADMIN seul (sans ROLE_MODERATOR)', () => {
    expect(updateRolesSchema.safeParse({ roles: ['ROLE_USER', 'ROLE_ADMIN'], notifyUser: true }).success).toBe(true);
  });
});

describe('deleteContentSchema', () => {
  const base = {
    reason: 'Contenu signale a plusieurs reprises par la communaute.',
    motif: 'spam' as const,
    notifyUser: true,
    deleteAllUserContent: false,
    severity: 'medium' as const,
  };

  it('accepte sans bannissement de l\'utilisateur', () => {
    expect(deleteContentSchema.safeParse({ ...base, banUser: false }).success).toBe(true);
  });

  it('rejette un bannissement sans raison de bannissement fournie', () => {
    const result = deleteContentSchema.safeParse({ ...base, banUser: true });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('banReason');
    }
  });

  it('accepte un bannissement avec raison fournie', () => {
    expect(deleteContentSchema.safeParse({ ...base, banUser: true, banReason: 'Recidive' }).success).toBe(true);
  });

  it('rejette une severite hors enumeration', () => {
    expect(deleteContentSchema.safeParse({ ...base, banUser: false, severity: 'extreme' }).success).toBe(false);
  });
});

describe('logFiltersSchema / userFiltersSchema', () => {
  it('acceptent un objet vide (tous les champs optionnels)', () => {
    expect(logFiltersSchema.safeParse({}).success).toBe(true);
    expect(userFiltersSchema.safeParse({}).success).toBe(true);
  });
});
