import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';
import { CommunityFeed } from '@/components/communities/CommunityFeed';
import type { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div style={{ flex: 1, padding: '22px 20px' }}>
        <p style={{ color: '#6e7591', fontSize: 13 }}>Please log in to view communities.</p>
      </div>
    );
  }

  const db = tryCreateAdminClient() || supabase;

  // Parallel data fetching
  const [
    { data: profile },
    { data: memberRows },
    { data: upcomingEvents },
  ] = await Promise.all([
    db.from('profiles').select('*').eq('user_id', user.id).single(),
    db
      .from('community_members')
      .select('community_id, role, communities(id, name, type)')
      .eq('user_id', user.id)
      .eq('status', 'approved'),
    db
      .from('events')
      .select('id, title, date, time')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(4),
  ]);

  // Get member count for "connections" display
  const myCommunityIds = (memberRows || []).map((r: any) => {
    const c = Array.isArray(r.communities) ? r.communities[0] : r.communities;
    return c?.id;
  }).filter(Boolean);

  let connectionCount = 0;
  if (myCommunityIds.length > 0) {
    const { count } = await db
      .from('community_members')
      .select('*', { count: 'exact', head: true })
      .in('community_id', myCommunityIds)
      .eq('status', 'approved')
      .neq('user_id', user.id);
    connectionCount = count || 0;
  }

  // Get suggested peers (same school, not in same communities)
  let suggestedPeers: any[] = [];
  if (profile?.school_name) {
    const { data: peers } = await db
      .from('profiles')
      .select('id, user_id, name, photo_url, school_name')
      .eq('school_name', profile.school_name)
      .neq('user_id', user.id)
      .neq('type', 'admin')
      .limit(5);
    suggestedPeers = peers || [];
  }

  // Build communities list for post selector
  const myCommunities = (memberRows || []).map((r: any) => {
    const c = Array.isArray(r.communities) ? r.communities[0] : r.communities;
    return c ? { id: c.id as string, name: c.name as string, type: c.type as string } : null;
  }).filter((c): c is { id: string; name: string; type: string } => c !== null);

  // Get discover communities
  let discoverCommunities: any[] = [];
  if (myCommunityIds.length > 0) {
    const { data } = await db
      .from('communities')
      .select('id, name, description, type, cover_url')
      .eq('is_active', true)
      .not('id', 'in', `(${myCommunityIds.join(',')})`)
      .limit(6);
    discoverCommunities = data || [];
  } else {
    const { data } = await db
      .from('communities')
      .select('id, name, description, type, cover_url')
      .eq('is_active', true)
      .limit(6);
    discoverCommunities = data || [];
  }

  return (
    <CommunityFeed
      profile={profile as unknown as Profile}
      myCommunities={myCommunities}
      discoverCommunities={discoverCommunities}
      connectionCount={connectionCount}
      suggestedPeers={suggestedPeers}
      upcomingEvents={upcomingEvents || []}
    />
  );
}
