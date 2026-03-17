import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Authenticate the user via their session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { community_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { community_id } = body;
  if (!community_id) {
    return NextResponse.json({ error: 'community_id is required' }, { status: 400 });
  }

  // Use admin client to bypass RLS for all DB operations
  const adminClient = createAdminClient();

  // Check if already a member
  const { data: existing } = await adminClient
    .from('community_members')
    .select('id, status')
    .eq('community_id', community_id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ success: true, status: existing.status });
  }

  // Fetch community to check type
  const { data: community, error: communityError } = await adminClient
    .from('communities')
    .select('id, type, is_active')
    .eq('id', community_id)
    .single();

  if (communityError || !community) {
    return NextResponse.json({ error: 'Community not found' }, { status: 404 });
  }

  if (!community.is_active) {
    return NextResponse.json({ error: 'Community is not active' }, { status: 400 });
  }

  const status: 'approved' | 'pending' =
    community.type === 'interest' ? 'approved' : 'pending';

  const { error: insertError } = await adminClient.from('community_members').insert({
    community_id,
    user_id: user.id,
    role: 'member',
    status,
    joined_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error('community_members insert error:', insertError);
    return NextResponse.json({ error: 'Failed to join community' }, { status: 500 });
  }

  return NextResponse.json({ success: true, status });
}
