import { z } from 'zod';

// Schéma pour la mise à jour des paramètres
export const updateSettingsSchema = z.object({
  // ==================== NOTIFICATIONS ====================
  emailNotificationsEnabled: z.boolean().optional(),
  smsNotificationsEnabled: z.boolean().optional(),
  pushNotificationsEnabled: z.boolean().optional(),
  notifyOnNewMessage: z.boolean().optional(),
  notifyOnMatchingVoyage: z.boolean().optional(),
  notifyOnMatchingDemande: z.boolean().optional(),
  notifyOnNewAvis: z.boolean().optional(),
  notifyOnFavoriUpdate: z.boolean().optional(),

  // ==================== CONFIDENTIALITÉ ====================
  profileVisibility: z
    .enum(['public', 'verified_only', 'private'], {
      message: 'La visibilité doit être : public, verified_only ou private',
    })
    .optional(),
  showPhone: z.boolean().optional(),
  showEmail: z.boolean().optional(),
  showStats: z.boolean().optional(),
  messagePermission: z
    .enum(['everyone', 'verified_only', 'no_one'], {
      message: 'Les permissions doivent être : everyone, verified_only ou no_one',
    })
    .optional(),
  showInSearchResults: z.boolean().optional(),
  showLastSeen: z.boolean().optional(),

  // ==================== PRÉFÉRENCES ====================
  langue: z
    .enum(['fr', 'en'], {
      message: 'La langue doit être : fr ou en',
    })
    .optional(),
  devise: z
    .enum(['XAF', 'EUR', 'USD'], {
      message: 'La devise doit être : XAF, EUR ou USD',
    })
    .optional(),
  timezone: z
    .string()
    .min(1, 'Le fuseau horaire est requis')
    .optional(),
  dateFormat: z
    .enum(['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'], {
      message: 'Le format de date doit être : dd/MM/yyyy, MM/dd/yyyy ou yyyy-MM-dd',
    })
    .optional(),

  // ==================== RGPD ====================
  cookiesConsent: z.boolean().optional(),
  analyticsConsent: z.boolean().optional(),
  marketingConsent: z.boolean().optional(),
  dataShareConsent: z.boolean().optional(),

  // ==================== SÉCURITÉ ====================
  twoFactorEnabled: z.boolean().optional(),
  loginNotifications: z.boolean().optional(),
});

// Schémas partiels pour chaque section (utile pour les formulaires par section)
export const notificationSettingsSchema = z.object({
  emailNotificationsEnabled: z.boolean(),
  smsNotificationsEnabled: z.boolean(),
  pushNotificationsEnabled: z.boolean(),
  notifyOnNewMessage: z.boolean(),
  notifyOnMatchingVoyage: z.boolean(),
  notifyOnMatchingDemande: z.boolean(),
  notifyOnNewAvis: z.boolean(),
  notifyOnFavoriUpdate: z.boolean(),
});

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'verified_only', 'private']),
  showPhone: z.boolean(),
  showEmail: z.boolean(),
  showStats: z.boolean(),
  messagePermission: z.enum(['everyone', 'verified_only', 'no_one']),
  showInSearchResults: z.boolean(),
  showLastSeen: z.boolean(),
});

export const preferencesSettingsSchema = z.object({
  langue: z.enum(['fr', 'en']),
  devise: z.enum(['XAF', 'EUR', 'USD']),
  timezone: z.string().min(1),
  dateFormat: z.enum(['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd']),
});

export const rgpdSettingsSchema = z.object({
  cookiesConsent: z.boolean(),
  analyticsConsent: z.boolean(),
  marketingConsent: z.boolean(),
  dataShareConsent: z.boolean(),
});

export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean(),
  loginNotifications: z.boolean(),
});

// Types inférés
export type UpdateSettingsFormData = z.infer<typeof updateSettingsSchema>;
export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
export type PrivacySettingsFormData = z.infer<typeof privacySettingsSchema>;
export type PreferencesSettingsFormData = z.infer<typeof preferencesSettingsSchema>;
export type RgpdSettingsFormData = z.infer<typeof rgpdSettingsSchema>;
export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>;