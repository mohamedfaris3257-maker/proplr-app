import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { EventCard } from '@/components/events/EventCard';
import { EventsFilter } from '@/components/events/EventsFilter';
import type { Event } from '@/lib/types';
import { CalendarDays } from 'lucide-react';

export const revalidate = 60;

interface EventsPageProps {
  searchParams: { pillar?: string; audience?: string; type?: string };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: rsvps }] = await Promise.all([
    supabase.from('profiles').select('type').eq('user_id', user!.id).single(),
    supabase.from('rsvps').select('event_id').eq('user_id', user!.id),
  ]);

  let query = supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (searchParams.pillar) {
    query = query.eq('pillar_tag', searchParams.pillar);
  }
  if (searchParams.audience && searchParams.audience !== 'all') {
    query = query.in('audience', [searchParams.audience, 'both']);
  }
  if (searchParams.type) {
    query = query.eq('event_type', searchParams.type);
  }

  const { data: events } = await query;

  const rsvpdIds = new Set((rsvps || []).map((r: { event_id: string }) => r.event_id));

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-gold" />
              Events
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Workshops, webinars, and career sessions
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-gold">{(events || []).length}</p>
            <p className="text-xs text-text-muted">upcoming events</p>
          </div>
        </div>

        {/* Filters */}
        <EventsFilter currentFilters={searchParams} userType={profile?.type} />

        {/* Events grid */}
        <div className="mt-6">
          {(events || []).length === 0 ? (
            <div className="card p-12 text-center">
              <CalendarDays className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary font-medium">No upcoming events</p>
              <p className="text-text-muted text-sm mt-1">Check back soon for new events</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {(events as Event[]).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  currentUserId={user!.id}
                  isRSVPd={rsvpdIds.has(event.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
