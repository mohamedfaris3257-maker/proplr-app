'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Globe, School, Lightbulb, Loader2, CheckCircle2 } from 'lucide-react';
import type { Profile } from '@/lib/types';

interface Community {
  id: string;
  name: string;
  description: string | null;
  type: 'cohort' | 'school' | 'interest';
  cover_url: string | null;
  created_by: string;
  is_active: boolean;
  created_at: string;
  userRole?: string;
}

interface CommunitiesPageProps {
  currentUserId: string;
  profile: Profile;
  myCommunities: Community[];
  discoverCommunities: Community[];
  memberCounts: Record<string, number>;
}

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  cohort: { label: 'Cohort', className: 'bg-gold/10 text-gold border border-gold/20' },
  school: { label: 'School', className: 'bg-blue/10 text-blue border border-blue/20' },
  interest: { label: 'Interest', className: 'bg-teal/10 text-teal border border-teal/20' },
};

const TYPE_GRADIENT: Record<string, string> = {
  cohort: 'from-[#E8A838]/30 to-[#E8A838]/5',
  school: 'from-[#4A90D9]/30 to-[#4A90D9]/5',
  interest: 'from-[#1ABC9C]/30 to-[#1ABC9C]/5',
};

const TYPE_ICON: Record<string, React.ElementType> = {
  cohort: Users,
  school: School,
  interest: Lightbulb,
};

function CommunityCard({
  community,
  memberCount,
  showJoinButton,
  onJoin,
  joining,
  joinStatus,
}: {
  community: Community;
  memberCount: number;
  showJoinButton?: boolean;
  onJoin?: (id: string) => void;
  joining?: boolean;
  joinStatus?: 'approved' | 'pending' | null;
}) {
  const badge = TYPE_BADGE[community.type] ?? TYPE_BADGE.interest;
  const gradient = TYPE_GRADIENT[community.type] ?? TYPE_GRADIENT.interest;
  const TypeIcon = TYPE_ICON[community.type] ?? Users;
  const isInterest = community.type === 'interest';

  return (
    <div className="card overflow-hidden flex flex-col group hover:border-border/80 transition-all duration-200">
      {/* Cover */}
      <Link href={`/dashboard/community/${community.id}`} className="block">
        <div
          className={`h-28 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}
          style={
            community.cover_url
              ? { backgroundImage: `url(${community.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        >
          {!community.cover_url && (
            <TypeIcon className="w-10 h-10 opacity-30 text-text-primary" />
          )}
          <span
            className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link href={`/dashboard/community/${community.id}`} className="block">
          <h3 className="text-sm font-semibold text-text-primary group-hover:text-gold transition-colors line-clamp-1">
            {community.name}
          </h3>
          {community.description && (
            <p className="text-xs text-text-muted mt-1 line-clamp-2">{community.description}</p>
          )}
        </Link>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Users className="w-3 h-3" />
            {memberCount} {memberCount === 1 ? 'member' : 'members'}
          </span>

          {showJoinButton && (
            <>
              {joinStatus === 'approved' ? (
                <span className="text-xs font-medium text-green flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Joined
                </span>
              ) : joinStatus === 'pending' ? (
                <span className="text-xs font-medium text-gold">Requested</span>
              ) : (
                <button
                  onClick={() => onJoin?.(community.id)}
                  disabled={joining}
                  className="btn-primary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 disabled:opacity-50"
                >
                  {joining && <Loader2 className="w-3 h-3 animate-spin" />}
                  {isInterest ? 'Join' : 'Request to Join'}
                </button>
              )}
            </>
          )}

          {!showJoinButton && (
            <Link
              href={`/dashboard/community/${community.id}`}
              className="text-xs text-gold hover:underline"
            >
              View →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommunitiesPage({
  myCommunities,
  discoverCommunities,
  memberCounts: initialMemberCounts,
}: CommunitiesPageProps) {
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinStatuses, setJoinStatuses] = useState<Record<string, 'approved' | 'pending'>>({});
  const [memberCounts, setMemberCounts] = useState(initialMemberCounts);
  const [joinError, setJoinError] = useState<string | null>(null);

  async function handleJoin(communityId: string) {
    setJoiningId(communityId);
    setJoinError(null);
    try {
      const res = await fetch('/api/communities/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community_id: communityId }),
      });
      const data = await res.json();
      if (data.success) {
        setJoinStatuses((prev) => ({ ...prev, [communityId]: data.status }));
        if (data.status === 'approved') {
          setMemberCounts((prev) => ({
            ...prev,
            [communityId]: (prev[communityId] || 0) + 1,
          }));
        }
      } else {
        setJoinError(data.error || 'Failed to join community. Please try again.');
      }
    } catch (err) {
      setJoinError('Failed to connect. Please check your connection and try again.');
      console.error('Failed to join community:', err);
    } finally {
      setJoiningId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center">
          <Globe className="w-5 h-5 text-teal" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Communities</h1>
          <p className="text-text-muted text-sm">Connect with your cohorts, school, and interests</p>
        </div>
      </div>

      {/* Join Error */}
      {joinError && (
        <div className="card p-3 mb-4 border-red/30 bg-red/5 flex items-center justify-between gap-3">
          <p className="text-sm text-red">{joinError}</p>
          <button onClick={() => setJoinError(null)} className="text-xs text-red hover:underline flex-shrink-0">Dismiss</button>
        </div>
      )}

      {/* My Communities */}
      {myCommunities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-gold" />
            My Communities
            <span className="text-xs text-text-muted font-normal">({myCommunities.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {myCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                memberCount={memberCounts[community.id] || 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Discover */}
      <section>
        <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal" />
          Discover Communities
        </h2>

        {discoverCommunities.length === 0 ? (
          <div className="card p-10 text-center">
            <Globe className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary text-sm">No other communities to discover yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {discoverCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                memberCount={
                  joinStatuses[community.id] === 'approved'
                    ? (memberCounts[community.id] || 0)
                    : (memberCounts[community.id] || 0)
                }
                showJoinButton
                onJoin={handleJoin}
                joining={joiningId === community.id}
                joinStatus={joinStatuses[community.id] ?? null}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
