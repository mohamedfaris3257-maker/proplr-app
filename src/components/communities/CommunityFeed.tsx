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
  const [showFullContent, setShowFullContent] = useState<Record<string, boolean>>({});
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
        const community = myCommunities.find((c) => c.id === selectedCommunity);
        const newPost: FeedPost = {
          ...data.post,
          profiles: { name: profile.name, photo_url: profile.photo_url, type: profile.type },
          community: community ? { name: community.name, type: community.type } : null,
          my_reaction: null,
          reaction_counts: {},
          total_reactions: 0,
          comments_count: 0,
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
          return { ...p, my_reaction: null, reaction_counts: newCounts, total_reactions: p.total_reactions - 1 };
        }
        newCounts[reaction] = (newCounts[reaction] || 0) + 1;
        return { ...p, my_reaction: reaction, reaction_counts: newCounts, total_reactions: oldReaction ? p.total_reactions : p.total_reactions + 1 };
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
    }
  }

  function quickLike(postId: string) {
    const post = posts.find((p) => p.id === postId);
    handleReaction(postId, post?.my_reaction || 'like');
  }

  /* ─── Comments ────────────────────────────────────────────────────── */

  async function toggleComments(postId: string) {
    if (openComments === postId) { setOpenComments(null); return; }
    setOpenComments(postId);
    if (!comments[postId]) {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));
      try {
        const res = await fetch(`/api/communities/posts/comments?post_id=${postId}`);
        const data = await res.json();
        setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
      } catch (err) { console.error('Comments error:', err); }
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
        setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), data.comment] }));
        setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p));
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (err) { console.error('Comment error:', err); }
  }

  function toggleFullContent(postId: string) {
    setShowFullContent((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  /* ─── Helpers ─────────────────────────────────────────────────────── */

  function getTopReactionEmojis(post: FeedPost): string[] {
    return Object.entries(post.reaction_counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key]) => REACTION_EMOJI[key] || '👍');
  }

  function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* ─── Render ──────────────────────────────────────────────────────── */

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f3f2ef', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 24, maxWidth: 1128, margin: '0 auto', padding: '24px 16px', alignItems: 'flex-start' }}>

        {/* ━━━━ LEFT PANEL ━━━━ */}
        <div style={{ flex: '0 0 240px', position: 'sticky', top: 20 }}>

          {/* Profile card */}
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: 8 }}>
            <div style={{ height: 56, background: 'linear-gradient(135deg, #071629 0%, #3d9be9 100%)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>PROPLR</div>
            </div>
            <div style={{ padding: '0 16px 12px', position: 'relative' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#3d9be9', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 24, marginTop: -32, marginBottom: 6 }}>
                {initial}
              </div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 15, color: '#000' }}>{profile.name}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2, lineHeight: 1.4 }}>
                {profile.school_name || 'Student'} · Proplr Member
              </div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Dubai, UAE</div>
              <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.1)', marginTop: 10, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#666' }}>Profile views</span>
                  <span style={{ color: '#3d9be9', fontWeight: 600 }}>—</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#666' }}>Post impressions</span>
                  <span style={{ color: '#3d9be9', fontWeight: 600 }}>—</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '8px 0', marginBottom: 8 }}>
            {[
              { icon: '🔖', label: 'Saved items', href: '/dashboard/community' },
              { icon: '👥', label: 'Communities', href: '/dashboard/community' },
              { icon: '📰', label: 'Newsletters', href: '/dashboard/community' },
              { icon: '📅', label: 'Events', href: '/dashboard/events' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', fontSize: 13.5, color: '#000', textDecoration: 'none' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Discover communities */}
          {discoverCommunities.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '12px 16px' }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: '#000', marginBottom: 10 }}>
                Discover Communities
              </div>
              {discoverCommunities.slice(0, 4).map((c: any) => (
                <Link
                  key={c.id}
                  href={`/dashboard/community/${c.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', textDecoration: 'none', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(61,155,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                    {c.type === 'cohort' ? '👥' : c.type === 'school' ? '🏫' : '💡'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: 10.5, color: '#666', textTransform: 'capitalize' }}>{c.type}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ━━━━ CENTER FEED ━━━━ */}
        <div style={{ flex: 1, maxWidth: 600, minWidth: 0 }}>

          {/* Post creation box */}
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '12px 16px', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#3d9be9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17, flexShrink: 0, border: '1px solid rgba(0,0,0,0.15)' }}>
                {initial}
              </div>
              <button
                onClick={() => setShowPostModal(true)}
                style={{ flex: 1, textAlign: 'left', background: 'transparent', border: '1px solid rgba(0,0,0,0.3)', borderRadius: 32, padding: '10px 16px', fontSize: 14, color: '#666', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                Start a post
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {[
                { icon: '🎥', label: 'Video' },
                { icon: '🖼', label: 'Photo' },
                { icon: '✍️', label: 'Write article' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => setShowPostModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'none', border: 'none', borderRadius: 8, fontSize: 13.5, color: '#666', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 18 }}>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort bar */}
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '8px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 13, color: '#666' }}>Sort by: </span>
            <button style={{ fontSize: 13, fontWeight: 700, color: '#000', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
              Top ▾
            </button>
          </div>

          {/* Feed posts */}
          {loading ? (
            <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: 40, textAlign: 'center', color: '#666', fontSize: 13 }}>
              Loading your feed...
            </div>
          ) : posts.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: '#000', margin: '0 0 4px' }}>
                Your feed is empty
              </h3>
              <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                {myCommunities.length === 0
                  ? 'Join a community to see posts in your feed!'
                  : 'Be the first to share something with your community!'}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: 8, overflow: 'hidden' }}>

                {/* Announcement banner */}
                {post.is_announcement && (
                  <div style={{ background: '#ffcb5d', padding: '5px 16px', fontSize: 11, fontWeight: 700, color: '#071629', letterSpacing: 0.5 }}>
                    📢 ANNOUNCEMENT
                  </div>
                )}

                {/* Post header */}
                <div style={{ padding: '12px 16px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#3d9be9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17, flexShrink: 0 }}>
                        {getInitials(post.profiles?.name || '?')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#000', lineHeight: 1.2 }}>
                          {post.profiles?.name || 'Unknown'}
                        </div>
                        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.4 }}>
                          {post.profiles?.type?.replace('_', ' ')}
                          {post.community && (
                            <>
                              {' · Proplr '}
                              <Link href={`/dashboard/community/${post.community_id}`} style={{ color: '#666', textDecoration: 'none' }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}>
                                {post.community.name}
                              </Link>
                            </>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {timeAgo(post.created_at)} · <span style={{ fontSize: 14 }}>🌐</span>
                        </div>
                      </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 20, padding: '0 4px' }}>···</button>
                  </div>

                  {/* Post content */}
                  <p style={{ fontSize: 14, color: '#000', lineHeight: 1.6, margin: '0 0 10px', whiteSpace: 'pre-wrap' }}>
                    {showFullContent[post.id] || post.content.length < 200
                      ? post.content
                      : post.content.slice(0, 200) + '...'}
                    {post.content.length > 200 && (
                      <button
                        onClick={() => toggleFullContent(post.id)}
                        style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700 }}
                      >
                        {showFullContent[post.id] ? ' less' : ' ...more'}
                      </button>
                    )}
                  </p>
                </div>

                {/* Post image */}
                {post.image_url && (
                  <img src={post.image_url} alt="" style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
                )}

                {/* Reaction summary row */}
                {(post.total_reactions > 0 || post.comments_count > 0) && (
                  <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#666' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {getTopReactionEmojis(post).map((emoji, i) => (
                        <span key={i} style={{ fontSize: 14 }}>{emoji}</span>
                      ))}
                      {post.total_reactions > 0 && <span>{post.total_reactions}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {post.comments_count > 0 && (
                        <span
                          onClick={() => toggleComments(post.id)}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
                        >
                          {post.comments_count} comments
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.1)', margin: '0 16px' }} />

                {/* Action buttons — LinkedIn style */}
                <div style={{ padding: '2px 8px', display: 'flex', position: 'relative' }}>
                  <button
                    onClick={() => quickLike(post.id)}
                    onMouseEnter={() => setReactionPickerPost(post.id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '10px 4px', background: 'none', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: post.my_reaction ? '#3d9be9' : '#666', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                  >
                    <span style={{ fontSize: 18 }}>{post.my_reaction ? REACTION_EMOJI[post.my_reaction] : '👍'}</span>
                    {post.my_reaction ? capitalize(post.my_reaction) : 'Like'}
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '10px 4px', background: 'none', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#666', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 18 }}>💬</span>Comment
                  </button>
                  <button
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '10px 4px', background: 'none', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#666', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 18 }}>🔁</span>Repost
                  </button>
                  <button
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '10px 4px', background: 'none', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#666', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 18 }}>📤</span>Send
                  </button>

                  {/* Reaction picker popup */}
                  {reactionPickerPost === post.id && (
                    <div
                      ref={pickerRef}
                      onMouseLeave={() => setReactionPickerPost(null)}
                      style={{ position: 'absolute', bottom: '100%', left: 8, background: '#fff', borderRadius: 32, padding: '8px 12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'inline-flex', gap: 4, zIndex: 100, marginBottom: 4 }}
                    >
                      {REACTIONS.map((r) => (
                        <button
                          key={r.key}
                          onClick={() => handleReaction(post.id, r.key)}
                          title={r.label}
                          style={{ fontSize: 26, background: 'none', border: 'none', cursor: 'pointer', borderRadius: '50%', padding: 4, transition: 'transform 0.15s', lineHeight: 1 }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.4)'; (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.background = 'none'; }}
                        >
                          {r.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments section */}
                {openComments === post.id && (
                  <div style={{ padding: '8px 16px 14px', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
                    {/* Comment input */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3d9be9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                        {initial}
                      </div>
                      <div style={{ flex: 1, border: '1px solid rgba(0,0,0,0.3)', borderRadius: 32, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          placeholder="Add a comment..."
                          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit', background: 'transparent' }}
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') submitComment(post.id); }}
                        />
                        <button
                          onClick={() => submitComment(post.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: commentInputs[post.id]?.trim() ? '#3d9be9' : '#666' }}
                        >
                          ➤
                        </button>
                      </div>
                    </div>

                    {loadingComments[post.id] && (
                      <div style={{ fontSize: 12, color: '#666', padding: '8px 0' }}>Loading comments...</div>
                    )}

                    {/* Comments list */}
                    {(comments[post.id] || []).map((comment) => (
                      <div key={comment.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6e7591', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                          {getInitials(comment.profiles?.name || '?')}
                        </div>
                        <div>
                          <div style={{ background: '#f3f2ef', borderRadius: '0 12px 12px 12px', padding: '8px 12px', display: 'inline-block', maxWidth: 400 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#000' }}>{comment.profiles?.name || 'Unknown'}</div>
                            <div style={{ fontSize: 13, color: '#000', marginTop: 2 }}>{comment.content}</div>
                          </div>
                          <div style={{ fontSize: 11.5, color: '#666', marginTop: 4, paddingLeft: 4 }}>{timeAgo(comment.created_at)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ━━━━ RIGHT PANEL ━━━━ */}
        <div style={{ flex: '0 0 280px', position: 'sticky', top: 20 }}>

          {/* Proplr Updates (like LinkedIn News) */}
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '12px 16px', marginBottom: 8 }}>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 15, color: '#000', marginBottom: 12 }}>Proplr Updates</div>
            {[
              { title: 'National Showcase 2026 announced', time: 'Coming soon', readers: null },
              { title: 'New pillar sessions added for Term 2', time: '2h ago', readers: 124 },
              { title: 'Industry mentors joining this month', time: '1d ago', readers: 89 },
              { title: 'Foundation program applications open', time: '3d ago', readers: 203 },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#000', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 700, color: '#000', lineHeight: 1.3, cursor: 'pointer' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#666', marginTop: 2 }}>
                    {item.time}{item.readers ? ` · ${item.readers} readers` : ''}
                  </div>
                </div>
              </div>
            ))}
            <button style={{ fontSize: 13, color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, marginTop: 4 }}>
              Show more ▾
            </button>
          </div>

          {/* Suggested connections */}
          {suggestedPeers.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '12px 16px' }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 15, color: '#000', marginBottom: 12 }}>
                People you may know
              </div>
              {suggestedPeers.map((peer: any) => (
                <div key={peer.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#6e7591', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, flexShrink: 0 }}>
                    {getInitials(peer.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#000' }}>{peer.name}</div>
                    <div style={{ fontSize: 12, color: '#666', lineHeight: 1.3 }}>{peer.school_name}</div>
                    <button
                      style={{ marginTop: 6, background: 'transparent', border: '1.5px solid #666', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      + Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming events */}
          {upcomingEvents.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '12px 16px', marginTop: 8 }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: '#000', marginBottom: 10 }}>
                📅 Upcoming Events
              </div>
              {upcomingEvents.map((event: any) => (
                <div key={event.id} style={{ padding: '6px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#000' }}>{event.title}</div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    {new Date(event.date).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                    {event.time ? ` · ${event.time}` : ''}
                  </div>
                </div>
              ))}
              <Link href="/dashboard/events" style={{ display: 'block', marginTop: 8, fontSize: 12, color: '#3d9be9', textDecoration: 'none', fontWeight: 600 }}>
                See all events →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ━━━━ POST CREATION MODAL ━━━━ */}
      {showPostModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowPostModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 12, width: 560, maxWidth: '95vw', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: '14px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 16, color: '#000' }}>Create a post</span>
              <button onClick={() => setShowPostModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#666', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                ✕
              </button>
            </div>

            {/* Author row */}
            <div style={{ padding: '14px 20px 0', display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#3d9be9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                {initial}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#000' }}>{profile.name}</div>
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  style={{ fontSize: 12, border: '1px solid rgba(0,0,0,0.3)', borderRadius: 16, padding: '2px 10px', cursor: 'pointer', fontFamily: 'inherit', marginTop: 2, background: '#fff' }}
                >
                  {myCommunities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Textarea */}
            <div style={{ padding: '12px 20px' }}>
              <textarea
                placeholder="What do you want to talk about?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                style={{ width: '100%', minHeight: 180, border: 'none', outline: 'none', fontSize: 16, fontFamily: 'inherit', resize: 'none', color: '#000', lineHeight: 1.6 }}
                autoFocus
              />
            </div>

            {/* Announcement toggle for admins */}
            {isAdmin && (
              <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="announcement" checked={isAnnouncement} onChange={(e) => setIsAnnouncement(e.target.checked)} />
                <label htmlFor="announcement" style={{ fontSize: 13, color: '#666', cursor: 'pointer' }}>📢 Post as Announcement</label>
              </div>
            )}

            {/* Bottom bar */}
            <div style={{ padding: '10px 20px 14px', borderTop: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, marginRight: 'auto' }}>
                {['🖼', '🎥', '📊', '😊'].map((icon) => (
                  <button
                    key={icon}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, borderRadius: '50%', padding: 6 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <button
                onClick={handlePost}
                disabled={!postContent.trim() || posting}
                style={{
                  background: postContent.trim() ? '#0a66c2' : '#e0e0e0',
                  color: postContent.trim() ? '#fff' : '#999',
                  border: 'none',
                  borderRadius: 20,
                  padding: '8px 22px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: postContent.trim() ? 'pointer' : 'default',
                  fontFamily: 'inherit',
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
