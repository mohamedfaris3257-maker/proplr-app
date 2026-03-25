import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized — please log in again' }, { status: 401 });
  }

  let body: { community_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { community_id } = body;
  if (!community_id) {
    return NextResponse.json({ error: 'community_id is required' }, { status: 400 });
  }

  // Use admin client to bypass RLS, fall back to session client
  const admin = tryCreateAdminClient();
  const db = admin || supabase;
  const clientType = admin ? 'admin' : 'session';
  console.log(`[Join] Using ${clientType} client for user ${user.id}`);

  // Check if already a member
  const { data: existing, error: existingError } = await db
    .from('community_members')
    .select('id, status')
    .eq('community_id', community_id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingError) {
    console.error('[Join] Check existing error:', existingError);
    return NextResponse.json({
      error: `Database error checking membership: ${existingError.message}`,
    }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ success: true, status: existing.status });
  }

  // Fetch community to check type
  const { data: community, error: communityError } = await db
    .from('communities')
    .select('id, type, is_active')
    .eq('id', community_id)
    .single();

  if (communityError || !community) {
    console.error('[Join] Fetch community error:', communityError);
    return NextResponse.json({
      error: communityError ? `Database error: ${communityError.message}` : 'Community not found',
    }, { status: 404 });
  }

  if (!community.is_active) {
    return NextResponse.json({ error: 'This community is currently inactive' }, { status: 400 });
  }

  const status: 'approved' | 'pending' =
    community.type === 'interest' ? 'approved' : 'pending';

  const { data: inserted, error: insertError } = await db
    .from('community_members')
    .insert({
      community_id,
      user_id: user.id,
      role: 'member',
      status,
    })
    .select()
    .single();

  if (insertError) {
    console.error('[Join] Insert error:', insertError);
    // Check for unique constraint violation (already a member)
    if (insertError.code === '23505') {
      return NextResponse.json({ success: true, status: 'existing' });
    }
    return NextResponse.json({
      error: `Failed to join: ${insertError.message}`,
    }, { status: 500 });
  }

  if (!inserted) {
    console.error('[Join] Insert returned no data — likely blocked by RLS');
    return NextResponse.json({
      error: 'Join failed — please try again or contact support.',
    }, { status: 500 });
  }

  console.log(`[Join] Success: user ${user.id} joined community ${community_id} as ${status}`);
  return NextResponse.json({ success: true, status });
}
