import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[stripe/webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  // Use service-role client — no user context in webhooks
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const planId = session.metadata?.plan_id;
    const userId = session.metadata?.user_id;
    const promoCodeId = session.metadata?.promo_code_id ?? null;

    if (!planId) {
      console.warn('[stripe/webhook] checkout.session.completed missing plan_id metadata');
      return NextResponse.json({ received: true });
    }

    // Resolve the user: prefer metadata user_id, fallback to email lookup
    let resolvedUserId: string | null = userId ?? null;

    if (!resolvedUserId && session.customer_email) {
      const { data: profileByEmail } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('email', session.customer_email)
        .single();

      if (profileByEmail) {
        resolvedUserId = profileByEmail.user_id as string;
      }
    }

    if (!resolvedUserId) {
      console.warn('[stripe/webhook] Could not resolve user for session', session.id);
      return NextResponse.json({ received: true });
    }

    const amountPaid =
      session.amount_total != null ? session.amount_total / 100 : null;

    // Upsert enrolment record
    const { error: enrolError } = await supabaseAdmin
      .from('student_enrolments')
      .upsert(
        {
          user_id: resolvedUserId,
          plan_id: planId,
          amount_paid_aed: amountPaid,
          stripe_session_id: session.id,
          status: 'active',
        },
        { onConflict: 'stripe_session_id' }
      );

    if (enrolError) {
      console.error('[stripe/webhook] student_enrolments upsert error:', enrolError);
    }

    // Update profile subscription status
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'premium',
        dibz_discount_active: true,
      })
      .eq('user_id', resolvedUserId);

    if (profileError) {
      console.error('[stripe/webhook] profiles update error:', profileError);
    }

    // Increment promo code usage if one was applied
    if (promoCodeId) {
      const { data: promo } = await supabaseAdmin
        .from('promo_codes')
        .select('usage_count')
        .eq('id', promoCodeId)
        .single();

      if (promo) {
        await supabaseAdmin
          .from('promo_codes')
          .update({ usage_count: (promo.usage_count as number) + 1 })
          .eq('id', promoCodeId);
      }
    }

    console.log('[stripe/webhook] Enrolment processed for user', resolvedUserId, 'plan', planId);
  }

  return NextResponse.json({ received: true });
}
