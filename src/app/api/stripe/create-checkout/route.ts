import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

interface CreateCheckoutBody {
  plan_id: string;
  promo_code?: string;
}

export async function POST(request: Request): Promise<Response> {
  let body: CreateCheckoutBody;
  try {
    body = (await request.json()) as CreateCheckoutBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { plan_id, promo_code } = body;

  if (!plan_id) {
    return NextResponse.json({ error: 'plan_id is required.' }, { status: 400 });
  }

  const supabase = await createClient();

  // Verify the current user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  // Fetch the plan
  const { data: plan, error: planError } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('id', plan_id)
    .eq('is_active', true)
    .single();

  if (planError || !plan) {
    return NextResponse.json({ error: 'Plan not found or inactive.' }, { status: 404 });
  }

  // Optionally validate and apply promo code
  let discountAmount = 0;
  let promoCodeId: string | null = null;

  if (promo_code) {
    const { data: promo } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promo_code.trim().toUpperCase())
      .eq('is_active', true)
      .single();

    if (promo) {
      const now = new Date();
      const notExpired = !promo.expires_at || new Date(promo.expires_at as string) > now;
      const underLimit =
        promo.usage_limit == null || (promo.usage_count as number) < (promo.usage_limit as number);

      if (notExpired && underLimit) {
        promoCodeId = promo.id as string;
        if (promo.discount_type === 'percentage') {
          discountAmount = Math.round(
            (Number(plan.price_aed) * (promo.discount_value as number)) / 100
          );
        } else {
          discountAmount = Math.min(promo.discount_value as number, Number(plan.price_aed));
        }
      }
    }
  }

  const finalAmountAed = Math.max(0, Number(plan.price_aed) - discountAmount);
  const unitAmountCents = Math.round(finalAmountAed * 100);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'aed',
          product_data: {
            name: plan.name as string,
            description: (plan.description as string) || '',
          },
          unit_amount: unitAmountCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${siteUrl}/dashboard/enrolment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/pricing`,
    customer_email: user.email,
    metadata: {
      plan_id,
      user_id: user.id,
      ...(promoCodeId ? { promo_code_id: promoCodeId } : {}),
    },
  };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create(sessionParams);
  } catch (err) {
    console.error('[stripe/create-checkout] Stripe error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: session.url });
}
