CREATE TABLE IF NOT EXISTS public.ziina_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_intent_id text UNIQUE NOT NULL,
  plan_id text NOT NULL,
  amount_fils integer NOT NULL CHECK (amount_fils > 0),
  currency_code text NOT NULL DEFAULT 'AED',
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ziina_payments ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.ziina_payments TO service_role;

DROP TRIGGER IF EXISTS ziina_payments_updated_at ON public.ziina_payments;
CREATE TRIGGER ziina_payments_updated_at
  BEFORE UPDATE ON public.ziina_payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
