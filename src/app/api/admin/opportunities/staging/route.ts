import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// GET — list staging opportunities
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;
  const { data: profile } = await db
    .from('profiles')
    .select('type')
    .eq('user_id', user.id)
    .single();

  if (profile?.type !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { data: staging, error } = await db
    .from('opportunities')
    .select('*')
    .eq('status', 'staging')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ opportunities: staging || [] });
}

// PATCH — approve or reject a staging opportunity
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;
  const { data: profile } = await db
    .from('profiles')
    .select('type')
    .eq('user_id', user.id)
    .single();

  if (profile?.type !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const body = await req.json();
  const { id, action } = body; // action: 'approve' | 'reject'

  if (!id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request. Need id and action (approve/reject)' }, { status: 400 });
  }

  if (action === 'approve') {
    const { error } = await db
      .from('opportunities')
      .update({ status: 'approved', is_active: true })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: 'Opportunity approved and activated' });
  }

  if (action === 'reject') {
    const { error } = await db
      .from('opportunities')
      .update({ status: 'rejected', is_active: false })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: 'Opportunity rejected' });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
