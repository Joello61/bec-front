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
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

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