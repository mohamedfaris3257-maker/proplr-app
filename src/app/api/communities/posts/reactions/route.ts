import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

const VALID_REACTIONS = ['like', 'love', 'celebrate', 'insightful', 'support', 'curious'] as const;

// POST — add or change reaction on a post
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { post_id, reaction } = await req.json();
  if (!post_id || !reaction) {
    return NextResponse.json({ error: 'post_id and reaction required' }, { status: 400 });
  }
  if (!VALID_REACTIONS.includes(reaction)) {
    return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
  }

  const db = tryCreateAdminClient() || supabase;

  // Check if user already reacted
  const { data: existing } = await db
    .from('post_reactions')
    .select('id, reaction')
    .eq('post_id', post_id)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    if (existing.reaction === reaction) {
      // Same reaction = remove it (toggle off)
      const { error } = await db.from('post_reactions').delete().eq('id', existing.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ removed: true, reaction: null });
    } else {
      // Different reaction = update
      const { error } = await db
        .from('post_reactions')
        .update({ reaction })
        .eq('id', existing.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ updated: true, reaction });
    }
  } else {
    // New reaction
    const { error } = await db
      .from('post_reactions')
      .insert({ post_id, user_id: user.id, reaction });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ added: true, reaction });
  }
}

// GET — get reactions for a post
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('post_id');
  if (!postId) return NextResponse.json({ error: 'post_id required' }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;

  const { data: reactions, error } = await db
    .from('post_reactions')
    .select('reaction, user_id')
    .eq('post_id', postId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Summarize
  const counts: Record<string, number> = {};
  let myReaction: string | null = null;
  (reactions || []).forEach((r: any) => {
    counts[r.reaction] = (counts[r.reaction] || 0) + 1;
    if (r.user_id === user.id) myReaction = r.reaction;
  });

  return NextResponse.json({ counts, myReaction, total: reactions?.length || 0 });
}
