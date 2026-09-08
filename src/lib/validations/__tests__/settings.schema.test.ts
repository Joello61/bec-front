import { describe, expect, it } from 'vitest';
import {
  updateSettingsSchema,
  notificationSettingsSchema,
  privacySettingsSchema,
  preferencesSettingsSchema,
  rgpdSettingsSchema,
  securitySettingsSchema,
} from '../settings.schema';

describe('updateSettingsSchema', () => {
  it('accepte un objet vide (mise a jour partielle, tous les champs optionnels)', () => {
    expect(updateSettingsSchema.safeParse({}).success).toBe(true);
  });

  it('accepte une mise a jour partielle valide', () => {
    expect(updateSettingsSchema.safeParse({ showEmail: false, langue: 'fr' }).success).toBe(true);
  });

  it('rejette une valeur hors enumeration pour profileVisibility', () => {
    expect(updateSettingsSchema.safeParse({ profileVisibility: 'amis_uniquement' }).success).toBe(false);
  });

  it('rejette une valeur hors enumeration pour messagePermission', () => {
    expect(updateSettingsSchema.safeParse({ messagePermission: 'inconnu' }).success).toBe(false);
  });

  it('rejette une langue non supportee', () => {
    expect(updateSettingsSchema.safeParse({ langue: 'de' }).success).toBe(false);
  });

  it('rejette un format de date non supporte', () => {
    expect(updateSettingsSchema.safeParse({ dateFormat: 'dd-mm-yyyy' }).success).toBe(false);
  });
});

describe('schemas partiels par section', () => {
  it('notificationSettingsSchema exige tous ses champs (pas optionnels dans ce sous-schema)', () => {
    expect(notificationSettingsSchema.safeParse({ emailNotificationsEnabled: true }).success).toBe(false);
  });

  it('privacySettingsSchema accepte un jeu complet de valeurs valides', () => {
    const result = privacySettingsSchema.safeParse({
      profileVisibility: 'public',
      showPhone: true,
      showEmail: false,
      showStats: true,
      messagePermission: 'everyone',
      showInSearchResults: true,
      showLastSeen: false,
    });
    expect(result.success).toBe(true);
  });

  it('preferencesSettingsSchema rejette une devise hors enumeration (XAF/EUR/USD)', () => {
    const result = preferencesSettingsSchema.safeParse({
      langue: 'fr',
      devise: 'GBP',
      timezone: 'Africa/Douala',
      dateFormat: 'dd/MM/yyyy',
    });
    expect(result.success).toBe(false);
  });

  it('rgpdSettingsSchema et securitySettingsSchema exigent des booleens explicites', () => {
    expect(rgpdSettingsSchema.safeParse({}).success).toBe(false);
    expect(securitySettingsSchema.safeParse({ twoFactorEnabled: true, loginNotifications: false }).success).toBe(true);
  });
});
