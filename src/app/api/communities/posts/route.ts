import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// GET — fetch posts for a community
export async function GET(req: NextRequest) {
  const communityId = req.nextUrl.searchParams.get('community_id');
  if (!communityId) {
    return NextResponse.json({ error: 'community_id required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const db = tryCreateAdminClient() || supabase;

  // Fetch posts with author profiles and whether current user liked each post
  const { data: posts, error } = await db
    .from('posts')
    .select(`
      *,
      profiles!posts_user_id_fkey(name, photo_url, type),
      post_likes(user_id)
    `)
    .eq('community_id', communityId)
    .order('is_announcement', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[Community Posts GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform: mark which posts current user liked
  const transformed = (posts || []).map((post: any) => ({
    ...post,
    liked_by_me: (post.post_likes || []).some((l: any) => l.user_id === user.id),
    post_likes: undefined, // remove raw likes array
  }));

  return NextResponse.json({ posts: transformed });
}

// POST — create a new post in a community
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const { community_id, content, pillar_tag, is_announcement } = body;

  if (!community_id || !content?.trim()) {
    return NextResponse.json({ error: 'community_id and content required' }, { status: 400 });
  }

  const db = tryCreateAdminClient() || supabase;

  // Verify user is a member
  const { data: membership } = await db
    .from('community_members')
    .select('id, role, status')
    .eq('community_id', community_id)
    .eq('user_id', user.id)
    .single();

  if (!membership || membership.status !== 'approved') {
    return NextResponse.json({ error: 'You must be an approved member to post' }, { status: 403 });
  }

  // Only admins/moderators can post announcements
  const canAnnounce = membership.role === 'admin' || membership.role === 'moderator';

  // Check if user is platform admin
  let isPlatformAdmin = false;
  if (!canAnnounce) {
    const { data: profile } = await db
      .from('profiles')
      .select('type')
      .eq('user_id', user.id)
      .single();
    isPlatformAdmin = profile?.type === 'admin';
  }

  const { data: post, error } = await db
    .from('posts')
    .insert({
      user_id: user.id,
      community_id,
      content: content.trim(),
      pillar_tag: pillar_tag || null,
      is_announcement: (canAnnounce || isPlatformAdmin) && !!is_announcement,
    })
    .select('*, profiles!posts_user_id_fkey(name, photo_url, type)')
    .single();

  if (error) {
    console.error('[Community Posts POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, post: { ...post, liked_by_me: false } });
}

// PATCH — pin/unpin a post
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { post_id, is_pinned } = await req.json();
  if (!post_id || typeof is_pinned !== 'boolean') {
    return NextResponse.json({ error: 'post_id and is_pinned required' }, { status: 400 });
  }

  const db = tryCreateAdminClient() || supabase;

  // Check if user is admin or community leader
  const { data: post } = await db.from('posts').select('community_id, user_id').eq('id', post_id).single();
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  const { data: profile } = await db.from('profiles').select('type').eq('user_id', user.id).single();
  const { data: membership } = await db
    .from('community_members')
    .select('role')
    .eq('community_id', post.community_id)
    .eq('user_id', user.id)
    .single();

  const canPin = profile?.type === 'admin' || membership?.role === 'admin' || membership?.role === 'moderator';
  if (!canPin) return NextResponse.json({ error: 'Only admins can pin posts' }, { status: 403 });

  const { error } = await db.from('posts').update({ is_pinned }).eq('id', post_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, is_pinned });
}

// DELETE — delete a post
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { post_id } = await req.json();
  if (!post_id) {
    return NextResponse.json({ error: 'post_id required' }, { status: 400 });
  }

  const db = tryCreateAdminClient() || supabase;

  // Check ownership or admin
  const { data: post } = await db
    .from('posts')
    .select('user_id')
    .eq('id', post_id)
    .single();

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const { data: profile } = await db
    .from('profiles')
    .select('type')
    .eq('user_id', user.id)
    .single();

  if (post.user_id !== user.id && profile?.type !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const { error } = await db.from('posts').delete().eq('id', post_id);
  if (error) {
    console.error('[Community Posts DELETE]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
