import { z } from 'zod';

export const createAvisSchema = z.object({
  cibleId: z
    .number({
        error: 'ID utilisateur invalide',
    })
    .positive('ID utilisateur invalide'),
  voyageId: z
    .number()
    .positive('ID voyage invalide')
    .optional(),
  note: z
    .number({
        error: 'La note doit être un nombre',
    })
    .min(1, 'La note minimum est 1')
    .max(5, 'La note maximum est 5')
    .int('La note doit être un nombre entier'),
  commentaire: z
    .string()
    .max(500, 'Le commentaire ne peut pas dépasser 500 caractères')
    .optional(),
});

export type CreateAvisFormData = z.infer<typeof createAvisSchema>;