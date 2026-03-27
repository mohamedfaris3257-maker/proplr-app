import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (!data) return { title: 'Blog - Proplr' };
  return { title: `${data.title} - Proplr Blog`, description: data.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) notFound();

  return (
    <div>
      {/* ── HEADER ───────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '56px 24px 48px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-[760px] mx-auto">
          <Link href="/blog" style={{ color: '#3d9be9', fontSize: 14, fontWeight: 600, display: 'inline-block', marginBottom: 24 }}>
            ← Back to Blog
          </Link>
          <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 12 }}>
            {new Date(post.created_at).toLocaleDateString('en-AE', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629', lineHeight: 1.2, marginBottom: 16 }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={{ fontSize: 18, color: '#6e6e73', lineHeight: 1.6 }}>{post.excerpt}</p>
          )}
        </div>
      </section>

      {/* ── COVER IMAGE ──────────────────────────────────── */}
      {post.cover_image_url && (
        <div style={{ background: '#f5f5f7', padding: '0 24px' }}>
          <div className="max-w-[760px] mx-auto" style={{ paddingTop: 32, paddingBottom: 32 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt={post.title}
              style={{ width: '100%', borderRadius: 16, objectFit: 'cover', maxHeight: 400 }}
            />
          </div>
        </div>
      )}

      {/* ── CONTENT ──────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '48px 24px 80px' }}>
        <div
          className="max-w-[760px] mx-auto prose"
          style={{ color: '#1d1d1f', fontSize: 16, lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
        />
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7', padding: '48px 24px' }}>
        <div className="max-w-[760px] mx-auto text-center">
          <p style={{ color: '#6e6e73', fontSize: 15, marginBottom: 16 }}>Enjoyed this article? Explore what Proplr offers.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/enroll" className="pub-btn-primary">Get Started →</Link>
            <Link href="/blog" className="pub-btn-ghost">More Articles →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
