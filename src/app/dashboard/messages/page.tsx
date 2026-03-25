import { createClient } from '@/lib/supabase/server';
import { MessagesPage } from '@/components/messages/MessagesPage';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MessagesRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, photo_url')
    .eq('user_id', user.id)
    .single();

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <MessagesPage
        currentUserId={user.id}
        currentUserName={profile?.name || ''}
      />
    </div>
  );
}
