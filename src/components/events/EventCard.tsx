'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, Wifi, DollarSign, Check, Star } from 'lucide-react';
import { PillarBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatTime } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
  currentUserId: string;
  /** Whether the user has a confirmed (non-waitlisted) RSVP */
  isRSVPd?: boolean;
  /** Whether the user is on the waitlist */
  isWaitlisted?: boolean;
  /** Current waitlist position (1-indexed), or null */
  waitlistPosition?: number | null;
}

export function EventCard({
  event,
  currentUserId,
  isRSVPd: initialRSVPd = false,
  isWaitlisted: initialWaitlisted = false,
  waitlistPosition: initialWaitlistPosition = null,
}: EventCardProps) {
  const [rsvpd, setRsvpd] = useState(initialRSVPd);
  const [waitlisted, setWaitlisted] = useState(initialWaitlisted);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(initialWaitlistPosition);
  const [loading, setLoading] = useState(false);

  // Derived state
  const spotsLeft = event.spots_remaining;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  // Handle confirmed RSVP (spot available)
  const handleRSVP = async () => {
    const supabase = createClient();
    setLoading(true);
    try {
      if (rsvpd) {
        // Cancel confirmed RSVP
        await supabase
          .from('rsvps')
          .delete()
          .eq('user_id', currentUserId)
          .eq('event_id', event.id);
        if (event.spots_remaining !== null) {
          await supabase
            .from('events')
            .update({ spots_remaining: (event.spots_remaining || 0) + 1 })
            .eq('id', event.id);
        }
        setRsvpd(false);
      } else {
        await supabase.from('rsvps').insert({
          user_id: currentUserId,
          event_id: event.id,
          waitlisted: false,
        });
        if (event.spots_remaining !== null) {
          await supabase
            .from('events')
            .update({ spots_remaining: Math.max(0, (event.spots_remaining || 0) - 1) })
            .eq('id', event.id);
        }
        setRsvpd(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle join waitlist
  const handleJoinWaitlist = async () => {
    const supabase = createClient();
    setLoading(true);
    try {
      // Get current waitlist count to determine position
      const { count } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)
        .eq('waitlisted', true);

      const position = (count ?? 0) + 1;

      await supabase.from('rsvps').insert({
        user_id: currentUserId,
        event_id: event.id,
        waitlisted: true,
        waitlist_position: position,
      });

      setWaitlisted(true);
      setWaitlistPosition(position);
    } finally {
      setLoading(false);
    }
  };

  // Handle leave waitlist
  const handleLeaveWaitlist = async () => {
    const supabase = createClient();
    setLoading(true);
    try {
      await supabase
        .from('rsvps')
        .delete()
        .eq('user_id', currentUserId)
        .eq('event_id', event.id);
      setWaitlisted(false);
      setWaitlistPosition(null);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="card overflow-hidden hover:shadow-card-hover transition-all duration-200 group flex flex-col">
      {/* Header accent */}
      <div
        className={`h-1 w-full ${
          rsvpd ? 'bg-green' : waitlisted ? 'bg-purple' : 'bg-gradient-to-r from-gold to-blue'
        }`}
      />

      <div className="p-4 flex flex-col flex-1">
        {/* Tags row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {event.pillar_tag && <PillarBadge pillar={event.pillar_tag} />}
          <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${audienceColor}`}>
            {audienceLabel}
          </span>
          {event.is_featured && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-gold/10 text-gold flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {event.is_paid ? (
            <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-purple/10 text-purple flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              AED {event.price}
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-green/10 text-green">
              Free
            </span>
          )}
        </div>

        {/* Title — links to detail page */}
        <Link href={`/events/${event.id}`}>
          <h3 className="text-base font-semibold text-text-primary mb-2 leading-tight hover:text-gold transition-colors">
            {event.title}
          </h3>
        </Link>
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
              <span className={spotsLeft !== null && spotsLeft <= 5 && !isFull ? 'text-red' : ''}>
                {isFull ? 'Full' : `${spotsLeft} spots left`} of {event.capacity}
              </span>
            </div>
          )}
        </div>

        {/* RSVP / Waitlist section — pushed to bottom */}
        <div className="mt-auto space-y-2">
          {rsvpd ? (
            /* Already confirmed RSVP */
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRSVP}
              loading={loading}
              className="w-full border-green/40 text-green hover:border-red/40 hover:text-red"
            >
              <Check className="w-4 h-4" />
              RSVP&apos;d — Cancel
            </Button>
          ) : waitlisted ? (
            /* On waitlist */
            <>
              <Button
                variant="secondary"
                size="sm"
                disabled
                className="w-full cursor-default border-purple/40 text-purple opacity-100"
              >
                On Waitlist{waitlistPosition !== null ? ` #${waitlistPosition}` : ''}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLeaveWaitlist}
                loading={loading}
                className="w-full text-text-muted hover:text-red text-xs"
              >
                Leave Waitlist
              </Button>
            </>
          ) : isFull ? (
            /* Full — offer waitlist */
            <Button
              variant="secondary"
              size="sm"
              onClick={handleJoinWaitlist}
              loading={loading}
              className="w-full border-purple/40 text-purple hover:border-purple hover:bg-purple/10"
            >
              Join Waitlist
            </Button>
          ) : (
            /* Normal RSVP */
            <Button
              variant="primary"
              size="sm"
              onClick={handleRSVP}
              loading={loading}
              className="w-full"
            >
              RSVP
            </Button>
          )}

          {/* Waitlist position note */}
          {waitlisted && waitlistPosition !== null && (
            <p className="text-xs text-center text-purple">
              You are #{waitlistPosition} on the waitlist
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
