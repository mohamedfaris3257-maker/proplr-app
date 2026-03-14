import { createClient } from '@/lib/supabase/server';
import { EventDetail } from '@/components/events/EventDetail';
import { notFound } from 'next/navigation';
import type { Event, Profile } from '@/lib/types';

interface EventDetailPageProps {
  params: { id: string };
}

export const revalidate = 60;

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: event, error } = await supabase.from('events').select('*').eq('id', params.id).single();
  if (error || !event) notFound();

  const [
    { count: confirmedCount },
    { count: waitlistCount },
    { data: attendeeRsvps },
    { data: userRsvp },
  ] = await Promise.all([
    supabase.from('rsvps').select('*', { count: 'exact', head: true }).eq('event_id', params.id).eq('waitlisted', false),
    supabase.from('rsvps').select('*', { count: 'exact', head: true }).eq('event_id', params.id).eq('waitlisted', true),
    supabase.from('rsvps').select('user_id, profiles(id, user_id, name, photo_url, school_name, type)').eq('event_id', params.id).eq('waitlisted', false).order('created_at', { ascending: true }).limit(10),
    supabase.from('rsvps').select('id, waitlisted, waitlist_position').eq('event_id', params.id).eq('user_id', user.id).maybeSingle(),
  ]);

  const attendees = (attendeeRsvps || [])
    .map((r: any) => (Array.isArray(r.profiles) ? r.profiles[0] : r.profiles) as Profile | null)
    .filter(Boolean) as Profile[];

  const isRsvpd = !!userRsvp && !userRsvp.waitlisted;
  const isWaitlisted = !!userRsvp && userRsvp.waitlisted;
  const waitlistPosition = userRsvp?.waitlist_position ?? null;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <EventDetail
        event={event as Event}
        currentUserId={user.id}
        isRsvpd={isRsvpd}
        isWaitlisted={isWaitlisted}
        waitlistPosition={waitlistPosition}
        attendees={attendees}
        confirmedCount={confirmedCount ?? 0}
        waitlistCount={waitlistCount ?? 0}
      />
    </div>
  );
}
