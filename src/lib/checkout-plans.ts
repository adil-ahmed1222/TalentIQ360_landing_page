export const CHECKOUT_PLANS = {
  core: {
    id: 'core',
    name: 'Core Intelligence',
    aed: 999,
    fils: 99900,
    message: 'Core Intelligence, AED 999 once. No auto-renew. Excl. VAT.',
  },
  growth: {
    id: 'growth',
    name: 'Growth Intelligence',
    aed: 2999,
    fils: 299900,
    message: 'Growth Intelligence, AED 2,999 once. No auto-renew. Excl. VAT.',
  },
  pro: {
    id: 'pro',
    name: 'Workforce Intelligence Pro',
    aed: 6999,
    fils: 699900,
    message: 'Intelligence Pro, AED 6,999 once. No auto-renew. Excl. VAT.',
  },
  founding: {
    id: 'founding',
    name: 'Founding Partner Pilot',
    aed: 7500,
    fils: 750000,
    message: 'Founding pilot, AED 7,500 once. No auto-renew. Excl. VAT.',
  },
} as const;

export type CheckoutPlanId = keyof typeof CHECKOUT_PLANS;

export function isCheckoutPlanId(value: string): value is CheckoutPlanId {
  return value in CHECKOUT_PLANS;
}
