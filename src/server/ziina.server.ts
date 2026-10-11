import { CHECKOUT_PLANS, isCheckoutPlanId } from '@/lib/checkout-plans';

const ZIINA_PAYMENT_INTENT = 'https://api-v2.ziina.com/api/payment_intent';

type ZiinaIntent = {
  id?: string;
  status?: string;
  amount?: number;
  currency_code?: string;
  redirect_url?: string;
  code?: string;
};

function ziinaKey() {
  const key = process.env.ZIINA_API_KEY?.trim();
  if (!key) throw new Error('Ziina is not configured.');
  return key;
}

function privateHost(hostname: string) {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') return true;
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  if (parts[0] === 10 || parts[0] === 127) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  return parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31;
}

function allowedOrigin(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const local = url.protocol === 'http:' && privateHost(url.hostname);
  const production = url.protocol === 'https:' && url.hostname === 'talent-iq-360-landing-page.vercel.app';
  if (!local && !production) return null;
  return url.origin;
}

async function ziinaFetch(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(20000),
    headers: {
      Authorization: `Bearer ${ziinaKey()}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const body = (await response.json().catch(() => null)) as ZiinaIntent | null;
  return { response, body };
}

async function rememberIntent(intent: ZiinaIntent, planId: string) {
  if (!intent.id) return;
  try {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.from('ziina_payments').insert({
      payment_intent_id: intent.id,
      plan_id: planId,
      amount_fils: intent.amount ?? 0,
      currency_code: intent.currency_code ?? 'AED',
      status: intent.status ?? 'requires_payment_instrument',
    });
    if (error) console.error('Ziina payment record was not saved.', error.code);
  } catch (error) {
    console.error('Ziina payment record was not saved.', error instanceof Error ? error.message : 'unknown');
  }
}

export async function createZiinaPayment(input: { planId: string; origin: string }) {
  if (!isCheckoutPlanId(input.planId)) return { error: 'That plan cannot be paid online.' };
  const origin = allowedOrigin(input.origin);
  if (!origin) return { error: 'Checkout cannot start from this address.' };
  const plan = CHECKOUT_PLANS[input.planId];
  const test = process.env.ZIINA_TEST_MODE === 'true';
  try {
    const { response, body } = await ziinaFetch(ZIINA_PAYMENT_INTENT, {
      method: 'POST',
      body: JSON.stringify({
        amount: plan.fils,
        currency_code: 'AED',
        message: plan.message,
        success_url: `${origin}/checkout/result?payment_intent_id={PAYMENT_INTENT_ID}`,
        cancel_url: `${origin}/checkout/result?payment_intent_id={PAYMENT_INTENT_ID}`,
        failure_url: `${origin}/checkout/result?payment_intent_id={PAYMENT_INTENT_ID}`,
        test,
        allow_tips: false,
        operation_id: crypto.randomUUID(),
      }),
    });
    if (!response.ok || !body?.redirect_url) {
      const code = body && typeof body === 'object' && 'code' in body ? String(body.code) : '';
      console.error('Ziina payment intent failed.', response.status, code);
      return { error: 'Ziina could not open the payment page. You have not been charged.' };
    }
    await rememberIntent(body, plan.id);
    return { redirectUrl: body.redirect_url };
  } catch (error) {
    console.error('Ziina payment intent failed.', error instanceof Error ? error.message : 'unknown');
    return { error: 'Ziina could not open the payment page. You have not been charged.' };
  }
}

export async function readZiinaPayment(paymentIntentId: string) {
  if (!/^[A-Za-z0-9_-]{6,128}$/.test(paymentIntentId)) return { error: 'This payment could not be verified.' };
  try {
    const { response, body } = await ziinaFetch(`${ZIINA_PAYMENT_INTENT}/${encodeURIComponent(paymentIntentId)}`);
    if (!response.ok || !body?.status) {
      console.error('Ziina payment lookup failed.', response.status);
      return { error: 'This payment could not be verified. Do not assume it succeeded.' };
    }
    if (body.id) {
      try {
        const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
        await supabaseAdmin.from('ziina_payments').update({ status: body.status }).eq('payment_intent_id', body.id);
      } catch {
        // The payment page remains the source of truth if the local table is unavailable.
      }
    }
    const fils = typeof body.amount === 'number' ? body.amount : 0;
    return {
      status: body.status,
      amountAed: fils / 100,
      currency: body.currency_code ?? 'AED',
    };
  } catch (error) {
    console.error('Ziina payment lookup failed.', error instanceof Error ? error.message : 'unknown');
    return { error: 'This payment could not be verified. Do not assume it succeeded.' };
  }
}
