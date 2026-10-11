import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BrandMark } from '@/components/brand-mark';
import { verifyZiinaPayment } from '@/server/ziina.functions';

export const Route = createFileRoute('/checkout/result')({
  validateSearch: (search: Record<string, unknown>) => ({
    payment_intent_id: typeof search.payment_intent_id === 'string' ? search.payment_intent_id : '',
  }),
  head: () => ({
    meta: [
      { title: 'Payment | TalentIQ360' },
      { name: 'description', content: 'Ziina payment result for TalentIQ360. A payment is confirmed only after Ziina reports it as completed.' },
    ],
  }),
  component: CheckoutResult,
});

function CheckoutResult() {
  const { payment_intent_id } = Route.useSearch();
  const [state, setState] = useState<'loading' | 'completed' | 'canceled' | 'failed' | 'pending' | 'error'>('loading');
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!payment_intent_id) {
      setState('error');
      return;
    }
    let active = true;
    verifyZiinaPayment({ data: { paymentIntentId: payment_intent_id } })
      .then((result) => {
        if (!active) return;
        if ('error' in result && result.error) {
          setState('error');
          return;
        }
        if (!('status' in result)) {
          setState('error');
          return;
        }
        setAmount(result.amountAed);
        if (result.status === 'completed') setState('completed');
        else if (result.status === 'canceled') setState('canceled');
        else if (result.status === 'failed') setState('failed');
        else setState('pending');
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [payment_intent_id]);

  const copy = {
    loading: ['Checking the payment with Ziina.', 'This page does not confirm a charge until Ziina responds.'],
    completed: [`Payment received${amount !== null ? ` for AED ${amount.toLocaleString('en-AE')}` : ''}.`, 'Ziina marked this payment completed. It does not renew automatically, and it does not include a later subscription.'],
    canceled: ['The payment was canceled.', 'Ziina does not show this payment as completed.'],
    failed: ['The payment failed.', 'Ziina does not show this payment as completed.'],
    pending: ['Ziina has not completed this payment yet.', 'Wait for Ziina to finish, then refresh this page. Do not assume the charge succeeded.'],
    error: ['This payment could not be verified.', 'Do not assume a charge succeeded. Contact the team if money left your account.'],
  }[state];

  return (
    <main className="min-h-dvh bg-background px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-lg min-w-0">
        <Link to="/" className="brand-lockup font-display font-extrabold text-lg sm:text-xl"><BrandMark />TalentIQ360</Link>
        <p className="eyebrow mt-12">Ziina</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-4 text-balance">{state === 'loading' ? 'Checking payment' : state === 'completed' ? 'Payment received' : 'Payment not completed'}</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed" role="status">{copy[0]} {copy[1]}</p>
        <Link to="/" className="inline-flex min-h-11 items-center mt-8 text-sm text-highlight">Back to TalentIQ360</Link>
      </div>
    </main>
  );
}
