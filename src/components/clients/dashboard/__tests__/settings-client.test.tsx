import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { UserSettings } from '@/types';

import SettingsPageClient from '../settings-client';

const mockUseSettings = vi.fn();
const mockUpdateSettings = vi.fn();
const mockExportData = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useSettings: () => mockUseSettings(),
  useSettingsActions: () => ({ updateSettings: mockUpdateSettings, exportData: mockExportData }),
}));

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

describe('settings-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche un etat de chargement', () => {
    mockUseSettings.mockReturnValue({ settings: null, isLoading: true, error: null, refetch: vi.fn() });
    render(<SettingsPageClient />);
    expect(screen.getByText(/chargement des paramètres/i)).toBeInTheDocument();
  });

  it("affiche l'etat d'erreur avec un bouton de nouvel essai", () => {
    const refetch = vi.fn();
    mockUseSettings.mockReturnValue({ settings: null, isLoading: false, error: 'Erreur reseau', refetch });
    render(<SettingsPageClient />);

    expect(screen.getByText(/erreur reseau/i)).toBeInTheDocument();
    screen.getByRole('button', { name: /réessayer|retry/i }).click();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("affiche l'onglet Notifications par defaut puis bascule sur l'onglet Confidentialite", async () => {
    mockUseSettings.mockReturnValue({ settings: makeSettings(), isLoading: false, error: null, refetch: vi.fn() });
    const user = userEvent.setup();
    render(<SettingsPageClient />);

    expect(screen.getByRole('heading', { name: /^notifications$/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /confidentialité/i }));
    expect(screen.getByRole('heading', { name: /^confidentialité$/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^notifications$/i })).not.toBeInTheDocument();
  });

  it('affiche un toast de succes apres mise a jour des parametres', async () => {
    mockUseSettings.mockReturnValue({ settings: makeSettings(), isLoading: false, error: null, refetch: vi.fn() });
    mockUpdateSettings.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SettingsPageClient />);

    await user.click(screen.getByRole('checkbox', { name: /^sms/i }));
    await user.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    await waitFor(() => expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({ smsNotificationsEnabled: true })
    ));
  });
});
