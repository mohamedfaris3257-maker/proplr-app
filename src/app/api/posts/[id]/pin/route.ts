import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  // Verify the requesting user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check that the user is an admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('type')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile || profile.type !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admins only' }, { status: 403 });
  }

  // Fetch the current is_pinned value for this post
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('is_pinned')
    .eq('id', params.id)
    .single();

  if (fetchError || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // Toggle the pin state
  const { error: updateError } = await supabase
    .from('posts')
    .update({ is_pinned: !post.is_pinned })
    .eq('id', params.id);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }

  return NextResponse.json({ success: true, is_pinned: !post.is_pinned });
}
