import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

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

  // Use admin client to bypass RLS
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('community_members')
    .delete()
    .eq('community_id', community_id)
    .eq('user_id', user.id);

  if (error) {
    console.error('community_members delete error:', error);
    return NextResponse.json({ error: 'Failed to leave community' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
