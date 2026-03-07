'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Wifi, Check } from 'lucide-react';
import { PillarBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatTime } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { PILLAR_COLORS } from '@/lib/types';
import type { Event } from '@/lib/types';

interface CalendarViewProps {
  events: Event[];
  rsvpdIds: Set<string>;
  currentUserId: string;
}

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getEventsForDay(events: Event[], year: number, month: number, day: number): Event[] {
  return events.filter((e) => {
    const d = new Date(e.date + 'T00:00:00');
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });
}

interface DayPopoverProps {
  dayEvents: Event[];
  rsvpdIds: Set<string>;
  currentUserId: string;
  onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DayPopover({ dayEvents, rsvpdIds, currentUserId, onClose }: DayPopoverProps) {
  const [rsvpStates, setRsvpStates] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    dayEvents.forEach((e) => { init[e.id] = rsvpdIds.has(e.id); });
    return init;
  });
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const handleRSVP = async (event: Event) => {
    const supabase = createClient();
    const alreadyRsvpd = rsvpStates[event.id];
    setLoadingIds((prev) => new Set(prev).add(event.id));
    try {
      if (alreadyRsvpd) {
        await supabase
          .from('rsvps')
          .delete()
          .eq('user_id', currentUserId)
          .eq('event_id', event.id);
        setRsvpStates((prev) => ({ ...prev, [event.id]: false }));
      } else {
        await supabase.from('rsvps').insert({
          user_id: currentUserId,
          event_id: event.id,
          waitlisted: false,
        });
        setRsvpStates((prev) => ({ ...prev, [event.id]: true }));
      }
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(event.id);
        return next;
      });
    }
  };

  return (
    <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
      <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
        {dayEvents.map((event) => {
          const isRsvpd = rsvpStates[event.id];
          const isFull = event.spots_remaining !== null && event.spots_remaining <= 0;
          return (
            <div
              key={event.id}
              className="bg-surface-2 rounded-lg p-3 border border-border hover:border-blue/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-xs font-semibold text-text-primary leading-tight flex-1">
                  {event.title}
                </p>
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {event.pillar_tag && <PillarBadge pillar={event.pillar_tag} />}
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="w-3 h-3" />
                  {formatTime(event.time)}
                </span>
                {event.online_link ? (
                  <span className="flex items-center gap-1 text-xs text-teal">
                    <Wifi className="w-3 h-3" />
                    Online
                  </span>
                ) : event.location ? (
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[80px]">{event.location}</span>
                  </span>
                ) : null}
              </div>
              <Button
                variant={isRsvpd ? 'secondary' : 'primary'}
                size="sm"
                className="w-full text-xs py-1"
                loading={loadingIds.has(event.id)}
                disabled={isFull && !isRsvpd}
                onClick={() => handleRSVP(event)}
              >
                {isRsvpd ? (
                  <><Check className="w-3 h-3" /> RSVP&apos;d</>
                ) : isFull ? (
                  'Full'
                ) : (
                  'RSVP'
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarView({ events, rsvpdIds, currentUserId }: CalendarViewProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [openDay, setOpenDay] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build grid: leading empty cells + days + trailing empty cells
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ...Array(totalCells - firstDayOfMonth - daysInMonth).fill(null),
  ];

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goToday = () => setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));

  const handleDayClick = useCallback((dayKey: string, dayEvents: Event[]) => {
    if (dayEvents.length === 0) return;
    setOpenDay((prev) => (prev === dayKey ? null : dayKey));
  }, []);

  // Close popover on outside click
  useEffect(() => {
    if (!openDay) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDay(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDay]);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div ref={containerRef} className="card p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base sm:text-lg font-bold text-text-primary min-w-[160px] text-center">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={goToday}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-2 border border-border text-text-secondary hover:border-gold hover:text-gold transition-all"
        >
          Today
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-text-muted py-1.5">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {cells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="bg-background min-h-[72px] sm:min-h-[80px]"
              />
            );
          }

          const dayEvents = getEventsForDay(events, year, month, day);
          const hasEvents = dayEvents.length > 0;
          const dayKey = `${year}-${month}-${day}`;
          const isOpen = openDay === dayKey;
          const today_ = isToday(day);

          return (
            <div
              key={dayKey}
              className={cn(
                'relative bg-surface min-h-[72px] sm:min-h-[80px] p-1.5 sm:p-2 transition-colors',
                hasEvents && 'cursor-pointer hover:bg-surface-2',
                today_ && 'ring-1 ring-inset ring-gold'
              )}
              onClick={() => handleDayClick(dayKey, dayEvents)}
            >
              {/* Day number */}
              <span
                className={cn(
                  'inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full',
                  today_
                    ? 'bg-gold text-background font-bold'
                    : 'text-text-secondary'
                )}
              >
                {day}
              </span>

              {/* Event dots */}
              {hasEvents && (
                <div className="flex flex-wrap gap-0.5 mt-1">
                  {dayEvents.slice(0, 5).map((event) => {
                    const color = event.pillar_tag ? PILLAR_COLORS[event.pillar_tag] : '#4A90D9';
                    const isRsvpd = rsvpdIds.has(event.id);
                    return (
                      <span
                        key={event.id}
                        className={cn(
                          'w-2 h-2 rounded-full flex-shrink-0',
                          isRsvpd && 'ring-1 ring-offset-[1px] ring-gold'
                        )}
                        style={{ backgroundColor: color }}
                        title={event.title}
                      />
                    );
                  })}
                  {dayEvents.length > 5 && (
                    <span className="text-[9px] text-text-muted leading-none self-center">
                      +{dayEvents.length - 5}
                    </span>
                  )}
                </div>
              )}

              {/* Popover */}
              {isOpen && (
                <DayPopover
                  dayEvents={dayEvents}
                  rsvpdIds={rsvpdIds}
                  currentUserId={currentUserId}
                  onClose={() => setOpenDay(null)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <span className="text-xs text-text-muted">Legend:</span>
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full bg-blue inline-block" />
          Event
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full bg-blue ring-1 ring-offset-[1px] ring-gold inline-block" />
          RSVP&apos;d
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="w-6 h-5 rounded-sm ring-1 ring-inset ring-gold inline-flex items-center justify-center text-[10px] font-bold text-gold">
            N
          </span>
          Today
        </span>
      </div>
    </div>
  );
}
