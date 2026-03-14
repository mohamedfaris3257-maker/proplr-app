'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Info, CalendarDays, Shield, Loader2, School, Lightbulb } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';

interface Community {
  id: string;
  name: string;
  description: string | null;
  type: 'cohort' | 'school' | 'interest';
  cover_url: string | null;
  created_by: string;
  is_active: boolean;
  created_at: string;
}

interface Member {
  id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'admin';
  joined_at: string;
  status: string;
  profiles: {
    name: string;
    email: string;
    photo_url: string | null;
    school_name: string | null;
    type: string;
  } | null;
}

interface Props {
  community: Community;
  members: Member[];
  currentUserId: string;
  isMember: boolean;
  userRole: string | null;
}

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  cohort: { label: 'Cohort', className: 'bg-gold/10 text-gold border border-gold/20' },
  school: { label: 'School', className: 'bg-blue/10 text-blue border border-blue/20' },
  interest: { label: 'Interest', className: 'bg-teal/10 text-teal border border-teal/20' },
};

const TYPE_GRADIENT: Record<string, string> = {
  cohort: 'from-[#E8A838]/40 to-[#E8A838]/5',
  school: 'from-[#4A90D9]/40 to-[#4A90D9]/5',
  interest: 'from-[#1ABC9C]/40 to-[#1ABC9C]/5',
};

const TYPE_ICON: Record<string, React.ElementType> = {
  cohort: Users,
  school: School,
  interest: Lightbulb,
};

const ROLE_BADGE: Record<string, string> = {
  admin: 'bg-purple/10 text-purple border border-purple/20',
  moderator: 'bg-blue/10 text-blue border border-blue/20',
  member: 'bg-surface-2 text-text-muted border border-border',
};

type Tab = 'members' | 'info';

export function CommunityDetailPage({
  community,
  members,
  currentUserId,
  isMember,
  userRole,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [leaving, setLeaving] = useState(false);

  const badge = TYPE_BADGE[community.type] ?? TYPE_BADGE.interest;
  const gradient = TYPE_GRADIENT[community.type] ?? TYPE_GRADIENT.interest;
  const TypeIcon = TYPE_ICON[community.type] ?? Users;

  async function handleLeave() {
    setLeaving(true);
    try {
      const res = await fetch('/api/communities/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community_id: community.id }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard/community');
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to leave community:', err);
    } finally {
      setLeaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Hero */}
      <div
        className={`rounded-xl overflow-hidden mb-6 h-44 bg-gradient-to-br ${gradient} flex items-end relative`}
        style={
          community.cover_url
            ? {
                backgroundImage: `url(${community.cover_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {!community.cover_url && (
          <TypeIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 opacity-20 text-text-primary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative p-5 flex items-end justify-between w-full">
          <div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.className} mb-2 inline-block`}>
              {badge.label}
            </span>
            <h1 className="text-xl font-bold text-white">{community.name}</h1>
            <p className="text-sm text-white/70 mt-0.5">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </p>
          </div>
          {isMember && userRole && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_BADGE[userRole] ?? ROLE_BADGE.member}`}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-2 rounded-xl mb-6 w-fit">
        {([
          { id: 'members' as Tab, label: 'Members', icon: Users },
          { id: 'info' as Tab, label: 'Info', icon: Info },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? 'bg-surface text-text-primary shadow-card'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">
              Members
              <span className="ml-2 text-text-muted font-normal text-xs">({members.length})</span>
            </h3>
          </div>
          {members.length === 0 ? (
            <div className="p-10 text-center">
              <Users className="w-8 h-8 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary text-sm">No members yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {members.map((member) => {
                const profile = member.profiles;
                const name = profile?.name ?? 'Unknown';
                const isCurrentUser = member.user_id === currentUserId;
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-4 hover:bg-surface-2 transition-colors"
                  >
                    <Avatar name={name} photoUrl={profile?.photo_url} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate flex items-center gap-1.5">
                        {name}
                        {isCurrentUser && (
                          <span className="text-[10px] text-gold font-normal">(you)</span>
                        )}
                      </p>
                      {profile?.school_name && (
                        <p className="text-xs text-text-muted truncate">{profile.school_name}</p>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${ROLE_BADGE[member.role] ?? ROLE_BADGE.member}`}>
                      {member.role === 'admin' && <Shield className="w-2.5 h-2.5 inline mr-0.5" />}
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            {community.description && (
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">About</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{community.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Type</h4>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
                  {badge.label}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Members</h4>
                <p className="text-sm text-text-primary font-medium">{members.length}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Created</h4>
                <p className="text-sm text-text-secondary flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {formatDate(community.created_at)}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Status</h4>
                <span className={`text-xs font-medium ${community.is_active ? 'text-green' : 'text-red'}`}>
                  {community.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {isMember && (
            <div className="card p-5">
              <h4 className="text-sm font-semibold text-text-primary mb-3">Membership</h4>
              <p className="text-xs text-text-muted mb-4">
                You are a {userRole} of this community. Leaving will remove your access.
              </p>
              <button
                onClick={handleLeave}
                disabled={leaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red/10 text-red border border-red/20 hover:bg-red/20 transition-colors disabled:opacity-50"
              >
                {leaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Leave Community
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
