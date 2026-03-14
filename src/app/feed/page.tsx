import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { PostComposer } from '@/components/feed/PostComposer';
import { UpcomingEventsWidget } from '@/components/feed/UpcomingEventsWidget';
import { PostCard } from '@/components/feed/PostCard';
import { FeedFilters } from '@/components/feed/FeedFilters';
import { FeedList } from '@/components/feed/FeedList';
import type { Post, Event, Profile, PillarName } from '@/lib/types';
import { Zap, Megaphone } from 'lucide-react';

export const revalidate = 60;

interface FeedPageProps {
  searchParams: { pillar?: string };
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pillar = searchParams.pillar;

  // Build the regular posts query with optional pillar filter
  let regularPostsQuery = supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('is_pinned', false)
    .order('created_at', { ascending: false })
    .limit(20);

  if (pillar) {
    regularPostsQuery = regularPostsQuery.eq('pillar_tag', pillar as PillarName);
  }

  const [
    { data: pinnedPosts },
    { data: regularPosts },
    { data: profile },
    { data: events },
    { data: savedItems },
  ] = await Promise.all([
    // Pinned / announcement posts (not filtered by pillar)
    supabase
      .from('posts')
      .select('*, profiles(*)')
      .eq('is_pinned', true)
      .order('created_at', { ascending: false }),

    // Regular (non-pinned) posts — limited to first page of 20
    regularPostsQuery,

    // Current user's profile
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user!.id)
      .single(),

    // Upcoming events for sidebar widget
    supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(3),

    // Saved post IDs for current user
    supabase
      .from('saved_items')
      .select('item_id')
      .eq('user_id', user!.id)
      .eq('item_type', 'post'),
  ]);

  const savedPostIds = new Set(
    (savedItems || []).map((s: { item_id: string }) => s.item_id)
  );

  const typedProfile = profile as Profile | null;
  const isAdmin = typedProfile?.type === 'admin';

  const allPinnedPosts = (pinnedPosts || []) as Post[];
  const allRegularPosts = (regularPosts || []) as Post[];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome banner */}
        <div className="card card-gradient-gold p-5 mb-6 flex items-center gap-4 animate-slide-up">
          <div className="w-11 h-11 rounded-xl bg-[#E8A838]/20 flex items-center justify-center flex-shrink-0 border border-[#E8A838]/20">
            <Zap className="w-5 h-5 text-[#E8A838]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-text-primary">
              Welcome back, <span className="text-[#E8A838]">{typedProfile?.name?.split(' ')[0] || 'Student'}</span>
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              {typedProfile?.type === 'school_student'
                ? 'Proplr Foundation Track'
                : 'Proplr Impact Track'}{' '}
              · Keep building your pillars
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
              {new Date().toLocaleDateString('en-AE', { weekday: 'short' })}
            </p>
            <p className="text-xs font-semibold text-text-secondary">
              {new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main feed */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Post composer */}
            <PostComposer currentUserId={user!.id} />

            {/* Pillar filter */}
            <FeedFilters activePillar={pillar} />

            {/* Pinned announcements — shown regardless of pillar filter */}
            {allPinnedPosts.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#E8A838]" /> Announcements
                </h2>
                {allPinnedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user!.id}
                    isSaved={savedPostIds.has(post.id)}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}

            {/* Regular posts with load-more infinite scroll */}
            <FeedList
              initialPosts={allRegularPosts}
              currentUserId={user!.id}
              savedPostIdArray={Array.from(savedPostIds)}
              isAdmin={isAdmin}
              pillarFilter={pillar}
            />
          </div>

          {/* Right sidebar */}
          <div className="hidden xl:flex flex-col gap-4 w-72 flex-shrink-0">
            <UpcomingEventsWidget events={(events || []) as Event[]} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
