import { createServerFn } from '@tanstack/react-start';

function checkoutInput(data: unknown) {
  if (!data || typeof data !== 'object') throw new Error('Invalid checkout request.');
  const planId = 'planId' in data ? data.planId : undefined;
  const origin = 'origin' in data ? data.origin : undefined;
  if (typeof planId !== 'string' || typeof origin !== 'string') throw new Error('Invalid checkout request.');
  return { planId, origin };
}

function verifyInput(data: unknown) {
  if (!data || typeof data !== 'object' || !('paymentIntentId' in data) || typeof data.paymentIntentId !== 'string') {
    throw new Error('Invalid payment lookup.');
  }
  return { paymentIntentId: data.paymentIntentId };
}

export const createZiinaCheckout = createServerFn({ method: 'POST' })
  .validator(checkoutInput)
  .handler(async ({ data }) => {
    const { createZiinaPayment } = await import('./ziina.server');
    return createZiinaPayment(data);
  });

export const verifyZiinaPayment = createServerFn({ method: 'POST' })
  .validator(verifyInput)
  .handler(async ({ data }) => {
    const { readZiinaPayment } = await import('./ziina.server');
    return readZiinaPayment(data.paymentIntentId);
  });
