import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH — approve or reject a community member
 * Body: { member_id: string, action: 'approve' | 'reject' }
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { member_id?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { member_id, action } = body;
  if (!member_id || !action || !['approve', 'reject'].includes(action)) {
    return NextResponse.json(
      { error: 'member_id and action (approve|reject) are required' },
      { status: 400 }
    );
  }

  const newStatus = action === 'approve' ? 'approved' : 'rejected';

  const { error: updateError } = await supabase
    .from('community_members')
    .update({ status: newStatus })
    .eq('id', member_id);

  if (updateError) {
    console.error('community_members update error:', updateError);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }

  return NextResponse.json({ success: true, status: newStatus });
}

/**
 * DELETE — remove a community member
 * Body: { member_id: string }
 */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { member_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { member_id } = body;
  if (!member_id) {
    return NextResponse.json({ error: 'member_id is required' }, { status: 400 });
  }

  const { error: deleteError } = await supabase
    .from('community_members')
    .delete()
    .eq('id', member_id);

  if (deleteError) {
    console.error('community_members delete error:', deleteError);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
