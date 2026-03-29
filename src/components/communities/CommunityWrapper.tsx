'use client';

import { useState } from 'react';
import { CommunityFeed } from './CommunityFeed';
import type { Profile } from '@/lib/types';

/* ─── Types ──────────────────────────────────────────────────────────── */

interface CommunityData {
  id: string;
  name: string;
  description: string | null;
  type: string;
  cover_url: string | null;
}

interface CommunityOption {
  id: string;
  name: string;
  type: string;
}

interface Props {
  profile: Profile;
  myCommunities: CommunityOption[];
  discoverCommunities: CommunityData[];
  allMyCommunityData: CommunityData[];
  memberCounts: Record<string, number>;
  connectionCount: number;
  suggestedPeers: any[];
  upcomingEvents: any[];
}

/* ─── Colors ──────────────────────────────────────────────────────────── */

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  cohort: { bg: 'rgba(245,158,11,0.08)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)', icon: '◆' },
  school: { bg: 'rgba(14,165,233,0.08)', text: '#0ea5e9', border: 'rgba(14,165,233,0.2)', icon: '▣' },
  interest: { bg: 'rgba(168,85,247,0.08)', text: '#a855f7', border: 'rgba(168,85,247,0.2)', icon: '◈' },
};

const TYPE_GRADIENTS: Record<string, string> = {
  cohort: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  school: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  interest: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
};

/* ─── Component ──────────────────────────────────────────────────────── */

export function CommunityWrapper({
  profile,
  myCommunities,
  discoverCommunities,
  allMyCommunityData,
  memberCounts,
  connectionCount,
  suggestedPeers,
  upcomingEvents,
}: Props) {
  const [activeView, setActiveView] = useState<'communities' | 'feed'>('communities');
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinStatuses, setJoinStatuses] = useState<Record<string, string>>({});
  const [localMemberCounts, setLocalMemberCounts] = useState(memberCounts);
  const [localMyCommunities, setLocalMyCommunities] = useState(myCommunities);
  const [localMyData, setLocalMyData] = useState(allMyCommunityData);

  async function handleJoin(communityId: string) {
    setJoiningId(communityId);
    try {
      const res = await fetch('/api/communities/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community_id: communityId }),
      });
      const data = await res.json();
      if (data.status === 'approved') {
        setJoinStatuses(prev => ({ ...prev, [communityId]: 'approved' }));
        setLocalMemberCounts(prev => ({ ...prev, [communityId]: (prev[communityId] || 0) + 1 }));
        // Add to my communities
        const joined = discoverCommunities.find(c => c.id === communityId);
        if (joined) {
          setLocalMyCommunities(prev => [...prev, { id: joined.id, name: joined.name, type: joined.type }]);
          setLocalMyData(prev => [...prev, joined]);
        }
      } else if (data.status === 'pending') {
        setJoinStatuses(prev => ({ ...prev, [communityId]: 'pending' }));
      }
    } catch (err) {
      console.error('Join error:', err);
    }
    setJoiningId(null);
  }

  const filteredDiscover = discoverCommunities.filter(
    c => !localMyCommunities.some(mc => mc.id === c.id) && joinStatuses[c.id] !== 'approved'
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f0f2f8', minHeight: '100vh' }}>
      {/* ─── Tab Bar ─── */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 1128, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0 }}>
          {[
            { key: 'communities' as const, label: 'Communities', icon: '◆' },
            { key: 'feed' as const, label: 'Feed', icon: '◈' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key)}
              style={{
                padding: '16px 24px',
                fontSize: 14,
                fontWeight: activeView === tab.key ? 700 : 500,
                color: activeView === tab.key ? '#0ea5e9' : '#64748b',
                background: 'none',
                border: 'none',
                borderBottom: activeView === tab.key ? '3px solid #0ea5e9' : '3px solid transparent',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 16 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Content ─── */}
      {activeView === 'communities' ? (
        <div style={{ maxWidth: 1128, margin: '0 auto', padding: '24px 16px' }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: '#071629',
              margin: 0,
              letterSpacing: -0.5,
            }}>
              Communities
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: '6px 0 0' }}>
              Connect with your cohorts, school groups, and interest communities
            </p>
          </div>

          {/* My Communities */}
          {localMyData.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'rgba(14,165,233,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: '#0ea5e9',
                }}>◆</div>
                <h2 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 16, fontWeight: 700, color: '#071629', margin: 0,
                }}>
                  My Communities
                </h2>
                <span style={{
                  fontSize: 12, color: '#64748b', background: '#f0f2f8',
                  padding: '2px 10px', borderRadius: 100, fontWeight: 600,
                }}>
                  {localMyData.length}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {localMyData.map(community => {
                  const colors = TYPE_COLORS[community.type] || TYPE_COLORS.interest;
                  const gradient = TYPE_GRADIENTS[community.type] || TYPE_GRADIENTS.interest;
                  return (
                    <a
                      key={community.id}
                      href={`/dashboard/community/${community.id}`}
                      style={{
                        background: '#fff',
                        borderRadius: 16,
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.06)',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Cover */}
                      <div style={{
                        height: 100,
                        background: community.cover_url
                          ? `url(${community.cover_url}) center/cover`
                          : gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}>
                        {!community.cover_url && (
                          <span style={{ fontSize: 36, color: 'rgba(255,255,255,0.3)' }}>{colors.icon}</span>
                        )}
                        <span style={{
                          position: 'absolute', top: 10, right: 10,
                          fontSize: 10, fontWeight: 700,
                          color: colors.text, background: 'rgba(255,255,255,0.9)',
                          padding: '3px 10px', borderRadius: 100,
                          textTransform: 'capitalize',
                        }}>
                          {community.type}
                        </span>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '14px 18px 16px' }}>
                        <div style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: 14, fontWeight: 700, color: '#071629',
                          marginBottom: 4,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {community.name}
                        </div>
                        {community.description && (
                          <div style={{
                            fontSize: 12, color: '#64748b', lineHeight: 1.4,
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          } as any}>
                            {community.description}
                          </div>
                        )}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          marginTop: 12, paddingTop: 10,
                          borderTop: '1px solid rgba(0,0,0,0.05)',
                        }}>
                          <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            {localMemberCounts[community.id] || 0} members
                          </span>
                          <span style={{ fontSize: 12, color: '#0ea5e9', fontWeight: 700 }}>
                            View →
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Discover Communities */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'rgba(168,85,247,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: '#a855f7',
              }}>◈</div>
              <h2 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 16, fontWeight: 700, color: '#071629', margin: 0,
              }}>
                Discover Communities
              </h2>
            </div>

            {filteredDiscover.length === 0 && Object.keys(joinStatuses).filter(k => joinStatuses[k] === 'pending').length === 0 ? (
              <div style={{
                background: '#fff', borderRadius: 16, padding: '48px 24px',
                textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: 36, marginBottom: 10, color: '#94a3b8' }}>◈</div>
                <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>You&apos;ve joined all available communities!</p>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Check back later for new ones.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {/* Show pending communities */}
                {discoverCommunities
                  .filter(c => joinStatuses[c.id] === 'pending')
                  .map(community => {
                    const colors = TYPE_COLORS[community.type] || TYPE_COLORS.interest;
                    const gradient = TYPE_GRADIENTS[community.type] || TYPE_GRADIENTS.interest;
                    return (
                      <div
                        key={community.id}
                        style={{
                          background: '#fff', borderRadius: 16, overflow: 'hidden',
                          border: '1px solid rgba(245,158,11,0.2)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div style={{
                          height: 100, background: gradient,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          position: 'relative', opacity: 0.7,
                        }}>
                          <span style={{ fontSize: 36, color: 'rgba(255,255,255,0.3)' }}>{colors.icon}</span>
                          <span style={{
                            position: 'absolute', top: 10, right: 10,
                            fontSize: 10, fontWeight: 700,
                            color: colors.text, background: 'rgba(255,255,255,0.9)',
                            padding: '3px 10px', borderRadius: 100, textTransform: 'capitalize',
                          }}>{community.type}</span>
                        </div>
                        <div style={{ padding: '14px 18px 16px' }}>
                          <div style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 14, fontWeight: 700, color: '#071629', marginBottom: 4,
                          }}>{community.name}</div>
                          {community.description && (
                            <div style={{
                              fontSize: 12, color: '#64748b', lineHeight: 1.4,
                              overflow: 'hidden', textOverflow: 'ellipsis',
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            } as any}>{community.description}</div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>
                              {localMemberCounts[community.id] || 0} members
                            </span>
                            <span style={{
                              fontSize: 11, fontWeight: 700, color: '#f59e0b',
                              background: 'rgba(245,158,11,0.1)',
                              padding: '4px 14px', borderRadius: 100,
                            }}>
                              ⏳ Pending Approval
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* Show joinable communities */}
                {filteredDiscover.map(community => {
                  const colors = TYPE_COLORS[community.type] || TYPE_COLORS.interest;
                  const gradient = TYPE_GRADIENTS[community.type] || TYPE_GRADIENTS.interest;
                  const isJoining = joiningId === community.id;
                  const isInterest = community.type === 'interest';
                  return (
                    <div
                      key={community.id}
                      style={{
                        background: '#fff', borderRadius: 16, overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Cover */}
                      <div style={{
                        height: 100,
                        background: community.cover_url
                          ? `url(${community.cover_url}) center/cover`
                          : gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                      }}>
                        {!community.cover_url && (
                          <span style={{ fontSize: 36, color: 'rgba(255,255,255,0.3)' }}>{colors.icon}</span>
                        )}
                        <span style={{
                          position: 'absolute', top: 10, right: 10,
                          fontSize: 10, fontWeight: 700,
                          color: colors.text, background: 'rgba(255,255,255,0.9)',
                          padding: '3px 10px', borderRadius: 100, textTransform: 'capitalize',
                        }}>{community.type}</span>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '14px 18px 16px' }}>
                        <div style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: 14, fontWeight: 700, color: '#071629', marginBottom: 4,
                        }}>{community.name}</div>
                        {community.description && (
                          <div style={{
                            fontSize: 12, color: '#64748b', lineHeight: 1.4,
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          } as any}>{community.description}</div>
                        )}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          marginTop: 12, paddingTop: 10,
                          borderTop: '1px solid rgba(0,0,0,0.05)',
                        }}>
                          <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            {localMemberCounts[community.id] || 0} members
                          </span>
                          <button
                            onClick={() => handleJoin(community.id)}
                            disabled={isJoining}
                            style={{
                              fontSize: 12, fontWeight: 700,
                              color: '#fff',
                              background: isJoining ? '#94a3b8' : colors.text,
                              border: 'none',
                              borderRadius: 100,
                              padding: '7px 20px',
                              cursor: isJoining ? 'not-allowed' : 'pointer',
                              fontFamily: "'DM Sans', sans-serif",
                              transition: 'all 0.2s',
                              boxShadow: `0 2px 8px ${colors.text}30`,
                              display: 'flex', alignItems: 'center', gap: 6,
                              opacity: isJoining ? 0.7 : 1,
                            }}
                          >
                            {isJoining ? (
                              <>
                                <span style={{
                                  display: 'inline-block', width: 12, height: 12,
                                  border: '2px solid rgba(255,255,255,0.3)',
                                  borderTopColor: '#fff',
                                  borderRadius: '50%',
                                  animation: 'spin 0.6s linear infinite',
                                }} />
                                Joining...
                              </>
                            ) : (
                              isInterest ? '+ Join' : '+ Request to Join'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Spinner animation */}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <CommunityFeed
          profile={profile}
          myCommunities={localMyCommunities}
          discoverCommunities={discoverCommunities}
          connectionCount={connectionCount}
          suggestedPeers={suggestedPeers}
          upcomingEvents={upcomingEvents}
        />
      )}
    </div>
  );
}
