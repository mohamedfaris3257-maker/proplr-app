'use client';

import { useState, useRef } from 'react';
import { Heart, Bookmark, Share2, MessageCircle, Trash2, Megaphone } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PillarBadge } from '@/components/ui/Badge';
import { timeAgo } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Post, Comment } from '@/lib/types';
import Image from 'next/image';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  isSaved?: boolean;
  isAdmin?: boolean;
}

export function PostCard({
  post,
  currentUserId,
  isSaved: initialSaved = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAdmin: _isAdmin,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [saved, setSaved] = useState(initialSaved);

  // Comments state
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(post.comment_count || 0);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  // Share card ref
  const shareCardRef = useRef<HTMLDivElement>(null);

  const profile = post.profiles;

  const fetchComments = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(*)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    if (data) {
      setComments(data as Comment[]);
      setCommentCount(data.length);
      setCommentsLoaded(true);
    }
  };

  const handleToggleComments = async () => {
    const next = !commentsOpen;
    setCommentsOpen(next);
    if (next && !commentsLoaded) {
      await fetchComments();
    }
  };

  const handleLike = async () => {
    const supabase = createClient();
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((c) => c + (newLiked ? 1 : -1));
    await supabase
      .from('posts')
      .update({ likes_count: likesCount + (newLiked ? 1 : -1) })
      .eq('id', post.id);
  };

  const handleSave = async () => {
    const supabase = createClient();
    const newSaved = !saved;
    setSaved(newSaved);
    if (newSaved) {
      await supabase.from('saved_items').insert({
        user_id: currentUserId,
        item_id: post.id,
        item_type: 'post',
      });
    } else {
      await supabase
        .from('saved_items')
        .delete()
        .eq('user_id', currentUserId)
        .eq('item_id', post.id)
        .eq('item_type', 'post');
    }
  };

  const handlePostComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    setCommentLoading(true);
    const supabase = createClient();
    await supabase.from('comments').insert({
      post_id: post.id,
      user_id: currentUserId,
      content: trimmed,
    });
    setNewComment('');
    await fetchComments();
    setCommentLoading(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    const supabase = createClient();
    await supabase.from('comments').delete().eq('id', commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setCommentCount((n) => Math.max(0, n - 1));
  };

  const handleShare = async () => {
    if (!shareCardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#0d1624',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'proplr-post.png';
      link.click();
    } catch (err) {
      console.error('Share card generation failed:', err);
    }
  };

  const truncated =
    post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content;

  return (
    <div
      className={`card p-4 hover:shadow-card-hover transition-all duration-200 animate-slide-up ${
        post.is_pinned ? 'border-l-2 border-l-[#E8A838]' : ''
      }`}
    >
      {/* Pinned announcement badge */}
      {post.is_pinned && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#E8A838]/10 text-[#E8A838]">
            <Megaphone className="w-3 h-3" /> Announcement
          </span>
        </div>
      )}

      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={profile?.name || 'User'} photoUrl={profile?.photo_url} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary truncate">
            {profile?.name || 'User'}
          </p>
          <p className="text-xs text-text-muted">
            {profile?.school_name && (
              <span className="mr-1">{profile.school_name} ·</span>
            )}
            {timeAgo(post.created_at)}
          </p>
        </div>
        {post.pillar_tag && <PillarBadge pillar={post.pillar_tag} />}
      </div>

      {/* Content */}
      <p className="text-sm text-text-secondary leading-relaxed mb-3 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Image */}
      {post.image_url && (
        <div className="rounded-lg overflow-hidden mb-3">
          <Image
            src={post.image_url}
            alt="Post image"
            width={500}
            height={300}
            className="w-full object-cover max-h-72"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-2 border-t border-border">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            liked
              ? 'text-[#E05C3A] bg-[#E05C3A]/10'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-[#E05C3A]' : ''}`} />
          {likesCount > 0 && likesCount}
        </button>

        {/* Comment */}
        <button
          onClick={handleToggleComments}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            commentsOpen
              ? 'text-[#4A90D9] bg-[#4A90D9]/10'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          {commentCount > 0 ? commentCount : ''}
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            saved
              ? 'text-[#E8A838] bg-[#E8A838]/10'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#E8A838]' : ''}`} />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text-primary hover:bg-surface-2 transition-all duration-200 ml-auto"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Comments section */}
      {commentsOpen && (
        <div className="mt-3 pt-3 border-t border-border space-y-3">
          {/* Existing comments */}
          {comments.length === 0 && commentsLoaded && (
            <p className="text-xs text-text-muted text-center py-2">
              No comments yet. Be the first!
            </p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2 group">
              <Avatar
                name={comment.profiles?.name || 'User'}
                photoUrl={comment.profiles?.photo_url}
                size="xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold text-text-primary">
                    {comment.profiles?.name || 'User'}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {timeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed break-words">
                  {comment.content}
                </p>
              </div>
              {comment.user_id === currentUserId && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-text-muted hover:text-[#E05C3A] hover:bg-[#E05C3A]/10 transition-all duration-150 flex-shrink-0"
                  title="Delete comment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {/* New comment input */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handlePostComment();
                }
              }}
              placeholder="Write a comment..."
              className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#4A90D9] transition-colors"
            />
            <button
              onClick={handlePostComment}
              disabled={commentLoading || !newComment.trim()}
              className="px-3 py-1.5 bg-[#4A90D9] hover:bg-[#4A90D9]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {commentLoading ? '...' : 'Post'}
            </button>
          </div>
        </div>
      )}

      {/* Hidden share card — off-screen, captured by html2canvas */}
      <div
        ref={shareCardRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '600px',
          height: '315px',
          backgroundColor: '#0d1624',
          padding: '32px',
          fontFamily: 'DM Sans, sans-serif',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              color: '#E8A838',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            ✦ proplr
          </span>
          {post.pillar_tag && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#E8A838',
                background: 'rgba(232,168,56,0.12)',
                padding: '3px 10px',
                borderRadius: '4px',
              }}
            >
              {post.pillar_tag}
            </span>
          )}
        </div>

        {/* Author */}
        <div style={{ marginTop: '12px' }}>
          <p style={{ color: '#f0f4f8', fontSize: '15px', fontWeight: 600, margin: 0 }}>
            {profile?.name || 'Student'}
          </p>
          {profile?.school_name && (
            <p style={{ color: '#6b7f96', fontSize: '12px', margin: '2px 0 0' }}>
              {profile.school_name}
            </p>
          )}
        </div>

        {/* Content */}
        <p
          style={{
            color: '#c8d4e0',
            fontSize: '13px',
            lineHeight: '1.6',
            marginTop: '14px',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {truncated}
        </p>

        {/* Gold divider */}
        <div
          style={{
            height: '1px',
            background: '#E8A838',
            opacity: 0.3,
            marginTop: '16px',
            marginBottom: '10px',
          }}
        />

        {/* Date */}
        <p style={{ color: '#6b7f96', fontSize: '11px', margin: 0 }}>
          {new Date(post.created_at).toLocaleDateString('en-AE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
