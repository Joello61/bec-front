import { z } from 'zod';

export const createContactSchema = z.object({
  nom: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Email invalide'),
  
  sujet: z
    .string()
    .min(1, 'Le sujet est requis')
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(255, 'Le sujet ne peut pas dépasser 255 caractères'),
  
  message: z
    .string()
    .min(1, 'Le message est requis')
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(5000, 'Le message ne peut pas dépasser 5000 caractères'),
});

export type CreateContactFormData = z.infer<typeof createContactSchema>;