'use client';

import { useState } from 'react';
import { LayoutGrid, Calendar, CalendarDays } from 'lucide-react';
import { EventCard } from '@/components/events/EventCard';
import { EventsFilter } from '@/components/events/EventsFilter';
import { CalendarView } from '@/components/events/CalendarView';
import { cn } from '@/lib/utils';
import type { Event, RSVP } from '@/lib/types';

interface EventsPageClientProps {
  events: Event[];
  rsvps: RSVP[];
  currentUserId: string;
  userType: string;
  currentFilters: { pillar?: string; audience?: string; type?: string };
}

type ViewMode = 'grid' | 'calendar';

export function EventsPageClient({
  events,
  rsvps,
  currentUserId,
  userType,
  currentFilters,
}: EventsPageClientProps) {
  const [view, setView] = useState<ViewMode>('grid');

  // Build lookup maps from rsvps
  const rsvpdIds = new Set(rsvps.filter((r) => !r.waitlisted).map((r) => r.event_id));
  const waitlistedIds = new Set(rsvps.filter((r) => r.waitlisted).map((r) => r.event_id));
  const rsvpsByEventId = new Map(rsvps.map((r) => [r.event_id, r]));

  const allRsvpdIds = new Set(rsvps.map((r) => r.event_id));

  return (
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
        <div className="flex items-center gap-3">
          {/* Event count (hidden on small screens) */}
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-gold">{events.length}</p>
            <p className="text-xs text-text-muted">upcoming events</p>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-surface-2 border border-border rounded-lg p-1 gap-1">
            <button
              onClick={() => setView('grid')}
              className={cn(
                'p-1.5 rounded-md transition-all',
                view === 'grid'
                  ? 'bg-gold text-background'
                  : 'text-text-muted hover:text-text-primary'
              )}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={cn(
                'p-1.5 rounded-md transition-all',
                view === 'calendar'
                  ? 'bg-gold text-background'
                  : 'text-text-muted hover:text-text-primary'
              )}
              aria-label="Calendar view"
              title="Calendar view"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <EventsFilter currentFilters={currentFilters} userType={userType} />

      {/* Content */}
      <div className="mt-6">
        {events.length === 0 ? (
          <div className="card p-12 text-center">
            <CalendarDays className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No upcoming events</p>
            <p className="text-text-muted text-sm mt-1">Check back soon for new events</p>
          </div>
        ) : view === 'calendar' ? (
          <CalendarView
            events={events}
            rsvpdIds={allRsvpdIds}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {events.map((event) => {
              const rsvp = rsvpsByEventId.get(event.id);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  currentUserId={currentUserId}
                  isRSVPd={rsvpdIds.has(event.id)}
                  isWaitlisted={waitlistedIds.has(event.id)}
                  waitlistPosition={rsvp?.waitlist_position ?? null}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
