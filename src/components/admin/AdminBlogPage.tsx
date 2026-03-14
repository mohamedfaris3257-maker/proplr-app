'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
  author_id: string;
}

type Mode = 'list' | 'edit';

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('list');
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }: { data: BlogPost[] | null }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleNew() {
    setEditing({ title: '', slug: '', content: '', excerpt: '', published: false });
    setMode('edit');
  }

  function handleEdit(post: BlogPost) {
    setEditing({ ...post });
    setMode('edit');
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);

    const slug = editing.slug?.trim() || editing.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';
    const payload = {
      title: editing.title?.trim() ?? '',
      slug,
      content: editing.content?.trim() ?? '',
      excerpt: editing.excerpt?.trim() ?? null,
      cover_image_url: editing.cover_image_url?.trim() ?? null,
      published: editing.published ?? false,
    };

    if (editing.id) {
      const { data } = await supabase.from('blog_posts').update(payload).eq('id', editing.id).select().single() as { data: BlogPost | null };
      if (data) setPosts((prev) => prev.map((p) => p.id === data.id ? data : p));
    } else {
      const { data } = await supabase.from('blog_posts').insert(payload).select().single() as { data: BlogPost | null };
      if (data) setPosts((prev) => [data, ...prev]);
    }

    setSaving(false);
    setMode('list');
    setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function togglePublished(post: BlogPost) {
    await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id);
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, published: !p.published } : p));
  }

  if (mode === 'edit' && editing !== null) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">{editing.id ? 'Edit Post' : 'New Post'}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => { setMode('list'); setEditing(null); }}
              className="px-3 py-1.5 bg-surface-2 hover:bg-border text-text-secondary text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !editing.title?.trim()}
              className="px-4 py-1.5 bg-blue hover:bg-blue/90 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Title</label>
            <input
              type="text"
              value={editing.title ?? ''}
              onChange={(e) => setEditing((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Slug (URL)</label>
            <input
              type="text"
              value={editing.slug ?? ''}
              onChange={(e) => setEditing((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="auto-generated from title if empty"
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Excerpt (optional)</label>
            <input
              type="text"
              value={editing.excerpt ?? ''}
              onChange={(e) => setEditing((prev) => ({ ...prev, excerpt: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Cover Image URL (optional)</label>
            <input
              type="url"
              value={editing.cover_image_url ?? ''}
              onChange={(e) => setEditing((prev) => ({ ...prev, cover_image_url: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Content (Markdown)</label>
            <textarea
              value={editing.content ?? ''}
              onChange={(e) => setEditing((prev) => ({ ...prev, content: e.target.value }))}
              rows={14}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors resize-y font-mono"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={editing.published ?? false}
              onChange={(e) => setEditing((prev) => ({ ...prev, published: e.target.checked }))}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm text-text-secondary">Publish immediately</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Blog Posts</h1>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue hover:bg-blue/90 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted text-sm">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No blog posts yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{post.title}</p>
                  <p className="text-xs text-text-muted truncate">{post.slug} · {formatDate(post.created_at)}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  post.published ? 'bg-green/10 text-green' : 'bg-surface-2 text-text-muted'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => togglePublished(post)}
                    className="p-1.5 hover:bg-surface-2 rounded-lg text-text-muted hover:text-text-primary transition-colors"
                    title={post.published ? 'Unpublish' : 'Publish'}
                  >
                    {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-1.5 hover:bg-surface-2 rounded-lg text-text-muted hover:text-blue transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 hover:bg-red/10 rounded-lg text-text-muted hover:text-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
