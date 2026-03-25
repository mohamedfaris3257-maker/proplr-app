'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { timeAgo, getInitials } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────────── */

interface Community {
  id: string;
  name: string;
  description: string | null;
  type: 'cohort' | 'school' | 'interest';
  cover_url: string | null;
  created_by: string;
  is_active: boolean;
  created_at: string;
  program?: string;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  status: string;
  profiles: {
    name: string;
    photo_url: string | null;
    type: string;
    school_name?: string | null;
    email?: string;
  } | null;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  pillar_tag: string | null;
  is_announcement: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  liked_by_me: boolean;
  profiles: {
    name: string;
    photo_url: string | null;
    type: string;
  } | null;
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    name: string;
    photo_url: string | null;
  } | null;
}

interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
}

interface Props {
  community: Community;
  members: Member[];
  pendingMembers: Member[];
  communityEvents: CommunityEvent[];
  currentUserId: string;
  currentUserName: string;
  currentUserPhoto: string | null;
  isMember: boolean;
  userRole: string | null;
  isPlatformAdmin: boolean;
}

/* ─── Constants ──────────────────────────────────────────────────────── */

const PILLARS = [
  'Leadership',
  'Entrepreneurship',
  'Digital Literacy',
  'Personal Branding',
  'Communication',
  'Project Management',
];

/* ─── Component ──────────────────────────────────────────────────────── */

export function CommunityInnerPage({
  community,
  members,
  pendingMembers: initialPending,
  communityEvents,
  currentUserId,
  currentUserName,
  currentUserPhoto,
  isMember: initialIsMember,
  userRole,
  isPlatformAdmin,
}: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [pillarTag, setPillarTag] = useState<string | null>(null);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, Comment[]>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [pendingMembers, setPendingMembers] = useState(initialPending);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(initialIsMember);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const isAdmin = userRole === 'admin' || userRole === 'moderator' || isPlatformAdmin;
  const memberCount = members.length;

  /* ─── Fetch posts ─────────────────────────────────────────────────── */

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/communities/posts?community_id=${community.id}`);
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  }, [community.id]);

  useEffect(() => {
    if (isMember) fetchPosts();
    else setLoadingPosts(false);
  }, [isMember, fetchPosts]);

  /* ─── Post actions ────────────────────────────────────────────────── */

  async function handlePost() {
    if (!postContent.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch('/api/communities/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          community_id: community.id,
          content: postContent.trim(),
          pillar_tag: pillarTag,
          is_announcement: isAnnouncement,
        }),
      });
      const data = await res.json();
      if (data.success && data.post) {
        // Insert in correct position (announcements first)
        if (data.post.is_announcement) {
          setPosts((prev) => [data.post, ...prev]);
        } else {
          const firstNonAnnouncement = posts.findIndex((p) => !p.is_announcement);
          if (firstNonAnnouncement === -1) {
            setPosts((prev) => [...prev, data.post]);
          } else {
            setPosts((prev) => [
              ...prev.slice(0, firstNonAnnouncement),
              data.post,
              ...prev.slice(firstNonAnnouncement),
            ]);
          }
        }
        setPostContent('');
        setPillarTag(null);
        setIsAnnouncement(false);
      }
    } catch (err) {
      console.error('Post error:', err);
    }
    setPosting(false);
  }

  async function handleLike(postId: string) {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked_by_me: !p.liked_by_me,
              likes_count: p.liked_by_me ? p.likes_count - 1 : p.likes_count + 1,
            }
          : p
      )
    );
    try {
      await fetch('/api/communities/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId }),
      });
    } catch (err) {
      // Revert on error
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                liked_by_me: !p.liked_by_me,
                likes_count: p.liked_by_me ? p.likes_count - 1 : p.likes_count + 1,
              }
            : p
        )
      );
    }
  }

  /* ─── Comments ────────────────────────────────────────────────────── */

  async function toggleComments(postId: string) {
    if (expandedComments[postId]) {
      setExpandedComments((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
      return;
    }

    setLoadingComments((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`/api/communities/posts/comments?post_id=${postId}`);
      const data = await res.json();
      setExpandedComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
    } catch (err) {
      console.error('Comments fetch error:', err);
    }
    setLoadingComments((prev) => ({ ...prev, [postId]: false }));
  }

  async function handleComment(postId: string) {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      const res = await fetch('/api/communities/posts/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setExpandedComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment],
        }));
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error('Comment error:', err);
    }
  }

  /* ─── Pending approvals ───────────────────────────────────────────── */

  async function handleApprove(memberId: string) {
    setActionInProgress(memberId);
    try {
      const res = await fetch('/api/communities/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId, action: 'approve' }),
      });
      const data = await res.json();
      if (data.success) {
        setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
        router.refresh();
      }
    } catch (err) {
      console.error('Approve error:', err);
    }
    setActionInProgress(null);
  }

  async function handleReject(memberId: string) {
    setActionInProgress(memberId);
    try {
      const res = await fetch('/api/communities/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId, action: 'reject' }),
      });
      const data = await res.json();
      if (data.success) {
        setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
      }
    } catch (err) {
      console.error('Reject error:', err);
    }
    setActionInProgress(null);
  }

  /* ─── Join / Leave ────────────────────────────────────────────────── */

  async function handleJoin() {
    setJoining(true);
    try {
      const res = await fetch('/api/communities/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community_id: community.id }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.status === 'approved') {
          setIsMember(true);
          router.refresh();
        } else {
          // pending
          router.refresh();
        }
      }
    } catch (err) {
      console.error('Join error:', err);
    }
    setJoining(false);
  }

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
      console.error('Leave error:', err);
    }
    setLeaving(false);
  }

  /* ─── Render ──────────────────────────────────────────────────────── */

  const userInitial = getInitials(currentUserName);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      {/* ──── Community Header ──── */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerMeta}>
            {community.type.toUpperCase()}
            {community.program ? ` · ${community.program.toUpperCase()}` : ''}
          </div>
          <h1 style={styles.headerTitle}>{community.name}</h1>
          {community.description && (
            <p style={styles.headerDesc}>{community.description}</p>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={styles.memberCountNum}>{memberCount}</div>
          <div style={styles.memberCountLabel}>Members</div>
        </div>
      </div>

      {/* ──── Not a member state ──── */}
      {!isMember && (
        <div style={styles.notMemberCard}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#071629' }}>
            You haven&apos;t joined this community yet
          </h2>
          <p style={{ fontSize: 13, color: '#6e7591', margin: '0 0 16px' }}>
            Join to see the feed, connect with members, and participate in discussions.
          </p>
          <button onClick={handleJoin} disabled={joining} style={styles.joinBtn}>
            {joining ? 'Joining...' : community.type === 'interest' ? 'Join Community' : 'Request to Join'}
          </button>
        </div>
      )}

      {/* ──── Main Content (visible only to members) ──── */}
      {isMember && (
        <div style={styles.columns}>
          {/* ──── CENTER — Feed ──── */}
          <div style={styles.centerCol}>
            {/* Pending approvals for admins */}
            {isAdmin && pendingMembers.length > 0 && (
              <div style={styles.pendingCard}>
                <div style={styles.pendingHeader}>
                  🛡️ Pending Requests ({pendingMembers.length})
                </div>
                {pendingMembers.map((member) => {
                  const name = member.profiles?.name ?? 'Unknown';
                  return (
                    <div key={member.id} style={styles.pendingRow}>
                      <div style={styles.avatarSm}>{getInitials(name)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: '#071629' }}>{name}</div>
                        {member.profiles?.school_name && (
                          <div style={{ fontSize: 10.5, color: '#6e7591' }}>{member.profiles.school_name}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleReject(member.id)}
                        disabled={actionInProgress === member.id}
                        style={styles.rejectBtn}
                      >
                        ✕
                      </button>
                      <button
                        onClick={() => handleApprove(member.id)}
                        disabled={actionInProgress === member.id}
                        style={styles.approveBtn}
                      >
                        {actionInProgress === member.id ? '...' : '✓ Approve'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Post creation box */}
            <div style={styles.postBox}>
              {/* Announcement toggle for admins */}
              {isAdmin && (
                <label style={styles.announcementToggle}>
                  <input
                    type="checkbox"
                    checked={isAnnouncement}
                    onChange={(e) => setIsAnnouncement(e.target.checked)}
                    style={{ marginRight: 6 }}
                  />
                  📢 Post as Announcement (pinned at top, yellow highlight)
                </label>
              )}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={styles.avatarMd}>{userInitial}</div>
                <textarea
                  placeholder="Share something with this community..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  style={styles.textArea}
                />
              </div>
              <div style={styles.postBoxFooter}>
                <div style={styles.pillarRow}>
                  {PILLARS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setPillarTag(pillarTag === tag ? null : tag)}
                      style={{
                        ...styles.pillarChip,
                        background: pillarTag === tag ? '#071629' : 'transparent',
                        color: pillarTag === tag ? '#fff' : '#6e7591',
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handlePost}
                  disabled={!postContent.trim() || posting}
                  style={{
                    ...styles.postBtn,
                    opacity: !postContent.trim() || posting ? 0.5 : 1,
                  }}
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>

            {/* Posts feed */}
            {loadingPosts ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#6e7591', fontSize: 13 }}>
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div style={styles.emptyFeed}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                <p style={{ fontSize: 13, color: '#6e7591', margin: 0 }}>
                  No posts yet. Be the first to share something!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    ...styles.postCard,
                    borderLeft: post.is_announcement ? '4px solid #ffcb5d' : 'none',
                  }}
                >
                  {post.is_announcement && (
                    <div style={styles.announcementBadge}>📢 ANNOUNCEMENT</div>
                  )}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div style={styles.avatarSm}>
                      {getInitials(post.profiles?.name || '?')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#071629' }}>
                        {post.profiles?.name || 'Unknown'}
                      </div>
                      <div style={{ fontSize: 11, color: '#6e7591' }}>
                        {timeAgo(post.created_at)}
                      </div>
                    </div>
                    {post.pillar_tag && (
                      <span style={styles.pillarBadge}>{post.pillar_tag}</span>
                    )}
                  </div>
                  <p style={styles.postContent}>{post.content}</p>
                  <div style={styles.postActions}>
                    <button onClick={() => handleLike(post.id)} style={{
                      ...styles.actionBtn,
                      color: post.liked_by_me ? '#3d9be9' : '#6e7591',
                    }}>
                      {post.liked_by_me ? '❤️' : '🤍'} {post.likes_count}
                    </button>
                    <button
                      onClick={() => toggleComments(post.id)}
                      style={styles.actionBtn}
                    >
                      💬 {post.comments_count} Comments
                    </button>
                  </div>

                  {/* Expanded comments */}
                  {expandedComments[post.id] !== undefined && (
                    <div style={styles.commentsSection}>
                      {loadingComments[post.id] ? (
                        <div style={{ fontSize: 12, color: '#6e7591', padding: 8 }}>Loading...</div>
                      ) : (
                        <>
                          {expandedComments[post.id].map((comment) => (
                            <div key={comment.id} style={styles.commentRow}>
                              <div style={styles.avatarXs}>
                                {getInitials(comment.profiles?.name || '?')}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontWeight: 600, fontSize: 12, color: '#071629', marginRight: 6 }}>
                                  {comment.profiles?.name || 'Unknown'}
                                </span>
                                <span style={{ fontSize: 12, color: '#1d1d1f' }}>{comment.content}</span>
                                <div style={{ fontSize: 10, color: '#6e7591', marginTop: 2 }}>
                                  {timeAgo(comment.created_at)}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleComment(post.id);
                              }}
                              style={styles.commentInput}
                            />
                            <button
                              onClick={() => handleComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                              style={styles.commentSendBtn}
                            >
                              Send
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* ──── RIGHT PANEL ──── */}
          <div style={styles.rightCol}>
            {/* Members card */}
            <div style={styles.rightCard}>
              <div style={styles.rightCardTitle}>👥 Members ({memberCount})</div>
              {members.slice(0, 8).map((member) => {
                const name = member.profiles?.name ?? 'Unknown';
                return (
                  <div key={member.id} style={styles.memberRow}>
                    <div style={styles.avatarSm}>{getInitials(name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500, color: '#071629' }}>{name}</div>
                      <div style={{ fontSize: 10.5, color: '#6e7591', textTransform: 'capitalize' }}>
                        {member.role}
                      </div>
                    </div>
                    {(member.role === 'admin' || member.role === 'moderator') && (
                      <span style={styles.leaderBadge}>
                        {member.role === 'admin' ? '👑 Admin' : '🛡️ Mod'}
                      </span>
                    )}
                  </div>
                );
              })}
              {memberCount > 8 && (
                <button style={styles.viewAllBtn}>View all {memberCount} members</button>
              )}
            </div>

            {/* Upcoming events card */}
            <div style={styles.eventsCard}>
              <div style={styles.rightCardTitleWhite}>📅 Upcoming Events</div>
              {communityEvents.length === 0 ? (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  No upcoming events for this community.
                </p>
              ) : (
                communityEvents.map((event) => (
                  <div key={event.id} style={styles.eventRow}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff' }}>{event.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                      {new Date(event.date).toLocaleDateString('en-AE', {
                        day: 'numeric',
                        month: 'short',
                      })}
                      {event.time ? ` · ${event.time}` : ''}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Leave community button */}
            {isMember && (
              <button onClick={handleLeave} disabled={leaving} style={styles.leaveBtn}>
                {leaving ? 'Leaving...' : 'Leave Community'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  header: {
    background: '#071629',
    borderRadius: 20,
    padding: '24px 28px',
    marginBottom: 20,
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerMeta: {
    fontSize: 11,
    color: '#ffcb5d',
    fontWeight: 700,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  headerTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    margin: '0 0 6px',
  },
  headerDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    margin: 0,
    maxWidth: 500,
    lineHeight: 1.5,
  },
  memberCountNum: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: '#ffcb5d',
  },
  memberCountLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  columns: {
    display: 'flex',
    gap: 18,
    alignItems: 'flex-start',
  },
  centerCol: {
    flex: '1 1 65%',
    minWidth: 0,
  },
  rightCol: {
    flex: '0 0 320px',
    minWidth: 280,
  },

  /* Not a member */
  notMemberCard: {
    background: '#fff',
    borderRadius: 20,
    padding: '40px 28px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
  },
  joinBtn: {
    background: '#3d9be9',
    color: '#fff',
    border: 'none',
    borderRadius: 100,
    padding: '10px 28px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  /* Pending requests */
  pendingCard: {
    background: '#fffbeb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    border: '1px solid rgba(255,203,93,0.3)',
  },
  pendingHeader: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: '#b87d00',
    marginBottom: 12,
  },
  pendingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 0',
    borderTop: '0.5px solid rgba(184,125,0,0.15)',
  },
  approveBtn: {
    fontSize: 11,
    padding: '4px 12px',
    borderRadius: 100,
    border: 'none',
    background: '#10b981',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: 'inherit',
  },
  rejectBtn: {
    fontSize: 12,
    width: 26,
    height: 26,
    borderRadius: '50%',
    border: '1px solid rgba(220,38,38,0.2)',
    background: 'rgba(220,38,38,0.08)',
    color: '#dc2626',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
  },

  /* Post creation */
  postBox: {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
  },
  announcementToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
    fontSize: 12.5,
    color: '#6e7591',
    cursor: 'pointer',
  },
  avatarMd: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#3d9be9',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  avatarSm: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,203,93,0.3), rgba(61,155,233,0.3))',
    color: '#b87d00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 11,
    flexShrink: 0,
    border: '1px solid rgba(255,203,93,0.2)',
  },
  avatarXs: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,203,93,0.3), rgba(61,155,233,0.3))',
    color: '#b87d00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 9,
    flexShrink: 0,
  },
  textArea: {
    flex: 1,
    border: '0.5px solid rgba(7,22,41,0.1)',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    resize: 'none' as const,
    minHeight: 80,
    outline: 'none',
  },
  postBoxFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  pillarRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap' as const,
  },
  pillarChip: {
    fontSize: 10.5,
    padding: '3px 10px',
    borderRadius: 100,
    border: '0.5px solid rgba(7,22,41,0.1)',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  postBtn: {
    background: '#3d9be9',
    color: '#fff',
    border: 'none',
    borderRadius: 100,
    padding: '8px 20px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  /* Posts */
  emptyFeed: {
    background: '#fff',
    borderRadius: 16,
    padding: 40,
    textAlign: 'center' as const,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
  },
  postCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
  },
  announcementBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: '#b87d00',
    letterSpacing: 1,
    marginBottom: 8,
  },
  pillarBadge: {
    fontSize: 10.5,
    padding: '2px 10px',
    borderRadius: 100,
    background: 'rgba(61,155,233,0.1)',
    color: '#3d9be9',
    fontWeight: 600,
    alignSelf: 'flex-start' as const,
    whiteSpace: 'nowrap' as const,
  },
  postContent: {
    fontSize: 13.5,
    color: '#1d1d1f',
    lineHeight: 1.6,
    margin: '0 0 12px',
    whiteSpace: 'pre-wrap' as const,
  },
  postActions: {
    display: 'flex',
    gap: 16,
    paddingTop: 10,
    borderTop: '0.5px solid rgba(7,22,41,0.06)',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 12.5,
    color: '#6e7591',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontFamily: 'inherit',
  },

  /* Comments */
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: '0.5px solid rgba(7,22,41,0.06)',
  },
  commentRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'flex-start',
    padding: '6px 0',
  },
  commentInput: {
    flex: 1,
    border: '0.5px solid rgba(7,22,41,0.1)',
    borderRadius: 100,
    padding: '6px 14px',
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
  },
  commentSendBtn: {
    background: '#3d9be9',
    color: '#fff',
    border: 'none',
    borderRadius: 100,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  /* Right panel */
  rightCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
    marginBottom: 14,
  },
  rightCardTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: '#071629',
    marginBottom: 12,
  },
  rightCardTitleWhite: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: '#fff',
    marginBottom: 12,
  },
  memberRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    padding: '6px 0',
    borderBottom: '0.5px solid rgba(7,22,41,0.05)',
  },
  leaderBadge: {
    fontSize: 10,
    background: 'rgba(255,203,93,0.2)',
    color: '#b87d00',
    padding: '2px 8px',
    borderRadius: 100,
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
  },
  viewAllBtn: {
    width: '100%',
    marginTop: 10,
    background: 'none',
    border: '0.5px solid rgba(7,22,41,0.1)',
    borderRadius: 100,
    padding: '6px',
    fontSize: 12,
    color: '#6e7591',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  eventsCard: {
    background: '#071629',
    borderRadius: 16,
    padding: 16,
    color: '#fff',
    marginBottom: 14,
  },
  eventRow: {
    padding: '8px 0',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
  },
  leaveBtn: {
    width: '100%',
    background: 'none',
    border: '1px solid rgba(220,38,38,0.2)',
    borderRadius: 12,
    padding: '8px',
    fontSize: 12.5,
    color: '#dc2626',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 500,
  },
};
