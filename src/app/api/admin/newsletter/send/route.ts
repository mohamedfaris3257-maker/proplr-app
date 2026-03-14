import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase.from('profiles').select('type').eq('user_id', user.id).single();
  if (profile?.type !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { subject?: string; html?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { subject, html } = body;
  if (!subject?.trim() || !html?.trim()) {
    return NextResponse.json({ error: 'Subject and html are required' }, { status: 422 });
  }

  const { data: subscribers, error: fetchError } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('subscribed', true);

  if (fetchError) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }

  const emails = (subscribers ?? []).map((s: { email: string }) => s.email);
  if (emails.length === 0) {
    return NextResponse.json({ success: true, sent: 0 });
  }

  // Send in batches of 50 (Resend limit)
  const BATCH = 50;
  let sent = 0;
  for (let i = 0; i < emails.length; i += BATCH) {
    const batch = emails.slice(i, i + BATCH);
    const result = await sendEmail({ to: batch, subject: subject.trim(), html: html.trim() });
    if (result.ok) sent += batch.length;
  }

  return NextResponse.json({ success: true, sent });
}
