import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// POST — RSVP to an event
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { event_id } = await req.json();
  if (!event_id) return NextResponse.json({ error: 'event_id required' }, { status: 400 });

  const db = tryCreateAdminClient() || supabase;

  // Check if already RSVP'd
  const { data: existing } = await db
    .from('rsvps')
    .select('id')
    .eq('user_id', user.id)
    .eq('event_id', event_id)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Already RSVP\'d', already_rsvped: true }, { status: 409 });
  }

  // Check event exists and has capacity
  const { data: event } = await db
    .from('events')
    .select('id, capacity, spots_remaining')
    .eq('id', event_id)
    .single();

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const waitlisted = event.capacity !== null && event.spots_remaining !== null && event.spots_remaining <= 0;

  const { data: rsvp, error } = await db
    .from('rsvps')
    .insert({
      user_id: user.id,
      event_id,
      waitlisted,
    })
    .select()
    .single();

  if (error) {
    console.error('[RSVP POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Decrement spots if not waitlisted
  if (!waitlisted && event.spots_remaining !== null) {
    await db
      .from('events')
      .update({ spots_remaining: event.spots_remaining - 1 })
      .eq('id', event_id);
  }

  return NextResponse.json({ success: true, rsvp, waitlisted });
}

// DELETE — Cancel RSVP
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { event_id } = await req.json();
  if (!event_id) return NextResponse.json({ error: 'event_id required' }, { status: 400 });

  const db = tryCreateAdminClient() || supabase;

  const { data: rsvp } = await db
    .from('rsvps')
    .select('id, waitlisted')
    .eq('user_id', user.id)
    .eq('event_id', event_id)
    .single();

  if (!rsvp) return NextResponse.json({ error: 'Not RSVP\'d' }, { status: 404 });

  await db.from('rsvps').delete().eq('id', rsvp.id);

  // Increment spots back if wasn't waitlisted
  if (!rsvp.waitlisted) {
    const { data: event } = await db
      .from('events')
      .select('spots_remaining')
      .eq('id', event_id)
      .single();

    if (event?.spots_remaining !== null) {
      await db
        .from('events')
        .update({ spots_remaining: (event?.spots_remaining || 0) + 1 })
        .eq('id', event_id);
    }
  }

  return NextResponse.json({ success: true });
}
