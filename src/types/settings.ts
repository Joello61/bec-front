export type ProfileVisibility = 'public' | 'verified_only' | 'private';
export type MessagePermission = 'everyone' | 'verified_only' | 'no_one';
export type Langue = 'fr' | 'en';
export type Devise = 'XAF' | 'EUR' | 'USD';
export type DateFormat = 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';

export interface UserSettings {
  id: number;
  
  // Notifications
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  notifyOnNewMessage: boolean;
  notifyOnMatchingVoyage: boolean;
  notifyOnMatchingDemande: boolean;
  notifyOnNewAvis: boolean;
  notifyOnFavoriUpdate: boolean;
  
  // Confidentialité
  profileVisibility: ProfileVisibility;
  showPhone: boolean;
  showEmail: boolean;
  showStats: boolean;
  messagePermission: MessagePermission;
  showInSearchResults: boolean;
  showLastSeen: boolean;
  
  // Préférences
  langue: Langue;
  devise: Devise;
  timezone: string;
  dateFormat: DateFormat;
  
  // RGPD
  cookiesConsent: boolean;
  analyticsConsent: boolean;
  marketingConsent: boolean;
  dataShareConsent: boolean;
  consentDate: string | null;
  
  // Sécurité
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsInput {
  // Notifications
  emailNotificationsEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
  notifyOnNewMessage?: boolean;
  notifyOnMatchingVoyage?: boolean;
  notifyOnMatchingDemande?: boolean;
  notifyOnNewAvis?: boolean;
  notifyOnFavoriUpdate?: boolean;
  
  // Confidentialité
  profileVisibility?: ProfileVisibility;
  showPhone?: boolean;
  showEmail?: boolean;
  showStats?: boolean;
  messagePermission?: MessagePermission;
  showInSearchResults?: boolean;
  showLastSeen?: boolean;
  
  // Préférences
  langue?: Langue;
  devise?: Devise;
  timezone?: string;
  dateFormat?: DateFormat;
  
  // RGPD
  cookiesConsent?: boolean;
  analyticsConsent?: boolean;
  marketingConsent?: boolean;
  dataShareConsent?: boolean;
  
  // Sécurité
  twoFactorEnabled?: boolean;
  loginNotifications?: boolean;
}

export interface ExportedUserData {
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    telephone: string | null;
    bio: string | null;
    emailVerifie: boolean;
    telephoneVerifie: boolean;
    authProvider: string;
    createdAt: string;
  };
  settings: {
    notifications: Record<string, boolean>;
    privacy: Record<string, boolean | string>;
    preferences: Record<string, string>;
    rgpd: Record<string, boolean | string | null>;
  };
  voyages: number;
  demandes: number;
  messages: number;
  avis: number;
}