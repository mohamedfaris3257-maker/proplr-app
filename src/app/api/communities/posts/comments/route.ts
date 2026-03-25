import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// GET — fetch comments for a post
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('post_id');
  if (!postId) {
    return NextResponse.json({ error: 'post_id required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const db = tryCreateAdminClient() || supabase;

  const { data: comments, error } = await db
    .from('comments')
    .select('*, profiles!comments_user_id_fkey(name, photo_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[Comments GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: comments || [] });
}

// POST — add a comment to a post
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { post_id, content } = await req.json();
  if (!post_id || !content?.trim()) {
    return NextResponse.json({ error: 'post_id and content required' }, { status: 400 });
  }

  const db = tryCreateAdminClient() || supabase;

  const { data: comment, error } = await db
    .from('comments')
    .insert({
      post_id,
      user_id: user.id,
      content: content.trim(),
    })
    .select('*, profiles!comments_user_id_fkey(name, photo_url)')
    .single();

  if (error) {
    console.error('[Comments POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, comment });
}
