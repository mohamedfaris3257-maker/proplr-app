import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';
import { CommunityInnerPage } from '@/components/communities/CommunityInnerPage';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export default async function CommunityDetailRoute({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const db = tryCreateAdminClient() || supabase;

  const [
    { data: communityData },
    { data: memberRows },
    { data: pendingRows },
    { data: userProfile },
  ] = await Promise.all([
    db.from('communities').select('*').eq('id', params.id).single(),
    db
      .from('community_members')
      .select('id, role, joined_at, user_id, status, profiles(name, photo_url, type)')
      .eq('community_id', params.id)
      .eq('status', 'approved')
      .order('role', { ascending: true }),
    db
      .from('community_members')
      .select('id, role, joined_at, user_id, status, profiles(name, photo_url, type, school_name, email)')
      .eq('community_id', params.id)
      .eq('status', 'pending'),
    db.from('profiles').select('name, type, photo_url').eq('user_id', user.id).single(),
  ]);

  if (!communityData) notFound();

  // Supabase may return profiles as array or object depending on the join — normalize
  const normalize = (rows: any[]) =>
    rows.map((r: any) => ({
      ...r,
      profiles: Array.isArray(r.profiles) ? r.profiles[0] ?? null : r.profiles,
    }));
  const members = normalize(memberRows || []);
  const pendingMembers = normalize(pendingRows || []);
  const currentMember = members.find((m: any) => m.user_id === user.id);
  const isCommunityAdmin = currentMember?.role === 'admin' || currentMember?.role === 'moderator';
  const isPlatformAdmin = userProfile?.type === 'admin';
  const canManage = isCommunityAdmin || isPlatformAdmin;

  // Fetch community events (if events table has community_id column)
  let communityEvents: any[] = [];
  try {
    const { data: events } = await db
      .from('events')
      .select('*')
      .eq('community_id', params.id)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(3);
    communityEvents = events || [];
  } catch {
    // community_id column may not exist yet, gracefully ignore
  }

  return (
    <CommunityInnerPage
      community={communityData}
      members={members}
      pendingMembers={canManage ? pendingMembers : []}
      communityEvents={communityEvents}
      currentUserId={user.id}
      currentUserName={userProfile?.name || ''}
      currentUserPhoto={userProfile?.photo_url || null}
      isMember={!!currentMember}
      userRole={currentMember?.role ?? (isPlatformAdmin ? 'admin' : null)}
      isPlatformAdmin={isPlatformAdmin}
    />
  );
}
