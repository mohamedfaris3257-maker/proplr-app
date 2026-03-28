import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Blog - Proplr', description: 'Career tips, platform updates, and student stories.' };

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
}

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const items = (posts ?? []) as BlogPost[];

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '72px 24px 56px' }}>
        <div className="max-w-[1200px] mx-auto">
          <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#071629', marginBottom: 12 }}>
            Proplr Blog.
          </h1>
          <p className="reveal reveal-delay-1" style={{ color: '#6e6e73', fontSize: 17 }}>
            Career tips, platform updates, and student stories.
          </p>
        </div>
      </section>

      {/* ── POSTS ─────────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7', padding: '48px 24px 80px' }}>
        <div className="max-w-[1200px] mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-20 reveal">
              <p style={{ color: '#6e6e73', fontSize: 16, marginBottom: 8 }}>No posts published yet.</p>
              <p style={{ color: '#9ca3af', fontSize: 14 }}>Check back soon - we&apos;re writing.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`pub-card reveal reveal-delay-${(i % 3) + 1} block overflow-hidden`}
                  style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  {post.cover_image_url ? (
                    <div style={{ width: '100%', height: 180, background: '#e5e7eb', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: 180, background: 'linear-gradient(135deg, #e8f3fc 0%, #f5f5f7 100%)' }} />
                  )}
                  <div style={{ padding: '20px 24px 24px' }}>
                    <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 8 }}>
                      {new Date(post.created_at).toLocaleDateString('en-AE', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 17, color: '#071629', lineHeight: 1.35, marginBottom: 10 }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.excerpt}
                      </p>
                    )}
                    <span style={{ color: '#3d9be9', fontSize: 13, fontWeight: 600 }}>Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
