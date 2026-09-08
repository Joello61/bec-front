import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrivacySettingsForm from '../PrivacySettingsForm';
import type { UserSettings } from '@/types';

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

describe('PrivacySettingsForm - logique metier', () => {
  it("n'affiche pas l'avertissement mode prive par defaut (visibilite publique)", () => {
    render(<PrivacySettingsForm settings={makeSettings()} onSubmit={vi.fn()} />);
    expect(screen.queryByText(/vous ne recevrez pas de notifications de matching/i)).not.toBeInTheDocument();
  });

  it('affiche un avertissement quand on choisit la visibilite privee', async () => {
    const user = userEvent.setup();
    render(<PrivacySettingsForm settings={makeSettings()} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('radio', { name: /^privé/i }));
    expect(screen.getByText(/vous ne recevrez pas de notifications de matching/i)).toBeInTheDocument();
  });

  it("retire l'avertissement en repassant en visibilite publique", async () => {
    const user = userEvent.setup();
    render(<PrivacySettingsForm settings={makeSettings({ profileVisibility: 'private' })} onSubmit={vi.fn()} />);

    expect(screen.getByText(/vous ne recevrez pas de notifications de matching/i)).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /^public/i }));
    expect(screen.queryByText(/vous ne recevrez pas de notifications de matching/i)).not.toBeInTheDocument();
  });

  it('desactive le bouton Enregistrer tant que rien n a change', () => {
    render(<PrivacySettingsForm settings={makeSettings()} onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /enregistrer les modifications/i })).toBeDisabled();
  });

  it('soumet la permission de messagerie modifiee', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<PrivacySettingsForm settings={makeSettings()} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('radio', { name: /personne/i }));
    await user.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ messagePermission: 'no_one' });
  });
});
