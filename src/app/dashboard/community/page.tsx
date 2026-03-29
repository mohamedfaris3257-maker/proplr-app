import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';
import { CommunityWrapper } from '@/components/communities/CommunityWrapper';
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
    { data: allCommunities },
  ] = await Promise.all([
    db.from('profiles').select('*').eq('user_id', user.id).single(),
    db
      .from('community_members')
      .select('community_id, role, communities(id, name, type, description, cover_url)')
      .eq('user_id', user.id)
      .eq('status', 'approved'),
    db
      .from('events')
      .select('id, title, date, time')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(4),
    db
      .from('communities')
      .select('id, name, description, type, cover_url')
      .eq('is_active', true),
  ]);

  // Build my communities data
  const myCommunityIds: string[] = [];
  const myCommunities: { id: string; name: string; type: string }[] = [];
  const allMyCommunityData: { id: string; name: string; description: string | null; type: string; cover_url: string | null }[] = [];

  (memberRows || []).forEach((r: any) => {
    const c = Array.isArray(r.communities) ? r.communities[0] : r.communities;
    if (c) {
      myCommunityIds.push(c.id);
      myCommunities.push({ id: c.id, name: c.name, type: c.type });
      allMyCommunityData.push({
        id: c.id,
        name: c.name,
        description: c.description || null,
        type: c.type,
        cover_url: c.cover_url || null,
      });
    }
  });

  // Get member counts for all communities
  const memberCounts: Record<string, number> = {};
  if (allCommunities && allCommunities.length > 0) {
    const communityIds = allCommunities.map((c: any) => c.id);
    const { data: countRows } = await db
      .from('community_members')
      .select('community_id')
      .in('community_id', communityIds)
      .eq('status', 'approved');

    if (countRows) {
      countRows.forEach((row: any) => {
        memberCounts[row.community_id] = (memberCounts[row.community_id] || 0) + 1;
      });
    }
  }

  // Connection count
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

  // Get suggested peers
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

  // Discover communities (not joined)
  const discoverCommunities = (allCommunities || [])
    .filter((c: any) => !myCommunityIds.includes(c.id))
    .slice(0, 12);

  return (
    <CommunityWrapper
      profile={profile as unknown as Profile}
      myCommunities={myCommunities}
      discoverCommunities={discoverCommunities}
      allMyCommunityData={allMyCommunityData}
      memberCounts={memberCounts}
      connectionCount={connectionCount}
      suggestedPeers={suggestedPeers}
      upcomingEvents={upcomingEvents || []}
    />
  );
}
