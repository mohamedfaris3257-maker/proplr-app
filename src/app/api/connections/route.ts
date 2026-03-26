import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// GET — fetch connection status with a user, or list all connections
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;
  const otherId = req.nextUrl.searchParams.get('user_id');

  if (otherId) {
    // Check connection status with specific user
    const { data: connection } = await db
      .from('connections')
      .select('id, status, requester_id, addressee_id')
      .or(`and(requester_id.eq.${user.id},addressee_id.eq.${otherId}),and(requester_id.eq.${otherId},addressee_id.eq.${user.id})`)
      .single();

    return NextResponse.json({
      status: connection?.status || 'none',
      connection_id: connection?.id || null,
      is_requester: connection?.requester_id === user.id,
    });
  }

  // List all accepted connections
  const { data: connections, error } = await db
    .from('connections')
    .select(`
      id, status, created_at,
      requester:profiles!connections_requester_id_fkey(id, user_id, name, photo_url, school_name, type),
      addressee:profiles!connections_addressee_id_fkey(id, user_id, name, photo_url, school_name, type)
    `)
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .eq('status', 'accepted')
    .order('created_at', { ascending: false });

  if (error) {
    // Fallback without FK hints
    const { data: conns2 } = await db
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .eq('status', 'accepted');

    return NextResponse.json({ connections: conns2 || [] });
  }

  return NextResponse.json({ connections: connections || [] });
}

// POST — send a connection request
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { addressee_id } = await req.json();
  if (!addressee_id) return NextResponse.json({ error: 'addressee_id required' }, { status: 400 });
  if (addressee_id === user.id) return NextResponse.json({ error: 'Cannot connect with yourself' }, { status: 400 });

  const db = tryCreateAdminClient() || supabase;

  // Check if connection already exists
  const { data: existing } = await db
    .from('connections')
    .select('id, status')
    .or(`and(requester_id.eq.${user.id},addressee_id.eq.${addressee_id}),and(requester_id.eq.${addressee_id},addressee_id.eq.${user.id})`)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Connection already exists', status: existing.status }, { status: 409 });
  }

  const { data: connection, error } = await db
    .from('connections')
    .insert({
      requester_id: user.id,
      addressee_id,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('[Connections POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, connection });
}

// PATCH — accept or decline a connection request
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { connection_id, action } = await req.json();
  if (!connection_id || !['accepted', 'declined'].includes(action)) {
    return NextResponse.json({ error: 'connection_id and action (accepted/declined) required' }, { status: 400 });
  }

  const db = tryCreateAdminClient() || supabase;

  // Verify this user is the addressee
  const { data: conn } = await db
    .from('connections')
    .select('addressee_id')
    .eq('id', connection_id)
    .single();

  if (!conn || conn.addressee_id !== user.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const { error } = await db
    .from('connections')
    .update({ status: action })
    .eq('id', connection_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, status: action });
}
