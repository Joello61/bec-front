import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { User, UserSettings } from '@/types';

import RgpdSettingsForm from '../RgpdSettingsForm';

const mockUseAuth = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'user@example.com',
    nom: 'Doe',
    prenom: 'John',
    telephone: null,
    photo: null,
    bio: null,
    emailVerifie: true,
    telephoneVerifie: false,
    authProvider: 'local',
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    isBanned: false,
    noteAvisMoyen: null,
    address: null,
    isProfileComplete: true,
    ...overrides,
  };
}

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
    consentDate: '2026-01-01T00:00:00.000Z',
    twoFactorEnabled: false,
    loginNotifications: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('RgpdSettingsForm - logique metier (Phase 5 RGPD)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: makeUser(), deleteAccount: vi.fn() });
  });

  it('desactive le bouton Enregistrer tant qu aucun consentement n a change', () => {
    render(
      <RgpdSettingsForm settings={makeSettings()} onSubmit={vi.fn()} onExportData={vi.fn()} />
    );

    expect(screen.getByRole('button', { name: /enregistrer mes choix/i })).toBeDisabled();
  });

  it('active le bouton Enregistrer et soumet les valeurs apres modification d un consentement', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <RgpdSettingsForm settings={makeSettings()} onSubmit={onSubmit} onExportData={vi.fn()} />
    );

    await user.click(screen.getByRole('checkbox', { name: /cookies analytiques/i }));
    const submit = screen.getByRole('button', { name: /enregistrer mes choix/i });
    expect(submit).toBeEnabled();

    await user.click(submit);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ analyticsConsent: true });
  });

  it('appelle onExportData au clic sur Exporter mes donnees', async () => {
    const onExportData = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <RgpdSettingsForm settings={makeSettings()} onSubmit={vi.fn()} onExportData={onExportData} />
    );

    await user.click(screen.getByRole('button', { name: /exporter mes données/i }));
    expect(onExportData).toHaveBeenCalledTimes(1);
  });

  it('ouvre la modale de suppression de compte au clic sur Supprimer mon compte', async () => {
    const user = userEvent.setup();
    render(
      <RgpdSettingsForm settings={makeSettings()} onSubmit={vi.fn()} onExportData={vi.fn()} />
    );

    expect(screen.queryByText(/action irréversible/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^supprimer mon compte$/i }));
    expect(screen.getByText(/action irréversible/i)).toBeInTheDocument();
  });
});
