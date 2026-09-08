import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: {
    delete: vi.fn().mockResolvedValue({ data: undefined }),
  },
}));

import apiClient from '../client';
import { usersApi } from '../users';

/**
 * Phase 5 (bec-docs/docs/plan-correction/plan-correction-cobage.md) : DELETE /api/users/me,
 * seul appel API touchant a la suppression de son propre compte. Verifie le contrat exact
 * attendu par le backend (DeleteAccountDTO) selon que l'utilisateur fournit un mot de passe
 * ou non (compte OAuth pur).
 */
describe('usersApi.deleteAccount', () => {
  it('envoie le mot de passe actuel dans le corps de la requete quand il est fourni', async () => {
    await usersApi.deleteAccount('CorrectPass123');

    expect(apiClient.delete).toHaveBeenCalledWith('/users/me', {
      data: { currentPassword: 'CorrectPass123' },
    });
  });

  it('envoie un corps vide quand aucun mot de passe n\'est fourni (compte OAuth)', async () => {
    await usersApi.deleteAccount();

    expect(apiClient.delete).toHaveBeenCalledWith('/users/me', {
      data: {},
    });
  });
});
