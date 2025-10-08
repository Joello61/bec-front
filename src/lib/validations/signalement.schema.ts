import { z } from 'zod';

export const createSignalementSchema = z.object({
  voyageId: z
    .number()
    .positive('ID voyage invalide')
    .optional(),
  demandeId: z
    .number()
    .positive('ID demande invalide')
    .optional(),
  messageId: z
    .number()
    .positive('ID message invalide')
    .optional(),
  utilisateurSignaleId: z
    .number()
    .positive('ID utilisateur invalide')
    .optional(),
  motif: z.enum(
    ['contenu_inapproprie', 'spam', 'arnaque', 'objet_illegal', 'autre'],
    {
        error: 'Motif invalide',
    }
  ),
  description: z
    .string()
    .min(1, 'La description est requise')
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
}).refine(
  (data) => data.voyageId || data.demandeId || data.messageId || data.utilisateurSignaleId,
  'Vous devez signaler au moins un élément (voyage, demande, message ou utilisateur)'
);

export const traiterSignalementSchema = z.object({
  statut: z.enum(['traite', 'rejete'], {
    error: 'Statut invalide',
  }),
  reponseAdmin: z
    .string()
    .max(500, 'La réponse ne peut pas dépasser 500 caractères')
    .optional(),
});

export type CreateSignalementFormData = z.infer<typeof createSignalementSchema>;
export type TraiterSignalementFormData = z.infer<typeof traiterSignalementSchema>;