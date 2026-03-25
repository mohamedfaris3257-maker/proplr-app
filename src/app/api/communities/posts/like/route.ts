import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// POST — toggle like on a post
export async function POST(req: NextRequest) {
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

  // Check if already liked
  const { data: existing } = await db
    .from('post_likes')
    .select('id')
    .eq('post_id', post_id)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    // Unlike
    const { error } = await db
      .from('post_likes')
      .delete()
      .eq('post_id', post_id)
      .eq('user_id', user.id);
    if (error) {
      console.error('[Like DELETE]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ liked: false });
  } else {
    // Like
    const { error } = await db
      .from('post_likes')
      .insert({ post_id, user_id: user.id });
    if (error) {
      console.error('[Like INSERT]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ liked: true });
  }
}
