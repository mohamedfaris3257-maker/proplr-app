'use client';

import { useState } from 'react';
import { PostCard } from '@/components/feed/PostCard';
import { createClient } from '@/lib/supabase/client';
import type { Post, PillarName } from '@/lib/types';

const PAGE_SIZE = 20;

interface FeedListProps {
  initialPosts: Post[];
  currentUserId: string;
  savedPostIdArray: string[];
  isAdmin: boolean;
  pillarFilter?: string;
}

export function FeedList({
  initialPosts,
  currentUserId,
  savedPostIdArray,
  isAdmin,
  pillarFilter,
}: FeedListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [savedPostIds] = useState<Set<string>>(
    new Set(savedPostIdArray)
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === PAGE_SIZE);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const supabase = createClient();
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('posts')
        .select('*, profiles(*)')
        .eq('is_pinned', false)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (pillarFilter) {
        query = query.eq('pillar_tag', pillarFilter as PillarName);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to load more posts:', error);
        return;
      }

      const newPosts = (data || []) as Post[];

      if (newPosts.length < PAGE_SIZE) {
        setHasMore(false);
      }

      setPosts((prev) => {
        // De-duplicate by id in case of concurrent state updates
        const existingIds = new Set(prev.map((p) => p.id));
        const unique = newPosts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...unique];
      });

      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  };

  // Keep savedPostIds in sync when the prop changes (e.g. navigation)
  // This is intentionally not a useEffect — initial state is sufficient since
  // the page server-renders fresh data on each pillar change.

  if (posts.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-text-muted text-sm">
          {pillarFilter
            ? `No posts tagged with "${pillarFilter}" yet.`
            : 'No posts yet. Check back soon!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          isSaved={savedPostIds.has(post.id)}
          isAdmin={isAdmin}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-5 py-2 bg-surface-2 hover:bg-border border border-border rounded-lg text-sm font-medium text-text-muted hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            {loading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}

      {!hasMore && posts.length > PAGE_SIZE && (
        <p className="text-center text-xs text-text-muted py-2">
          You have reached the end.
        </p>
      )}
    </div>
  );
}
