import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET — fetch all communities (admin) or active communities (student)
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
    .from('communities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch communities error:', error);
    return NextResponse.json({ error: 'Failed to fetch communities' }, { status: 500 });
  }

  return NextResponse.json({ success: true, communities: data || [] });
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

  const adminClient = createAdminClient();

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

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('communities')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Update community error:', error);
    return NextResponse.json({ error: 'Failed to update community' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
