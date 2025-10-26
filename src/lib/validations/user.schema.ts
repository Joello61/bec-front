import { z } from 'zod';

export const updateUserSchema = z.object({
  nom: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .optional(),
  
  prenom: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne peut pas dépasser 100 caractères')
    .optional(),
  
  telephone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      'Numéro invalide. Format international: +33612345678 ou +237612345678'
    )
    .optional()
    .or(z.literal('')),
  
  bio: z
    .string()
    .max(500, 'La bio ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
});

export const searchUserSchema = z.object({
  query: z
    .string()
    .min(2, 'La recherche doit contenir au moins 2 caractères')
    .max(100, 'La recherche ne peut pas dépasser 100 caractères'),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type SearchUserFormData = z.infer<typeof searchUserSchema>;