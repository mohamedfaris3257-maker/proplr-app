import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatTime } from '@/lib/utils';
import { PillarBadge } from '@/components/ui/Badge';
import type { Event } from '@/lib/types';

interface UpcomingEventsWidgetProps {
  events: Event[];
}

export function UpcomingEventsWidget({ events }: UpcomingEventsWidgetProps) {
  if (events.length === 0) return null;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-text-primary">Upcoming Events</h3>
        </div>
        <Link href="/events" className="text-xs text-blue hover:text-blue/80 flex items-center gap-1 transition-colors">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 p-3 bg-surface-2 rounded-lg">
            <div className="flex-shrink-0 text-center bg-gold/10 rounded-lg p-2 min-w-[44px]">
              <p className="text-xs font-bold text-gold leading-none">
                {new Date(event.date).toLocaleDateString('en-AE', { day: 'numeric' })}
              </p>
              <p className="text-[10px] text-gold/70 mt-0.5">
                {new Date(event.date).toLocaleDateString('en-AE', { month: 'short' })}
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary truncate">{event.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.location || 'Online'}
                </span>
                <span className="text-xs text-text-muted">{formatTime(event.time)}</span>
              </div>
              {event.pillar_tag && <div className="mt-1.5"><PillarBadge pillar={event.pillar_tag} /></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
