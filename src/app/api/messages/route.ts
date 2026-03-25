import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// GET — list conversations or messages for a conversation
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;
  const conversationId = req.nextUrl.searchParams.get('conversation_id');

  if (conversationId) {
    // Fetch messages for a specific conversation
    const { data: messages, error } = await db
      .from('messages')
      .select('*, profiles:sender_id(name, photo_url)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('[Messages GET]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mark as read
    await db
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);

    return NextResponse.json({ messages: messages || [] });
  }

  // List all conversations for the user
  const { data: participations, error } = await db
    .from('conversation_participants')
    .select('conversation_id, last_read_at')
    .eq('user_id', user.id);

  if (error) {
    console.error('[Conversations GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!participations || participations.length === 0) {
    return NextResponse.json({ conversations: [] });
  }

  const convIds = participations.map((p: any) => p.conversation_id);

  // Get other participants for each conversation
  const { data: allParticipants } = await db
    .from('conversation_participants')
    .select('conversation_id, user_id, profiles:user_id(name, photo_url)')
    .in('conversation_id', convIds)
    .neq('user_id', user.id);

  // Get last message for each conversation
  const conversations = await Promise.all(
    convIds.map(async (convId: string) => {
      const { data: lastMsg } = await db
        .from('messages')
        .select('content, created_at, sender_id')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Count unread
      const participation = participations.find((p: any) => p.conversation_id === convId);
      const { count: unreadCount } = await db
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', convId)
        .neq('sender_id', user.id)
        .gt('created_at', participation?.last_read_at || '1970-01-01');

      const otherParticipant = (allParticipants || []).find(
        (p: any) => p.conversation_id === convId
      );

      return {
        id: convId,
        other_user: otherParticipant
          ? (Array.isArray(otherParticipant.profiles)
              ? otherParticipant.profiles[0]
              : otherParticipant.profiles)
          : null,
        other_user_id: otherParticipant?.user_id || null,
        last_message: lastMsg,
        unread_count: unreadCount || 0,
      };
    })
  );

  // Sort by last message time
  conversations.sort((a: any, b: any) => {
    const aTime = a.last_message?.created_at || '';
    const bTime = b.last_message?.created_at || '';
    return bTime.localeCompare(aTime);
  });

  return NextResponse.json({ conversations });
}

// POST — send a message or start a new conversation
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;
  const { conversation_id, recipient_id, content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Message content required' }, { status: 400 });
  }

  let convId = conversation_id;

  // If no conversation_id, create or find existing conversation with recipient
  if (!convId && recipient_id) {
    // Check if conversation already exists between these two users
    const { data: myConvs } = await db
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    const { data: theirConvs } = await db
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', recipient_id);

    const myConvIds = new Set((myConvs || []).map((c: any) => c.conversation_id));
    const existing = (theirConvs || []).find((c: any) => myConvIds.has(c.conversation_id));

    if (existing) {
      convId = existing.conversation_id;
    } else {
      // Create new conversation
      const { data: newConv, error: convError } = await db
        .from('conversations')
        .insert({})
        .select('id')
        .single();

      if (convError || !newConv) {
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
      }

      convId = newConv.id;

      // Add both participants
      await db.from('conversation_participants').insert([
        { conversation_id: convId, user_id: user.id },
        { conversation_id: convId, user_id: recipient_id },
      ]);
    }
  }

  if (!convId) {
    return NextResponse.json({ error: 'conversation_id or recipient_id required' }, { status: 400 });
  }

  // Send message
  const { data: message, error } = await db
    .from('messages')
    .insert({
      conversation_id: convId,
      sender_id: user.id,
      content: content.trim(),
    })
    .select('*')
    .single();

  if (error) {
    console.error('[Messages POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message, conversation_id: convId });
}
