import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { UserSettings } from '@/types';

import SecuritySettingsForm from '../SecuritySettingsForm';

function makeSettings(overrides: Partial<UserSettings> = {}): UserSettings {
  return {
    id: 1,
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: false,
    pushNotificationsEnabled: true,
    notifyOnNewMessage: true,
    notifyOnMatchingVoyage: true,
    notifyOnMatchingDemande: true,
    notifyOnNewAvis: true,
    notifyOnFavoriUpdate: true,
    profileVisibility: 'public',
    showPhone: false,
    showEmail: false,
    showStats: true,
    messagePermission: 'everyone',
    showInSearchResults: true,
    showLastSeen: true,
    langue: 'fr',
    devise: 'XAF',
    timezone: 'Africa/Douala',
    dateFormat: 'dd/MM/yyyy',
    cookiesConsent: true,
    analyticsConsent: false,
    marketingConsent: false,
    dataShareConsent: false,
    consentDate: null,
    twoFactorEnabled: false,
    loginNotifications: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('SecuritySettingsForm - logique metier', () => {
  it("n'affiche pas la note explicative 2FA quand elle est desactivee", () => {
    render(<SecuritySettingsForm settings={makeSettings()} onSubmit={vi.fn()} />);
    expect(screen.queryByText(/sera configurée lors de votre prochaine connexion/i)).not.toBeInTheDocument();
  });

  it('affiche la note explicative 2FA une fois la case cochee', async () => {
    const user = userEvent.setup();
    render(<SecuritySettingsForm settings={makeSettings()} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('checkbox', { name: /authentification à deux facteurs/i }));
    expect(screen.getByText(/sera configurée lors de votre prochaine connexion/i)).toBeInTheDocument();
  });

  it('desactive le bouton Enregistrer tant que rien n a change', () => {
    render(<SecuritySettingsForm settings={makeSettings()} onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /enregistrer les modifications/i })).toBeDisabled();
  });

  it('soumet les valeurs modifiees', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SecuritySettingsForm settings={makeSettings()} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('checkbox', { name: /notifications de connexion/i }));
    await user.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ loginNotifications: false, twoFactorEnabled: false });
  });
});
