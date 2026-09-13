import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/lib/utils/constants';
import type { ApiError, User } from '@/types';

import DemandesPageClient from '../mes-demandes-client';

const mockCreateDemande = vi.fn();

vi.mock('@/lib/hooks', () => ({
  useAuth: () => ({ user: makeUser() }),
  useUserDemandes: () => ({ mesDemandes: [], isLoading: false, error: null, refetch: vi.fn() }),
  useDemandeActions: () => ({ createDemande: mockCreateDemande }),
}));

// DemandeForm reel exige des champs valides - hors scope de ce test, qui ne verifie que
// le traitement de la reponse d'erreur QUOTA_EXCEEDED par le composant parent.
vi.mock('@/components/forms', () => ({
  DemandeForm: ({ onSubmit }: { onSubmit: (data: unknown) => Promise<void> }) => (
    <button onClick={() => onSubmit({})}>Soumettre le formulaire</button>
  ),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

describe('mes-demandes-client - message de quota depasse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche un toast avec un lien vers la page abonnement quand la creation echoue par QUOTA_EXCEEDED', async () => {
    const user = userEvent.setup();
    const quotaError: ApiError = {
      success: false,
      message: 'Vous avez atteint la limite de votre plan actuel.',
      error: 'QUOTA_EXCEEDED',
      currentPlan: 'free',
      limit: 3,
    };
    mockCreateDemande.mockRejectedValueOnce(quotaError);

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    render(<DemandesPageClient />);
    await user.click(screen.getAllByRole('button', { name: /créer une demande/i })[0]);
    await user.click(screen.getByRole('button', { name: /soumettre le formulaire/i }));

    const toastEvent = dispatchSpy.mock.calls
      .map((call) => call[0] as CustomEvent)
      .find((event) => event.type === 'show-toast');

    expect(toastEvent).toBeDefined();
    expect(toastEvent!.detail).toMatchObject({
      type: 'error',
      message: quotaError.message,
      action: { label: 'Voir les plans', href: ROUTES.SUBSCRIPTION },
    });
  });

  it("affiche un toast generique (sans lien) pour une erreur de creation qui n'est pas un quota depasse", async () => {
    const user = userEvent.setup();
    mockCreateDemande.mockRejectedValueOnce({ success: false, message: 'Erreur serveur' } as ApiError);

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    render(<DemandesPageClient />);
    await user.click(screen.getAllByRole('button', { name: /créer une demande/i })[0]);
    await user.click(screen.getByRole('button', { name: /soumettre le formulaire/i }));

    const toastEvent = dispatchSpy.mock.calls
      .map((call) => call[0] as CustomEvent)
      .find((event) => event.type === 'show-toast');

    expect(toastEvent).toBeDefined();
    expect(toastEvent!.detail).toMatchObject({ type: 'error', message: 'Erreur lors de la création de la demande' });
    expect(toastEvent!.detail.action).toBeUndefined();
  });
});
