import type { UserSettings } from './settings';
import type { Address } from './address';

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  photo: string | null;
  bio: string | null;
  emailVerifie: boolean;
  telephoneVerifie: boolean;
  authProvider?: 'local' | 'google' | 'facebook';
  roles: string[];
  createdAt: string;
  settings?: UserSettings;
  isBanned: boolean;
  bannedAt?: string | null;
  banReason?: string | null;
  bannedBy?: User | null;
  noteAvisMoyen: number | null;
  
  // ==================== RELATION ADRESSE ====================
  address: Address | null;
  
  // Helper pour savoir si le profil est complet
  isProfileComplete?: boolean;
}

// ==================== REGISTER INPUT (inchangé) ====================
export interface RegisterInput {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

// ==================== COMPLETE PROFILE INPUT ====================
export interface CompleteProfileInput {
  telephone: string;
  pays: string;
  ville: string;
  
  // Format Afrique OU Diaspora (au moins un doit être fourni)
  quartier?: string;
  adresseLigne1?: string;
  adresseLigne2?: string;
  codePostal?: string;
  
  // Optionnels
  bio?: string;
  photo?: string;
}

// ==================== PROFILE STATUS ====================
export interface ProfileStatus {
  isComplete: boolean;
  missing: string[];
  emailVerifie: boolean;
  telephoneVerifie: boolean;
  hasAddress: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  nom?: string;
  prenom?: string;
  telephone?: string;
  bio?: string;
  photo?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface VerifyEmailInput {
  code: string;
  email: string;
}

export interface VerifyPhoneInput {
  code: string;
}

export interface ResendVerificationInput {
  type: 'email' | 'phone';
  email?: string;
}