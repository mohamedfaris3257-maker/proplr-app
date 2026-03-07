'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Wifi,
  Users,
  DollarSign,
  Star,
  Check,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { PillarBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, formatTime, cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Event, Profile } from '@/lib/types';

interface EventDetailProps {
  event: Event;
  currentUserId: string;
  isRsvpd: boolean;
  isWaitlisted: boolean;
  waitlistPosition: number | null;
  attendees: Profile[];
  confirmedCount: number;
  waitlistCount: number;
}

export function EventDetail({
  event,
  currentUserId,
  isRsvpd: initialRsvpd,
  isWaitlisted: initialWaitlisted,
  waitlistPosition: initialWaitlistPosition,
  attendees,
  confirmedCount: initialConfirmedCount,
  waitlistCount: initialWaitlistCount,
}: EventDetailProps) {
  const [rsvpd, setRsvpd] = useState(initialRsvpd);
  const [waitlisted, setWaitlisted] = useState(initialWaitlisted);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(
    initialWaitlistPosition
  );
  const [spotsRemaining, setSpotsRemaining] = useState<number | null>(event.spots_remaining);
  const [confirmedCount, setConfirmedCount] = useState(initialConfirmedCount);
  const [waitlistCount, setWaitlistCount] = useState(initialWaitlistCount);
  const [loading, setLoading] = useState(false);

  const isFull = spotsRemaining !== null && spotsRemaining <= 0;

  const handleRSVP = async () => {
    const supabase = createClient();
    setLoading(true);
    try {
      if (rsvpd) {
        await supabase
          .from('rsvps')
          .delete()
          .eq('user_id', currentUserId)
          .eq('event_id', event.id);
        if (spotsRemaining !== null) {
          const next = (spotsRemaining || 0) + 1;
          await supabase.from('events').update({ spots_remaining: next }).eq('id', event.id);
          setSpotsRemaining(next);
        }
        setConfirmedCount((c) => Math.max(0, c - 1));
        setRsvpd(false);
      } else {
        await supabase.from('rsvps').insert({
          user_id: currentUserId,
          event_id: event.id,
          waitlisted: false,
        });
        if (spotsRemaining !== null) {
          const next = Math.max(0, (spotsRemaining || 0) - 1);
          await supabase.from('events').update({ spots_remaining: next }).eq('id', event.id);
          setSpotsRemaining(next);
        }
        setConfirmedCount((c) => c + 1);
        setRsvpd(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWaitlist = async () => {
    const supabase = createClient();
    setLoading(true);
    try {
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
      setWaitlistCount((c) => c + 1);
    } finally {
      setLoading(false);
    }
  };

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
      setWaitlistCount((c) => Math.max(0, c - 1));
    } finally {
      setLoading(false);
    }
  };

  const audienceLabel = { school: 'School', uni: 'University', both: 'All Students' }[
    event.audience
  ];
  const audienceVariant = { school: 'gold', uni: 'blue', both: 'teal' }[
    event.audience
  ] as 'gold' | 'blue' | 'teal';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Link>

      {/* Event header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {event.pillar_tag && <PillarBadge pillar={event.pillar_tag} />}
          <Badge variant={audienceVariant}>{audienceLabel}</Badge>
          <Badge variant="default">{event.event_type}</Badge>
          {event.is_featured && (
            <Badge variant="gold">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {event.is_paid ? (
            <Badge variant="purple">
              <DollarSign className="w-3 h-3 mr-1" />
              AED {event.price}
            </Badge>
          ) : (
            <Badge variant="green">Free</Badge>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
          {event.title}
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: description + organiser */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Description */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              About this Event
            </h2>
            <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* Organiser / location detail */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Event Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">Date</p>
                  <p className="text-sm text-text-primary font-medium">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">Time</p>
                  <p className="text-sm text-text-primary font-medium">
                    {formatTime(event.time)}
                  </p>
                </div>
              </div>
              {event.online_link ? (
                <div className="flex items-start gap-3">
                  <Wifi className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Format</p>
                    <a
                      href={event.online_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal font-medium hover:underline flex items-center gap-1"
                    >
                      Online — Join Link
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : event.location ? (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Location</p>
                    <p className="text-sm text-text-primary font-medium">{event.location}</p>
                  </div>
                </div>
              ) : null}
              {event.capacity !== null && (
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Capacity</p>
                    <p className="text-sm text-text-primary font-medium">
                      {confirmedCount} / {event.capacity} registered
                      {isFull && (
                        <span className="ml-2 text-xs text-red font-semibold">Full</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
              {event.pillar_tag && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Pillar</p>
                    <p className="text-sm text-text-primary font-medium">{event.pillar_tag}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: sticky sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="sticky top-6 space-y-4">
            {/* Sidebar card */}
            <div className="card p-5 space-y-4">
              {/* Date / time summary */}
              <div className="pb-4 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-text-muted" />
                  <p className="text-sm text-text-primary font-semibold">
                    {formatDate(event.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <p className="text-sm text-text-secondary">{formatTime(event.time)}</p>
                </div>
              </div>

              {/* Location / online */}
              <div className="pb-4 border-b border-border">
                {event.online_link ? (
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-teal flex-shrink-0" />
                    <a
                      href={event.online_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal hover:underline flex items-center gap-1"
                    >
                      Online Event
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : event.location ? (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-text-secondary">{event.location}</p>
                  </div>
                ) : null}
              </div>

              {/* Capacity */}
              {event.capacity !== null && (
                <div className="pb-4 border-b border-border">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-text-muted">Spots remaining</span>
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        isFull
                          ? 'text-red'
                          : spotsRemaining !== null && spotsRemaining <= 5
                          ? 'text-red'
                          : 'text-green'
                      )}
                    >
                      {isFull ? 'Full' : `${spotsRemaining} left`}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-surface-2 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        isFull ? 'bg-red' : 'bg-green'
                      )}
                      style={{
                        width: `${Math.min(
                          100,
                          ((event.capacity - (spotsRemaining ?? 0)) / event.capacity) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    {confirmedCount} of {event.capacity} registered
                  </p>
                  {waitlistCount > 0 && (
                    <p className="text-xs text-purple mt-0.5">
                      {waitlistCount} on waitlist
                    </p>
                  )}
                </div>
              )}

              {/* Pricing */}
              {event.is_paid && (
                <div className="pb-4 border-b border-border flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple flex-shrink-0" />
                  <p className="text-sm font-semibold text-purple">AED {event.price}</p>
                </div>
              )}

              {/* RSVP button */}
              {rsvpd ? (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleRSVP}
                  loading={loading}
                  className="w-full border-green/40 text-green hover:border-red/40 hover:text-red"
                >
                  <Check className="w-4 h-4" />
                  RSVP&apos;d — Cancel
                </Button>
              ) : waitlisted ? (
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    size="md"
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
                  {waitlistPosition !== null && (
                    <p className="text-xs text-center text-purple">
                      You are #{waitlistPosition} on the waitlist
                    </p>
                  )}
                </div>
              ) : isFull ? (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleJoinWaitlist}
                  loading={loading}
                  className="w-full border-purple/40 text-purple hover:border-purple hover:bg-purple/10"
                >
                  Join Waitlist
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRSVP}
                  loading={loading}
                  className="w-full"
                >
                  RSVP for this Event
                </Button>
              )}
            </div>

            {/* Attendees card */}
            {attendees.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                  Attending ({confirmedCount})
                </h3>

                {/* Avatar stack */}
                <div className="flex items-center -space-x-2 mb-3">
                  {attendees.slice(0, 8).map((profile) => (
                    <div
                      key={profile.user_id}
                      className="ring-2 ring-surface rounded-full"
                      title={profile.name}
                    >
                      <Avatar
                        name={profile.name}
                        photoUrl={profile.photo_url}
                        size="sm"
                      />
                    </div>
                  ))}
                  {confirmedCount > 8 && (
                    <div className="w-8 h-8 rounded-full bg-surface-2 border border-border ring-2 ring-surface flex items-center justify-center text-[10px] font-semibold text-text-muted">
                      +{confirmedCount - 8}
                    </div>
                  )}
                </div>

                {/* Attendee name list */}
                <div className="space-y-1.5">
                  {attendees.slice(0, 5).map((profile) => (
                    <div key={profile.user_id} className="flex items-center gap-2">
                      <Avatar
                        name={profile.name}
                        photoUrl={profile.photo_url}
                        size="xs"
                      />
                      <span className="text-xs text-text-secondary truncate">
                        {profile.name}
                      </span>
                      {profile.school_name && (
                        <span className="text-[10px] text-text-muted truncate">
                          · {profile.school_name}
                        </span>
                      )}
                    </div>
                  ))}
                  {attendees.length > 5 && (
                    <p className="text-xs text-text-muted">
                      and {confirmedCount - 5} more attending
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
