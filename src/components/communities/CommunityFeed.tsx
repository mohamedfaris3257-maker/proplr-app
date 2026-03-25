'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import type { Profile } from '@/lib/types';
import { getInitials, timeAgo } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────────── */

interface FeedPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  is_announcement: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  community_id: string;
  profiles: { name: string; photo_url: string | null; type: string; school_name?: string } | null;
  community: { name: string; type: string } | null;
  my_reaction: string | null;
  reaction_counts: Record<string, number>;
  total_reactions: number;
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: { name: string; photo_url: string | null } | null;
}

interface CommunityOption {
  id: string;
  name: string;
  type: string;
}

interface Props {
  profile: Profile;
  myCommunities: CommunityOption[];
  discoverCommunities: any[];
  connectionCount: number;
  suggestedPeers: any[];
  upcomingEvents: any[];
}

/* ─── Reactions Config ───────────────────────────────────────────────── */

const REACTIONS = [
  { key: 'like', emoji: '👍', label: 'Like' },
  { key: 'love', emoji: '❤️', label: 'Love' },
  { key: 'celebrate', emoji: '🎉', label: 'Celebrate' },
  { key: 'insightful', emoji: '💡', label: 'Insightful' },
  { key: 'support', emoji: '👏', label: 'Support' },
  { key: 'curious', emoji: '🤔', label: 'Curious' },
];

const REACTION_EMOJI: Record<string, string> = Object.fromEntries(
  REACTIONS.map((r) => [r.key, r.emoji])
);

/* ─── Component ──────────────────────────────────────────────────────── */

export function CommunityFeed({
  profile,
  myCommunities,
  discoverCommunities,
  connectionCount,
  suggestedPeers,
  upcomingEvents,
}: Props) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(myCommunities[0]?.id || '');
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [posting, setPosting] = useState(false);
  const [reactionPickerPost, setReactionPickerPost] = useState<string | null>(null);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const pickerRef = useRef<HTMLDivElement>(null);

  const isAdmin = profile.type === 'admin';
  const initial = getInitials(profile.name);

  /* ─── Fetch feed ──────────────────────────────────────────────────── */

  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch (err) {
      console.error('Feed fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Close reaction picker on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setReactionPickerPost(null);
      }
    }
    if (reactionPickerPost) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [reactionPickerPost]);

  /* ─── Post creation ───────────────────────────────────────────────── */

  async function handlePost() {
    if (!postContent.trim() || !selectedCommunity || posting) return;
    setPosting(true);
    try {
      const res = await fetch('/api/communities/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          community_id: selectedCommunity,
          content: postContent.trim(),
          is_announcement: isAdmin && isAnnouncement,
        }),
      });
      const data = await res.json();
      if (data.success && data.post) {
        // Add community info to the new post
        const community = myCommunities.find((c) => c.id === selectedCommunity);
        const newPost: FeedPost = {
          ...data.post,
          community: community ? { name: community.name, type: community.type } : null,
          my_reaction: null,
          reaction_counts: {},
          total_reactions: 0,
        };
        setPosts((prev) => [newPost, ...prev]);
        setPostContent('');
        setIsAnnouncement(false);
        setShowPostModal(false);
      }
    } catch (err) {
      console.error('Post error:', err);
    }
    setPosting(false);
  }

  /* ─── Reactions ───────────────────────────────────────────────────── */

  async function handleReaction(postId: string, reaction: string) {
    setReactionPickerPost(null);

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const oldReaction = p.my_reaction;
        const newCounts = { ...p.reaction_counts };

        if (oldReaction) {
          newCounts[oldReaction] = Math.max(0, (newCounts[oldReaction] || 0) - 1);
          if (newCounts[oldReaction] === 0) delete newCounts[oldReaction];
        }

        if (oldReaction === reaction) {
          // Toggle off
          return {
            ...p,
            my_reaction: null,
            reaction_counts: newCounts,
            total_reactions: p.total_reactions - 1,
          };
        }

        newCounts[reaction] = (newCounts[reaction] || 0) + 1;
        return {
          ...p,
          my_reaction: reaction,
          reaction_counts: newCounts,
          total_reactions: oldReaction ? p.total_reactions : p.total_reactions + 1,
        };
      })
    );

    try {
      await fetch('/api/communities/posts/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, reaction }),
      });
    } catch (err) {
      console.error('Reaction error:', err);
      // Could revert optimistic update here
    }
  }

  function quickLike(postId: string) {
    const post = posts.find((p) => p.id === postId);
    handleReaction(postId, post?.my_reaction || 'like');
  }

  /* ─── Comments ────────────────────────────────────────────────────── */

  async function toggleComments(postId: string) {
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }
    setOpenComments(postId);

    if (!comments[postId]) {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));
      try {
        const res = await fetch(`/api/communities/posts/comments?post_id=${postId}`);
        const data = await res.json();
        setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
      } catch (err) {
        console.error('Comments error:', err);
      }
      setLoadingComments((prev) => ({ ...prev, [postId]: false }));
    }
  }

  async function submitComment(postId: string) {
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
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment],
        }));
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
          )
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error('Comment error:', err);
    }
  }

  /* ─── Reaction display helpers ────────────────────────────────────── */

  function getTopReactionEmojis(post: FeedPost) {
    const sorted = Object.entries(post.reaction_counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    return sorted.map(([key]) => REACTION_EMOJI[key] || '👍').join('');
  }

  /* ─── Render ──────────────────────────────────────────────────────── */

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f0f2f8' }}>
      <div style={s.container}>
        {/* ──── LEFT PANEL ──── */}
        <div style={s.leftCol}>
          {/* Profile Summary Card */}
          <div style={s.profileCard}>
            <div style={s.profileBanner} />
            <div style={s.profileBody}>
              <div style={s.profileAvatar}>{initial}</div>
              <div style={s.profileName}>{profile.name}</div>
              <div style={s.profileMeta}>
                {profile.school_name || 'Student'} · {profile.type === 'admin' ? 'Admin' : 'Member'}
              </div>
              <div style={s.profileStats}>
                <div style={s.profileStatRow}>
                  <span style={{ color: '#6e7591' }}>Profile views</span>
                  <span style={{ color: '#3d9be9', fontWeight: 600 }}>—</span>
                </div>
                <div style={{ ...s.profileStatRow, marginTop: 6 }}>
                  <span style={{ color: '#6e7591' }}>Connections</span>
                  <span style={{ color: '#3d9be9', fontWeight: 600 }}>{connectionCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick nav links */}
          <div style={s.quickNav}>
            {[
              { icon: '👥', label: 'My Communities', href: '/dashboard/community' },
              { icon: '🔖', label: 'Saved Posts', href: '/dashboard/community' },
              { icon: '📅', label: 'Events', href: '/dashboard/events' },
              { icon: '💼', label: 'Opportunities', href: '/dashboard/opportunities' },
            ].map((item) => (
              <Link key={item.label} href={item.href} style={s.quickNavItem}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Discover communities */}
          {discoverCommunities.length > 0 && (
            <div style={s.discoverCard}>
              <div style={s.cardTitle}>🌍 Discover Communities</div>
              {discoverCommunities.slice(0, 4).map((c: any) => (
                <Link
                  key={c.id}
                  href={`/dashboard/community/${c.id}`}
                  style={s.discoverItem}
                >
                  <div style={s.discoverIcon}>
                    {c.type === 'cohort' ? '👥' : c.type === 'school' ? '🏫' : '💡'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: '#071629', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#6e7591', textTransform: 'capitalize' }}>
                      {c.type}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ──── CENTER — Feed ──── */}
        <div style={s.centerCol}>
          {/* Post creation prompt */}
          <div style={s.postPrompt}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <div style={s.avatarLg}>{initial}</div>
              <button onClick={() => setShowPostModal(true)} style={s.postPromptBtn}>
                Share something with your community...
              </button>
            </div>
            <div style={s.postPromptActions}>
              {[
                { icon: '🖼', label: 'Photo' },
                { icon: '🎥', label: 'Video' },
                { icon: '📝', label: 'Article' },
                { icon: '📊', label: 'Poll' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => setShowPostModal(true)}
                  style={s.postPromptAction}
                >
                  <span>{action.icon}</span> {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feed posts */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6e7591', fontSize: 13 }}>
              Loading your feed...
            </div>
          ) : posts.length === 0 ? (
            <div style={s.emptyFeed}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: '#071629', margin: '0 0 4px' }}>
                Your feed is empty
              </h3>
              <p style={{ fontSize: 13, color: '#6e7591', margin: 0 }}>
                {myCommunities.length === 0
                  ? 'Join a community to see posts in your feed!'
                  : 'Be the first to share something with your community!'}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} style={s.postCard}>
                {/* Announcement banner */}
                {post.is_announcement && (
                  <div style={s.announcementBanner}>📢 ANNOUNCEMENT</div>
                )}

                <div style={{ padding: '14px 18px 10px' }}>
                  {/* Post header */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <div style={s.avatarLg}>
                      {getInitials(post.profiles?.name || '?')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: '#071629' }}>
                        {post.profiles?.name || 'Unknown'}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#6e7591' }}>
                        {post.profiles?.type?.replace('_', ' ')} · {timeAgo(post.created_at)}
                        {post.community && (
                          <span>
                            {' · '}
                            <Link
                              href={`/dashboard/community/${post.community_id}`}
                              style={{ color: '#3d9be9', textDecoration: 'none' }}
                            >
                              {post.community.name}
                            </Link>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p style={s.postContent}>{post.content}</p>
                </div>

                {/* Reaction counts bar */}
                {(post.total_reactions > 0 || post.comments_count > 0) && (
                  <div style={s.countsBar}>
                    <span>
                      {post.total_reactions > 0 && (
                        <>
                          {getTopReactionEmojis(post)} {post.total_reactions}
                        </>
                      )}
                    </span>
                    <span>
                      {post.comments_count > 0 && `${post.comments_count} comments`}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div style={s.actionBar}>
                  <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
                    <button
                      onClick={() => quickLike(post.id)}
                      onMouseEnter={() => setReactionPickerPost(post.id)}
                      style={{
                        ...s.actionButton,
                        color: post.my_reaction ? '#3d9be9' : '#6e7591',
                        fontWeight: post.my_reaction ? 600 : 400,
                        flex: 1,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>
                        {post.my_reaction ? REACTION_EMOJI[post.my_reaction] : '👍'}
                      </span>
                      <span style={{ fontSize: 12 }}>
                        {post.my_reaction
                          ? REACTIONS.find((r) => r.key === post.my_reaction)?.label || 'Like'
                          : 'Like'}
                      </span>
                    </button>

                    {/* Reaction picker */}
                    {reactionPickerPost === post.id && (
                      <div
                        ref={pickerRef}
                        onMouseLeave={() => setReactionPickerPost(null)}
                        style={s.reactionPicker}
                      >
                        {REACTIONS.map((r) => (
                          <button
                            key={r.key}
                            onClick={() => handleReaction(post.id, r.key)}
                            title={r.label}
                            style={s.reactionBtn}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.transform = 'scale(1.35)';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.transform = 'scale(1)';
                            }}
                          >
                            {r.emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleComments(post.id)}
                    style={{ ...s.actionButton, flex: 1 }}
                  >
                    <span style={{ fontSize: 16 }}>💬</span>
                    <span style={{ fontSize: 12 }}>Comment</span>
                  </button>
                  <button style={{ ...s.actionButton, flex: 1 }}>
                    <span style={{ fontSize: 16 }}>🔁</span>
                    <span style={{ fontSize: 12 }}>Repost</span>
                  </button>
                  <button style={{ ...s.actionButton, flex: 1 }}>
                    <span style={{ fontSize: 16 }}>📤</span>
                    <span style={{ fontSize: 12 }}>Share</span>
                  </button>
                </div>

                {/* Comments section */}
                {openComments === post.id && (
                  <div style={s.commentsSection}>
                    {/* Comment input */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, marginTop: 12 }}>
                      <div style={s.avatarSm}>{initial}</div>
                      <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                        <input
                          placeholder="Add a comment..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitComment(post.id);
                          }}
                          style={s.commentInput}
                        />
                        <button
                          onClick={() => submitComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                          style={s.commentSendBtn}
                        >
                          Post
                        </button>
                      </div>
                    </div>

                    {loadingComments[post.id] && (
                      <div style={{ fontSize: 12, color: '#6e7591', padding: '8px 0' }}>
                        Loading comments...
                      </div>
                    )}

                    {/* Comments list */}
                    {(comments[post.id] || []).map((comment) => (
                      <div key={comment.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <div style={s.avatarSm}>
                          {getInitials(comment.profiles?.name || '?')}
                        </div>
                        <div style={s.commentBubble}>
                          <div style={{ fontWeight: 600, fontSize: 12.5, color: '#071629' }}>
                            {comment.profiles?.name || 'Unknown'}
                          </div>
                          <div style={{ fontSize: 12.5, color: '#1d1d1f', marginTop: 2 }}>
                            {comment.content}
                          </div>
                          <div style={{ fontSize: 10, color: '#6e7591', marginTop: 4 }}>
                            {timeAgo(comment.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ──── RIGHT PANEL ──── */}
        <div style={s.rightCol}>
          {/* Suggested peers */}
          {suggestedPeers.length > 0 && (
            <div style={s.whiteCard}>
              <div style={s.cardTitle}>People in your school</div>
              {suggestedPeers.map((peer: any) => (
                <div key={peer.id} style={s.peerRow}>
                  <div style={s.peerAvatar}>{getInitials(peer.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: '#071629' }}>
                      {peer.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#6e7591' }}>
                      {peer.school_name}
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/messages?user=${peer.user_id}`}
                    style={s.connectBtn}
                  >
                    Message
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming events */}
          <div style={s.eventsCard}>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 12 }}>
              📅 Upcoming
            </div>
            {upcomingEvents.length === 0 ? (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                No upcoming events.
              </p>
            ) : (
              upcomingEvents.map((event: any) => (
                <div key={event.id} style={s.eventRow}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff' }}>
                    {event.title}
                  </div>
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
            <Link href="/dashboard/events" style={s.seeAllLink}>
              See all events →
            </Link>
          </div>

          {/* My communities quick list */}
          {myCommunities.length > 0 && (
            <div style={s.whiteCard}>
              <div style={s.cardTitle}>👥 My Communities</div>
              {myCommunities.map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/community/${c.id}`}
                  style={s.communityMiniRow}
                >
                  <span style={{ fontSize: 13 }}>
                    {c.type === 'cohort' ? '👥' : c.type === 'school' ? '🏫' : '💡'}
                  </span>
                  <span style={{ fontSize: 12.5, color: '#071629' }}>{c.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ──── Post Creation Modal ──── */}
      {showPostModal && (
        <div style={s.modalOverlay} onClick={() => setShowPostModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={s.avatarLg}>{initial}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#071629' }}>
                    {profile.name}
                  </div>
                  <select
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    style={s.communitySelect}
                  >
                    {myCommunities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button onClick={() => setShowPostModal(false)} style={s.closeBtn}>
                ✕
              </button>
            </div>

            <textarea
              autoFocus
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              style={s.modalTextarea}
            />

            {isAdmin && (
              <label style={s.announcementCheck}>
                <input
                  type="checkbox"
                  checked={isAnnouncement}
                  onChange={(e) => setIsAnnouncement(e.target.checked)}
                  style={{ marginRight: 6 }}
                />
                📢 Post as Announcement
              </label>
            )}

            <div style={s.modalFooter}>
              <button
                onClick={handlePost}
                disabled={!postContent.trim() || !selectedCommunity || posting}
                style={{
                  ...s.postButton,
                  opacity: !postContent.trim() || posting ? 0.5 : 1,
                }}
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────── */

const s: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: 20,
    maxWidth: 1100,
    margin: '0 auto',
    padding: '20px 16px',
    alignItems: 'flex-start',
  },

  /* Left column */
  leftCol: { flex: '0 0 240px', position: 'sticky' as const, top: 20 },
  profileCard: {
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
    marginBottom: 12,
  },
  profileBanner: {
    height: 60,
    background: 'linear-gradient(135deg, #071629 0%, #3d9be9 100%)',
  },
  profileBody: { padding: '0 16px 16px', marginTop: -24 },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: '#3d9be9',
    border: '3px solid #fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 8,
  },
  profileName: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    color: '#071629',
  },
  profileMeta: { fontSize: 12, color: '#6e7591', marginTop: 2 },
  profileStats: {
    borderTop: '0.5px solid rgba(7,22,41,0.08)',
    marginTop: 12,
    paddingTop: 12,
  },
  profileStatRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
  },
  quickNav: {
    background: '#fff',
    borderRadius: 16,
    padding: 14,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
    marginBottom: 12,
  },
  quickNavItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 4px',
    fontSize: 13,
    color: '#1d1d1f',
    textDecoration: 'none',
    borderBottom: '0.5px solid rgba(7,22,41,0.05)',
  },
  discoverCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 14,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
  },
  discoverItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 2px',
    textDecoration: 'none',
    borderBottom: '0.5px solid rgba(7,22,41,0.04)',
  },
  discoverIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: 'rgba(61,155,233,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    flexShrink: 0,
  },

  /* Center column */
  centerCol: { flex: 1, minWidth: 0 },
  postPrompt: {
    background: '#fff',
    borderRadius: 16,
    padding: '14px 16px',
    marginBottom: 12,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
  },
  postPromptBtn: {
    flex: 1,
    textAlign: 'left' as const,
    background: 'transparent',
    border: '0.5px solid rgba(7,22,41,0.15)',
    borderRadius: 100,
    padding: '10px 16px',
    fontSize: 13,
    color: '#6e7591',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  postPromptActions: {
    display: 'flex',
    gap: 4,
    paddingTop: 8,
    borderTop: '0.5px solid rgba(7,22,41,0.06)',
  },
  postPromptAction: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    background: 'none',
    border: 'none',
    borderRadius: 8,
    fontSize: 12.5,
    color: '#6e7591',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  emptyFeed: {
    background: '#fff',
    borderRadius: 16,
    padding: 40,
    textAlign: 'center' as const,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
  },

  /* Post cards */
  postCard: {
    background: '#fff',
    borderRadius: 16,
    marginBottom: 10,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
    overflow: 'hidden',
  },
  announcementBanner: {
    background: '#ffcb5d',
    padding: '6px 18px',
    fontSize: 11,
    fontWeight: 700,
    color: '#071629',
    letterSpacing: 1,
  },
  postContent: {
    fontSize: 14,
    color: '#1d1d1f',
    lineHeight: 1.6,
    margin: '0 0 4px',
    whiteSpace: 'pre-wrap' as const,
  },
  countsBar: {
    padding: '4px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#6e7591',
    borderBottom: '0.5px solid rgba(7,22,41,0.06)',
  },
  actionBar: {
    padding: '4px 10px',
    display: 'flex',
    gap: 2,
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '8px 4px',
    background: 'none',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    color: '#6e7591',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.15s',
  },

  /* Avatars */
  avatarLg: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: '#3d9be9',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
  },
  avatarSm: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,203,93,0.3), rgba(61,155,233,0.3))',
    color: '#b87d00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 11,
    flexShrink: 0,
  },

  /* Reaction picker */
  reactionPicker: {
    position: 'absolute' as const,
    bottom: '100%',
    left: 0,
    background: '#fff',
    borderRadius: 100,
    padding: '8px 12px',
    boxShadow: '0 4px 20px rgba(7,22,41,0.15)',
    display: 'flex',
    gap: 4,
    zIndex: 100,
    marginBottom: 4,
  },
  reactionBtn: {
    fontSize: 22,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.15s',
    borderRadius: '50%',
    padding: 4,
    lineHeight: 1,
  },

  /* Comments */
  commentsSection: {
    padding: '0 18px 14px',
    borderTop: '0.5px solid rgba(7,22,41,0.06)',
  },
  commentInput: {
    flex: 1,
    border: '0.5px solid rgba(7,22,41,0.12)',
    borderRadius: 100,
    padding: '8px 14px',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
  },
  commentSendBtn: {
    background: '#3d9be9',
    color: '#fff',
    border: 'none',
    borderRadius: 100,
    padding: '8px 16px',
    fontSize: 12.5,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
  },
  commentBubble: {
    background: '#f0f2f8',
    borderRadius: '0 12px 12px 12px',
    padding: '8px 12px',
    flex: 1,
  },

  /* Right column */
  rightCol: { flex: '0 0 280px', position: 'sticky' as const, top: 20 },
  whiteCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 1px 8px rgba(7,22,41,0.06)',
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: '#071629',
    marginBottom: 12,
  },
  peerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 0',
    borderBottom: '0.5px solid rgba(7,22,41,0.05)',
  },
  peerAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,203,93,0.3), rgba(61,155,233,0.3))',
    color: '#b87d00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
  },
  connectBtn: {
    fontSize: 12,
    color: '#3d9be9',
    background: 'rgba(61,155,233,0.08)',
    border: '0.5px solid rgba(61,155,233,0.2)',
    borderRadius: 100,
    padding: '4px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
    textDecoration: 'none',
  },
  eventsCard: {
    background: '#071629',
    borderRadius: 16,
    padding: 16,
    color: '#fff',
    marginBottom: 12,
  },
  eventRow: {
    padding: '8px 0',
    borderBottom: '0.5px solid rgba(255,255,255,0.07)',
  },
  seeAllLink: {
    display: 'block',
    marginTop: 10,
    fontSize: 12,
    color: '#ffcb5d',
    textDecoration: 'none',
  },
  communityMiniRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 2px',
    textDecoration: 'none',
    borderBottom: '0.5px solid rgba(7,22,41,0.04)',
  },

  /* Modal */
  modalOverlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(7,22,41,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 560,
    boxShadow: '0 16px 60px rgba(7,22,41,0.25)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '0.5px solid rgba(7,22,41,0.08)',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(7,22,41,0.05)',
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6e7591',
  },
  communitySelect: {
    fontSize: 12,
    color: '#3d9be9',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginTop: 2,
    fontWeight: 500,
  },
  modalTextarea: {
    width: '100%',
    minHeight: 180,
    padding: '16px 20px',
    border: 'none',
    outline: 'none',
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    color: '#1d1d1f',
    resize: 'none' as const,
    lineHeight: 1.6,
  },
  announcementCheck: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px 12px',
    fontSize: 12.5,
    color: '#6e7591',
    cursor: 'pointer',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '12px 20px',
    borderTop: '0.5px solid rgba(7,22,41,0.08)',
  },
  postButton: {
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
};
