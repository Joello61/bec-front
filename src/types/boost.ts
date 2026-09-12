export type BoostTargetType = 'voyage' | 'demande';

export interface BoostOffer {
  id: number;
  name: string;
  durationDays: number;
  priceAmountEur: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CheckoutBoostInput {
  targetType: BoostTargetType;
  targetId: number;
  offerId: number;
  accessImmediateConsent: boolean;
  withdrawalWaiverConsent: boolean;
}
