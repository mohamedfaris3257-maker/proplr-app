import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SendNotificationBody {
  target: 'all' | 'community' | 'individual';
  target_id?: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}

export async function POST(req: NextRequest) {
  // Verify the caller is an authenticated admin
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('type')
    .eq('user_id', user.id)
    .single();

  if (profile?.type !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: SendNotificationBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { target, target_id, title, message, type, link } = body;

  if (!target || !title?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'target, title, and message are required.' },
      { status: 422 }
    );
  }

  if ((target === 'community' || target === 'individual') && !target_id) {
    return NextResponse.json(
      { error: 'target_id is required for community or individual targets.' },
      { status: 422 }
    );
  }

  let userIds: string[] = [];

  if (target === 'all') {
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('user_id');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch profiles.' },
        { status: 500 }
      );
    }
    userIds = (profiles ?? []).map((p: { user_id: string }) => p.user_id);
  } else if (target === 'community') {
    const { data: members, error } = await supabaseAdmin
      .from('community_members')
      .select('user_id')
      .eq('community_id', target_id!)
      .eq('status', 'approved');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch community members.' },
        { status: 500 }
      );
    }
    userIds = (members ?? []).map((m: { user_id: string }) => m.user_id);
  } else if (target === 'individual') {
    userIds = [target_id!];
  }

  if (userIds.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const notifications = userIds.map((user_id) => ({
    user_id,
    type: type || 'general',
    title: title.trim(),
    message: message.trim(),
    is_read: false,
    link: link?.trim() || null,
  }));

  // Insert in batches of 500 to avoid payload limits
  const BATCH_SIZE = 500;
  let totalSent = 0;

  for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
    const batch = notifications.slice(i, i + BATCH_SIZE);
    const { error } = await supabaseAdmin
      .from('notifications')
      .insert(batch);

    if (!error) {
      totalSent += batch.length;
    }
  }

  return NextResponse.json({ sent: totalSent });
}
