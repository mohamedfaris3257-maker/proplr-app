import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

/**
 * GET — fetch members for a community (used by admin panel)
 * Query: ?community_id=xxx
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const communityId = req.nextUrl.searchParams.get('community_id');
  if (!communityId) {
    return NextResponse.json({ error: 'community_id is required' }, { status: 400 });
  }

  // Use admin client to bypass RLS so admins can see all members
  const adminClient = tryCreateAdminClient() || supabase;

  const { data, error } = await adminClient
    .from('community_members')
    .select('id, user_id, role, status, joined_at, profiles(name, email, photo_url)')
    .eq('community_id', communityId)
    .order('joined_at', { ascending: true });

  if (error) {
    console.error('community_members fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }

  return NextResponse.json({ success: true, members: data || [] });
}

/**
 * PATCH — approve or reject a community member
 * Body: { member_id: string, action: 'approve' | 'reject' }
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

  let body: { member_id?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { member_id, action } = body;
  if (!member_id || !action || !['approve', 'reject'].includes(action)) {
    return NextResponse.json(
      { error: 'member_id and action (approve|reject) are required' },
      { status: 400 }
    );
  }

  const newStatus = action === 'approve' ? 'approved' : 'rejected';

  // Use admin client to bypass RLS
  const adminClient = tryCreateAdminClient() || supabase;

  const { data: updated, error: updateError } = await adminClient
    .from('community_members')
    .update({ status: newStatus })
    .eq('id', member_id)
    .select()
    .maybeSingle();

  if (updateError) {
    console.error('community_members update error:', updateError);
    return NextResponse.json({ error: `Failed to update member: ${updateError.message}` }, { status: 500 });
  }

  if (!updated) {
    console.error('[PATCH members] Update returned 0 rows — likely blocked by RLS. User:', user.id, 'Member:', member_id);
    return NextResponse.json({
      error: 'Update failed — you may not have permission. Ensure your profile type is "admin" and the SUPABASE_SERVICE_ROLE_KEY env var is set.',
    }, { status: 403 });
  }

  return NextResponse.json({ success: true, status: newStatus });
}

/**
 * DELETE — remove a community member
 * Body: { member_id: string }
 */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { member_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { member_id } = body;
  if (!member_id) {
    return NextResponse.json({ error: 'member_id is required' }, { status: 400 });
  }

  // Use admin client to bypass RLS
  const adminClient = tryCreateAdminClient() || supabase;

  const { data: deleted, error: deleteError } = await adminClient
    .from('community_members')
    .delete()
    .eq('id', member_id)
    .select()
    .maybeSingle();

  if (deleteError) {
    console.error('community_members delete error:', deleteError);
    return NextResponse.json({ error: `Failed to remove member: ${deleteError.message}` }, { status: 500 });
  }

  if (!deleted) {
    return NextResponse.json({
      error: 'Remove failed — member not found or insufficient permissions.',
    }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
