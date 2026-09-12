import { z } from 'zod';

// ==================== CHECKOUT BOOST ====================
// Meme raisonnement legal que checkoutConsentSchema (subscription.schema.ts) : service
// a execution immediate, double consentement expres et separe requis (art. L.221-28 13°
// Code de la consommation). z.boolean() (et non z.literal(true)) pour rester compatible
// avec un defaultValues a false cote react-hook-form ; l'obligation est portee par
// superRefine, avec un message par champ.
export const checkoutBoostConsentSchema = z
  .object({
    targetType: z.enum(['voyage', 'demande']),
    targetId: z.number().int().positive(),
    offerId: z.number().int().positive({ message: "Veuillez choisir une durée de boost" }),
    paymentMethod: z.enum(['card', 'mobile_money']),
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

export type CheckoutBoostConsentFormData = z.infer<typeof checkoutBoostConsentSchema>;
