import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// GET — fetch feed posts from all communities the user belongs to
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;

  // Get all community IDs user is an approved member of
  const { data: memberships } = await db
    .from('community_members')
    .select('community_id')
    .eq('user_id', user.id)
    .eq('status', 'approved');

  const communityIds = (memberships || []).map((m: any) => m.community_id);

  // Check if filtering by specific community
  const url = new URL(req.url);
  const communityIdFilter = url.searchParams.get('community_id');

  if (communityIds.length === 0 && !communityIdFilter) {
    return NextResponse.json({ posts: [] });
  }

  // Build query - filter by specific community or all user's communities
  let postsQuery = db
    .from('posts')
    .select(`
      *,
      profiles!posts_user_id_fkey(name, photo_url, type, school_name),
      communities!posts_community_id_fkey(name, type),
      post_reactions(user_id, reaction)
    `);

  if (communityIdFilter) {
    postsQuery = postsQuery.eq('community_id', communityIdFilter);
  } else {
    postsQuery = postsQuery.in('community_id', communityIds);
  }

  const { data: posts, error } = await postsQuery
    .order('is_pinned', { ascending: false })
    .order('is_announcement', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[Feed GET]', error);
    // Try without the foreign key hints
    let fallbackQuery = db
      .from('posts')
      .select(`
        *,
        profiles(name, photo_url, type, school_name),
        communities(name, type),
        post_reactions(user_id, reaction)
      `);

    if (communityIdFilter) {
      fallbackQuery = fallbackQuery.eq('community_id', communityIdFilter);
    } else {
      fallbackQuery = fallbackQuery.in('community_id', communityIds);
    }

    const { data: posts2, error: error2 } = await fallbackQuery
      .order('created_at', { ascending: false })
      .limit(50);

    if (error2) {
      console.error('[Feed GET fallback]', error2);
      return NextResponse.json({ error: error2.message }, { status: 500 });
    }

    const transformed = transformPosts(posts2 || [], user.id);
    return NextResponse.json({ posts: transformed });
  }

  const transformed = transformPosts(posts || [], user.id);
  return NextResponse.json({ posts: transformed });
}

function transformPosts(posts: any[], userId: string) {
  return posts.map((post: any) => {
    const reactions = post.post_reactions || [];
    const myReaction = reactions.find((r: any) => r.user_id === userId)?.reaction || null;

    // Count reactions by type
    const reactionCounts: Record<string, number> = {};
    reactions.forEach((r: any) => {
      reactionCounts[r.reaction] = (reactionCounts[r.reaction] || 0) + 1;
    });

    // Normalize profiles (might be array from Supabase join)
    const profiles = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
    const communities = Array.isArray(post.communities) ? post.communities[0] : post.communities;

    return {
      ...post,
      profiles,
      community: communities,
      my_reaction: myReaction,
      reaction_counts: reactionCounts,
      total_reactions: reactions.length,
      post_reactions: undefined, // Remove raw data
      communities: undefined,
    };
  });
}
