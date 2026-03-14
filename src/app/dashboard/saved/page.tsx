import { Bookmark } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PostCard } from '@/components/feed/PostCard';
import type { Post } from '@/lib/types';

export const revalidate = 0;

export default async function SavedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: savedItems } = await supabase
    .from('saved_items').select('item_id').eq('user_id', user.id).eq('item_type', 'post').order('created_at', { ascending: false });

  const savedIds = (savedItems ?? []).map((s: { item_id: string }) => s.item_id);
  let posts: Post[] = [];

  if (savedIds.length > 0) {
    const { data: postsData } = await supabase.from('posts').select('*, profiles(*)').in('id', savedIds);
    const postMap = new Map((postsData ?? []).map((p: Post) => [p.id, p]));
    posts = savedIds.map((id: string) => postMap.get(id)).filter((p): p is Post => p !== undefined);
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,168,56,0.1)' }}>
            <Bookmark className="w-5 h-5" style={{ color: '#E8A838' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight" style={{ color: '#071629' }}>Saved Posts</h1>
            <p className="text-xs" style={{ color: '#6e7591' }}>
              {posts.length > 0 ? `${posts.length} saved post${posts.length === 1 ? '' : 's'}` : 'Your bookmarked posts'}
            </p>
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => <PostCard key={post.id} post={post} currentUserId={user.id} isSaved={true} />)}
          </div>
        ) : (
          <div className="flex justify-center pt-10">
            <div className="rounded-xl p-10 flex flex-col items-center gap-4 text-center max-w-sm w-full" style={{ background: '#fff', border: '0.5px solid rgba(7,22,41,0.08)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(232,168,56,0.08)' }}>
                <Bookmark className="w-7 h-7" style={{ color: '#E8A838' }} />
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-semibold" style={{ color: '#071629' }}>No saved posts yet</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6e7591' }}>Tap the bookmark icon on any post to save it here for later.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
