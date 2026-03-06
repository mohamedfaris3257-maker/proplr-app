'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Wifi, DollarSign, Check } from 'lucide-react';
import { PillarBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatTime } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
  currentUserId: string;
  isRSVPd?: boolean;
}

export function EventCard({ event, currentUserId, isRSVPd: initialRSVPd = false }: EventCardProps) {
  const [rsvpd, setRsvpd] = useState(initialRSVPd);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleRSVP = async () => {
    setLoading(true);
    try {
      if (rsvpd) {
        await supabase.from('rsvps')
          .delete()
          .eq('user_id', currentUserId)
          .eq('event_id', event.id);
        if (event.spots_remaining !== null) {
          await supabase.from('events')
            .update({ spots_remaining: (event.spots_remaining || 0) + 1 })
            .eq('id', event.id);
        }
        setRsvpd(false);
      } else {
        await supabase.from('rsvps').insert({
          user_id: currentUserId,
          event_id: event.id,
        });
        if (event.spots_remaining !== null) {
          await supabase.from('events')
            .update({ spots_remaining: Math.max(0, (event.spots_remaining || 0) - 1) })
            .eq('id', event.id);
        }
        setRsvpd(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const spotsLeft = event.spots_remaining;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  const audienceColor = {
    school: 'bg-gold/10 text-gold',
    uni: 'bg-blue/10 text-blue',
    both: 'bg-teal/10 text-teal',
  }[event.audience];

  const audienceLabel = {
    school: 'School',
    uni: 'University',
    both: 'All Students',
  }[event.audience];

  return (
    <div className="card overflow-hidden hover:shadow-card-hover transition-all duration-200 group">
      {/* Header accent */}
      <div className={`h-1 w-full ${rsvpd ? 'bg-green' : 'bg-gradient-to-r from-gold to-blue'}`} />

      <div className="p-4">
        {/* Tags row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {event.pillar_tag && <PillarBadge pillar={event.pillar_tag} />}
          <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${audienceColor}`}>
            {audienceLabel}
          </span>
          {event.is_paid && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-purple/10 text-purple flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              AED {event.price}
            </span>
          )}
          {!event.is_paid && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-green/10 text-green">Free</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-text-primary mb-2 leading-tight">
          {event.title}
        </h3>
        <p className="text-xs text-text-muted line-clamp-2 mb-3">{event.description}</p>

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Calendar className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
            <Clock className="w-3.5 h-3.5 text-text-muted ml-2 flex-shrink-0" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            {event.online_link ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-teal flex-shrink-0" />
                <span className="text-teal">Online Event</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </>
            )}
          </div>
          {event.capacity !== null && (
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Users className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
              <span className={spotsLeft !== null && spotsLeft <= 5 ? 'text-red' : ''}>
                {isFull ? 'Full' : `${spotsLeft} spots left`} of {event.capacity}
              </span>
            </div>
          )}
        </div>

        {/* RSVP */}
        <Button
          variant={rsvpd ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleRSVP}
          loading={loading}
          disabled={isFull && !rsvpd}
          className="w-full"
        >
          {rsvpd ? (
            <><Check className="w-4 h-4" /> RSVP&apos;d</>
          ) : isFull ? (
            'Full'
          ) : (
            'RSVP'
          )}
        </Button>
      </div>
    </div>
  );
}
