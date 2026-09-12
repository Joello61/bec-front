import { z } from 'zod';

// ==================== CHECKOUT ABONNEMENT ====================
// Deux cases a cocher distinctes, jamais fusionnees en une seule (art. L.221-28 13°
// Code de la consommation - la renonciation au droit de retractation de 14 jours doit
// etre un consentement expres et separe de l'accord pour un acces immediat). Les champs
// restent des z.boolean() (et non z.literal(true)) pour que le type infere reste
// compatible avec un defaultValues à `false` cote react-hook-form ; l'obligation
// "doit valoir true" est portee par superRefine, avec un message par champ.
export const checkoutConsentSchema = z
  .object({
    planCode: z.string().min(1, 'Le plan est obligatoire'),
    accessImmediateConsent: z.boolean(),
    withdrawalWaiverConsent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.accessImmediateConsent) {
      ctx.addIssue({
        code: 'custom',
        path: ['accessImmediateConsent'],
        message: "Vous devez accepter un accès immédiat au service pour continuer",
      });
    }
    if (!data.withdrawalWaiverConsent) {
      ctx.addIssue({
        code: 'custom',
        path: ['withdrawalWaiverConsent'],
        message: 'Vous devez renoncer expressément à votre droit de rétractation pour continuer',
      });
    }
  });

export type CheckoutConsentFormData = z.infer<typeof checkoutConsentSchema>;
