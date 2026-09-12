import type { PaymentMethod } from './subscription';

export type BoostTargetType = 'voyage' | 'demande';

export interface BoostOffer {
  id: number;
  name: string;
  durationDays: number;
  priceAmountEur: string;
  priceAmountXaf: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface CheckoutBoostInput {
  targetType: BoostTargetType;
  targetId: number;
  offerId: number;
  paymentMethod: PaymentMethod;
  accessImmediateConsent: boolean;
  withdrawalWaiverConsent: boolean;
}
