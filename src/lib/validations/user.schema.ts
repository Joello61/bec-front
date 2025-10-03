import { z } from 'zod';

export const updateUserSchema = z.object({
  nom: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .optional(),
  prenom: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .optional(),
  telephone: z
    .string()
    .regex(/^(\+237)?[0-9]{9}$/, 'Numéro de téléphone invalide (format: +237XXXXXXXXX)')
    .optional(),
  bio: z
    .string()
    .max(500, 'La bio ne peut pas dépasser 500 caractères')
    .optional(),
  photo: z
    .string()
    .url('URL de photo invalide')
    .optional(),
});

export const searchUserSchema = z.object({
  query: z
    .string()
    .min(2, 'La recherche doit contenir au moins 2 caractères')
    .max(100, 'La recherche ne peut pas dépasser 100 caractères'),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type SearchUserFormData = z.infer<typeof searchUserSchema>;