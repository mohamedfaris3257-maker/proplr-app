import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET — fetch all pending community join requests across all communities
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

  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from('community_members')
    .select('id, user_id, role, status, joined_at, community_id, profiles(name, email, photo_url), communities(name, type)')
    .eq('status', 'pending')
    .order('joined_at', { ascending: false });

  if (error) {
    console.error('Fetch pending requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch pending requests' }, { status: 500 });
  }

  return NextResponse.json({ success: true, requests: data || [] });
}
