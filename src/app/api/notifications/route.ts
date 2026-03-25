import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// GET — fetch notifications for current user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;

  const { data: notifications, error } = await db
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('[Notifications GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const unreadCount = (notifications || []).filter((n: any) => !n.is_read).length;

  return NextResponse.json({ notifications: notifications || [], unreadCount });
}

// PATCH — mark notifications as read
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;
  const { notification_id, mark_all } = await req.json();

  if (mark_all) {
    const { error } = await db
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (notification_id) {
    const { error } = await db
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notification_id)
      .eq('user_id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'notification_id or mark_all required' }, { status: 400 });
}
