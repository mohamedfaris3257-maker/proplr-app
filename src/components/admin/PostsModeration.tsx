'use client';

import { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PillarBadge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/lib/types';

type PostWithProfile = Post & {
  profiles: { name: string } | null;
};

export function PostsModeration() {
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const supabase = createClient();
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });
    setPosts((data as PostWithProfile[]) || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from('posts').delete().eq('id', id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  }

  async function togglePin(post: PostWithProfile) {
    const supabase = createClient();
    const newVal = !post.is_pinned;
    await supabase.from('posts').update({ is_pinned: newVal }).eq('id', post.id);
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, is_pinned: newVal } : p));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text-primary">Posts Moderation</h2>
        <span className="text-xs text-text-muted">{posts.length} posts</span>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-text-muted text-sm">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="card p-8 text-center text-text-muted text-sm">No posts yet.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Author</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Content</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Pillar</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Created</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Pinned</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3 text-text-primary font-medium whitespace-nowrap">
                      {post.profiles?.name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-text-secondary max-w-[220px]">
                      <span className="truncate block">
                        {post.content.slice(0, 50)}{post.content.length > 50 ? '…' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {post.pillar_tag ? (
                        <PillarBadge pillar={post.pillar_tag} />
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePin(post)}
                        className={`transition-colors ${post.is_pinned ? 'text-gold' : 'text-text-muted hover:text-gold'}`}
                        title={post.is_pinned ? 'Unpin' : 'Pin'}
                      >
                        <Star className={`w-4 h-4 ${post.is_pinned ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-red hover:bg-red/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Post"
        size="sm"
      >
        <p className="text-sm text-text-secondary mb-4">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={() => deleteId && handleDelete(deleteId)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
