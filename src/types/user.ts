import type { UserSettings } from './settings';

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
  
  // ==================== NOUVEAUX CHAMPS ADRESSE ====================
  pays: string | null;
  ville: string | null;
  
  // Format Afrique (Cameroun, etc.)
  quartier: string | null;
  
  // Format Diaspora (Europe, Amérique, etc.)
  adresseLigne1: string | null;
  adresseLigne2: string | null;
  codePostal: string | null;
  
  // Helper pour savoir si le profil est complet
  isProfileComplete?: boolean;
}

// ==================== REGISTER INPUT MODIFIÉ ====================
// Le téléphone n'est plus demandé au register
export interface RegisterInput {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  // ❌ telephone retiré
}

// ==================== NOUVEAU : COMPLETE PROFILE INPUT ====================
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

// ==================== NOUVEAU : PROFILE STATUS ====================
export interface ProfileStatus {
  isComplete: boolean;
  missing: string[]; // ['telephone', 'address', 'email_verification', etc.]
  emailVerifie: boolean;
  telephoneVerifie: boolean;
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
  email: string; // ⬅️ AJOUTÉ : nécessaire pour verify-email
}

export interface VerifyPhoneInput {
  code: string;
}

export interface ResendVerificationInput {
  type: 'email' | 'phone';
  email?: string; // ⬅️ AJOUTÉ : pour resend email
}