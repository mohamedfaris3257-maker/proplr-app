import { createClient } from '@/lib/supabase/server';
import { EventsPageClient } from '@/components/events/EventsPageClient';
import type { Event, RSVP } from '@/lib/types';

export const revalidate = 60;

interface EventsPageProps {
  searchParams: { pillar?: string; audience?: string; type?: string };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: rsvps }] = await Promise.all([
    supabase.from('profiles').select('type').eq('user_id', user.id).single(),
    supabase.from('rsvps').select('id, event_id, waitlisted, waitlist_position, created_at, user_id').eq('user_id', user.id),
  ]);

  let query = supabase.from('events').select('*').gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true });
  if (searchParams.pillar) query = query.eq('pillar_tag', searchParams.pillar);
  if (searchParams.audience && searchParams.audience !== 'all') query = query.in('audience', [searchParams.audience, 'both']);
  if (searchParams.type) query = query.eq('event_type', searchParams.type);

  const { data: events } = await query;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <EventsPageClient
        events={(events as Event[]) || []}
        rsvps={(rsvps as RSVP[]) || []}
        currentUserId={user.id}
        userType={profile?.type ?? ''}
        currentFilters={searchParams}
      />
    </div>
  );
}
