import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  let body: { email?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 422 });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email, name: body.name?.trim() ?? null, subscribed: true }, { onConflict: 'email' });

  if (error) {
    console.error('[newsletter/subscribe]', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
