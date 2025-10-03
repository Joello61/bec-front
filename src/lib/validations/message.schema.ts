import { z } from 'zod';

export const sendMessageSchema = z.object({
  destinataireId: z
    .number({
        error: 'ID destinataire invalide',
    })
    .positive('ID destinataire invalide'),
  contenu: z
    .string()
    .min(1, 'Le message ne peut pas être vide')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères')
    .refine(
      (text) => text.trim().length > 0,
      'Le message ne peut pas contenir uniquement des espaces'
    ),
});

export type SendMessageFormData = z.infer<typeof sendMessageSchema>;