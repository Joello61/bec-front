import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { UserSettings } from '@/types';

import PreferencesSettingsForm from '../PreferencesSettingsForm';

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
    devise: 'EUR',
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

// L'asterisque "requis" est colle au libelle sans espace (Select ajoute <span>*</span>
// juste apres le texte) : meme tolerance que dans CompleteProfileForm.test.tsx.
function labelExact(text: string): RegExp {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\*?$`);
}

describe('PreferencesSettingsForm - logique metier', () => {
  it('pre-remplit la devise actuelle du profil (pas seulement langue/timezone/format de date)', () => {
    render(<PreferencesSettingsForm settings={makeSettings({ devise: 'EUR' })} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(labelExact('Devise préférée'))).toHaveTextContent('Euro (EUR)');
  });

  it('desactive le bouton Enregistrer tant que rien n a change', () => {
    render(<PreferencesSettingsForm settings={makeSettings()} onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /enregistrer les modifications/i })).toBeDisabled();
  });

  it('soumet la langue modifiee en conservant la devise actuelle', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<PreferencesSettingsForm settings={makeSettings({ devise: 'USD' })} onSubmit={onSubmit} />);

    await user.click(screen.getByLabelText(labelExact("Langue de l'interface")));
    await user.click(await screen.findByRole('button', { name: 'English' }));
    await user.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ langue: 'en', devise: 'USD' });
  });
});
