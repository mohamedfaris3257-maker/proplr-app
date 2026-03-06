import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { PostCard } from '@/components/feed/PostCard';
import { UpcomingEventsWidget } from '@/components/feed/UpcomingEventsWidget';
import { PillarBadge } from '@/components/ui/Badge';
import { PILLARS } from '@/lib/types';
import type { Post, Event, Profile, PillarName } from '@/lib/types';
import { Zap } from 'lucide-react';

export const revalidate = 60;

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    { data: posts },
    { data: profile },
    { data: events },
    { data: savedItems },
  ] = await Promise.all([
    supabase
      .from('posts')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user!.id)
      .single(),
    supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(3),
    supabase
      .from('saved_items')
      .select('item_id')
      .eq('user_id', user!.id)
      .eq('item_type', 'post'),
  ]);

  const savedPostIds = new Set((savedItems || []).map((s: { item_id: string }) => s.item_id));

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome banner */}
        <div className="card card-gradient-gold p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-text-primary">
              Welcome back, {(profile as Profile)?.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              {(profile as Profile)?.type === 'school_student' ? 'Proplr Foundation Track' : 'Proplr Impact Track'} · Keep building your pillars
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main feed */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Pillar filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-text-muted flex-shrink-0">Filter:</span>
              {PILLARS.map((p) => (
                <div key={p} className="flex-shrink-0">
                  <PillarBadge pillar={p as PillarName} className="cursor-pointer" />
                </div>
              ))}
            </div>

            {/* Posts */}
            {(posts || []).length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-text-muted text-sm">No posts yet. Check back soon!</p>
              </div>
            ) : (
              (posts as Post[]).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user!.id}
                  isSaved={savedPostIds.has(post.id)}
                />
              ))
            )}
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
