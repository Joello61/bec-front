import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'L\'email est requis').email('Email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

// ==================== REGISTER SCHEMA MODIFIÉ ====================
// Téléphone retiré, sera demandé dans completeProfile
export const registerSchema = z
  .object({
    nom: z
      .string()
      .min(1, 'Le nom est requis')
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    prenom: z
      .string()
      .min(1, 'Le prénom est requis')
      .min(2, 'Le prénom doit contenir au moins 2 caractères')
      .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
    email: z.string().min(1, 'L\'email est requis').email('Email invalide'),
    password: z
      .string()
      .min(1, 'Le mot de passe est requis')
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
    // ❌ telephone retiré
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

// ==================== NOUVEAU : COMPLETE PROFILE SCHEMA ====================
export const completeProfileSchema = z
  .object({
    telephone: z
      .string()
      .min(1, 'Le téléphone est requis')
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        'Numéro invalide. Format: +237612345678 ou +33612345678'
      ),
    pays: z
      .string()
      .min(1, 'Le pays est requis')
      .min(2, 'Le pays doit contenir au moins 2 caractères'),
    ville: z
      .string()
      .min(1, 'La ville est requise')
      .min(2, 'La ville doit contenir au moins 2 caractères'),
    
    // Champs conditionnels - tous optionnels par défaut
    quartier: z.string().optional().or(z.literal('')),
    adresseLigne1: z.string().optional().or(z.literal('')),
    adresseLigne2: z.string().optional().or(z.literal('')),
    codePostal: z.string().optional().or(z.literal('')),
    
    // Optionnels
    bio: z
      .string()
      .max(500, 'La bio ne peut pas dépasser 500 caractères')
      .optional()
      .or(z.literal('')),
    photo: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      // Au moins un format d'adresse doit être rempli
      const hasQuartier = data.quartier && data.quartier.trim().length > 0;
      const hasDiasporaAddress = 
        data.adresseLigne1 && 
        data.adresseLigne1.trim().length > 0 && 
        data.codePostal && 
        data.codePostal.trim().length > 0;
      
      return hasQuartier || hasDiasporaAddress;
    },
    {
      message: 'Vous devez fournir soit un quartier (format Afrique), soit une adresse complète avec code postal (format Diaspora)',
      path: ['quartier'],
    }
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z
      .string()
      .min(1, 'Le nouveau mot de passe est requis')
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmNewPassword: z
      .string()
      .min(1, 'Veuillez confirmer le nouveau mot de passe'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmNewPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'L\'email est requis').email('Email invalide'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token invalide'),
    newPassword: z
      .string()
      .min(1, 'Le mot de passe est requis')
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(1, 'Le code est requis')
    .length(6, 'Le code doit contenir 6 chiffres')
    .regex(/^\d{6}$/, 'Le code doit contenir uniquement des chiffres'),
});

export const verifyPhoneSchema = z.object({
  code: z
    .string()
    .min(1, 'Le code est requis')
    .length(6, 'Le code doit contenir 6 chiffres')
    .regex(/^\d{6}$/, 'Le code doit contenir uniquement des chiffres'),
});

// ==================== TYPES EXPORTÉS ====================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type VerifyPhoneFormData = z.infer<typeof verifyPhoneSchema>;