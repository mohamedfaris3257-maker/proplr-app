import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

/**
 * GET — fetch all communities with member counts and pending counts
 */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminClient = tryCreateAdminClient() || supabase;

  // Fetch communities and all memberships in parallel
  const [communitiesResult, membershipsResult] = await Promise.all([
    adminClient
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false }),
    adminClient
      .from('community_members')
      .select('community_id, status'),
  ]);

  if (communitiesResult.error) {
    console.error('Fetch communities error:', communitiesResult.error);
    return NextResponse.json({ error: 'Failed to fetch communities' }, { status: 500 });
  }

  const communities = communitiesResult.data || [];
  const memberships = membershipsResult.data || [];

  // Calculate counts per community
  const memberCounts: Record<string, number> = {};
  const pendingCounts: Record<string, number> = {};

  for (const m of memberships) {
    if (m.status === 'approved') {
      memberCounts[m.community_id] = (memberCounts[m.community_id] || 0) + 1;
    } else if (m.status === 'pending') {
      pendingCounts[m.community_id] = (pendingCounts[m.community_id] || 0) + 1;
    }
  }

  const communitiesWithCounts = communities.map((c) => ({
    ...c,
    memberCount: memberCounts[c.id] || 0,
    pendingCount: pendingCounts[c.id] || 0,
  }));

  return NextResponse.json({ success: true, communities: communitiesWithCounts });
}

/**
 * POST — create a new community
 * Body: { name, description?, type, is_active }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { name?: string; description?: string; type?: string; is_active?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, description, type, is_active } = body;
  if (!name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const adminClient = tryCreateAdminClient() || supabase;

  const { data, error } = await adminClient
    .from('communities')
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      type: type || 'interest',
      is_active: is_active ?? true,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Create community error:', error);
    return NextResponse.json({ error: 'Failed to create community' }, { status: 500 });
  }

  return NextResponse.json({ success: true, community: data });
}

/**
 * PATCH — update a community (toggle active, edit details)
 * Body: { id, ...fields_to_update }
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { id?: string; is_active?: boolean; name?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { id, ...updates } = body;
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const adminClient = tryCreateAdminClient() || supabase;

  const { data: updated, error } = await adminClient
    .from('communities')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Update community error:', error);
    return NextResponse.json({ error: `Failed to update community: ${error.message}` }, { status: 500 });
  }

  if (!updated) {
    console.error('[PATCH communities] Update returned 0 rows — likely blocked by RLS. User:', user.id);
    return NextResponse.json({
      error: 'Update failed — you may not have permission. Ensure your profile type is "admin" and the SUPABASE_SERVICE_ROLE_KEY env var is set.',
    }, { status: 403 });
  }

  return NextResponse.json({ success: true, community: updated });
}
