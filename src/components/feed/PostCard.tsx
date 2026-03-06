'use client';

import { useState } from 'react';
import { Heart, Bookmark, Share2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PillarBadge } from '@/components/ui/Badge';
import { timeAgo } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/lib/types';
import Image from 'next/image';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  isSaved?: boolean;
}

export function PostCard({ post, currentUserId, isSaved: initialSaved = false }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [saved, setSaved] = useState(initialSaved);
  const supabase = createClient();

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((c) => c + (newLiked ? 1 : -1));
    await supabase
      .from('posts')
      .update({ likes_count: likesCount + (newLiked ? 1 : -1) })
      .eq('id', post.id);
  };

  const handleSave = async () => {
    const newSaved = !saved;
    setSaved(newSaved);
    if (newSaved) {
      await supabase.from('saved_items').insert({
        user_id: currentUserId,
        item_id: post.id,
        item_type: 'post',
      });
    } else {
      await supabase.from('saved_items')
        .delete()
        .eq('user_id', currentUserId)
        .eq('item_id', post.id)
        .eq('item_type', 'post');
    }
  };

  const profile = post.profiles;

  return (
    <div className="card p-4 hover:shadow-card-hover transition-all duration-200 animate-fade-in">
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={profile?.name || 'User'} photoUrl={profile?.photo_url} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary truncate">{profile?.name || 'User'}</p>
          <p className="text-xs text-text-muted">{timeAgo(post.created_at)}</p>
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
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            liked ? 'text-red bg-red/10' : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red' : ''}`} />
          {likesCount > 0 && likesCount}
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            saved ? 'text-gold bg-gold/10' : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-gold' : ''}`} />
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text-primary hover:bg-surface-2 transition-all duration-200 ml-auto">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
