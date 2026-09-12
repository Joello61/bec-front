export type SubscriptionPlanCode = 'free' | 'plus' | 'pro';
export type SubscriptionStatus = 'incomplete' | 'active' | 'past_due' | 'canceled' | 'expired';

export interface SubscriptionPlan {
  id: number;
  code: SubscriptionPlanCode;
  name: string;
  priceAmountEur: string | null;
  priceAmountXaf: string | null;
  billingPeriod: string;
  maxActiveVoyages: number | null;
  maxActiveDemandes: number | null;
  hasBadge: boolean;
  hasViewStats: boolean;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface UserSubscription {
  id: number;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  provider: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  amount: string;
  currency: string;
}

export interface SubscriptionUsage {
  activeVoyages: number;
  maxActiveVoyages: number | null;
  activeDemandes: number;
  maxActiveDemandes: number | null;
}

export interface MySubscriptionResponse {
  plan: SubscriptionPlan;
  subscription: UserSubscription | null;
  usage: SubscriptionUsage;
}

export type PaymentMethod = 'card' | 'mobile_money';

export interface CheckoutSubscriptionInput {
  planCode: string;
  paymentMethod: PaymentMethod;
  accessImmediateConsent: boolean;
  withdrawalWaiverConsent: boolean;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
}
