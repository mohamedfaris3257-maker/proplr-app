import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAndAwardBadges, updateStreak } from '@/lib/badges';
import type { PillarName } from '@/lib/types';
import { PILLARS } from '@/lib/types';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Verify the requesting user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse and validate request body
  let body: { content?: string; pillar_tag?: string; image_url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { content, pillar_tag, image_url } = body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 });
  }

  // Validate pillar_tag if provided
  const validatedPillarTag: PillarName | null =
    pillar_tag && (PILLARS as readonly string[]).includes(pillar_tag)
      ? (pillar_tag as PillarName)
      : null;

  // Insert the post
  const { data: insertedPost, error: insertError } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content: content.trim(),
      pillar_tag: validatedPillarTag,
      image_url: image_url ?? null,
      likes_count: 0,
      is_pinned: false,
      comment_count: 0,
    })
    .select()
    .single();

  if (insertError || !insertedPost) {
    console.error('Post insert error:', insertError);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }

  // Update streak if pillar_tag is set
  if (validatedPillarTag) {
    try {
      await updateStreak(user.id, validatedPillarTag, supabase);
    } catch (err) {
      console.error('updateStreak error:', err);
    }
  }

  // Check and award badges
  try {
    await checkAndAwardBadges(user.id, supabase, 'post');
  } catch (err) {
    console.error('checkAndAwardBadges error:', err);
  }

  return NextResponse.json({ success: true, post: insertedPost }, { status: 201 });
}
