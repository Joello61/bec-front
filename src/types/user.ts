import type { UserSettings } from './settings'; // ⬅️ AJOUT

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
  settings?: UserSettings; // ⬅️ AJOUT
  noteAvisMoyen: number | null;
}

// Le reste du fichier reste identique...
export interface RegisterInput {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
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
}

export interface VerifyPhoneInput {
  code: string;
}

export interface ResendVerificationInput {
  type: 'email' | 'phone';
}