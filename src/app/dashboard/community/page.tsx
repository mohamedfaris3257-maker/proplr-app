import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';
import { CommunitiesPage } from '@/components/communities/CommunitiesPage';
import type { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface CommunityRow {
  id: string;
  name: string;
  description: string | null;
  type: 'cohort' | 'school' | 'interest';
  cover_url: string | null;
  created_by: string;
  is_active: boolean;
  created_at: string;
  userRole?: string;
}

interface MembershipRow {
  community_id: string;
  role: string;
  joined_at: string;
  communities: CommunityRow | null;
}

interface CountRow {
  community_id: string;
}

export default async function CommunityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div style={{ flex: 1, padding: '22px 20px' }}>
        <p className="text-text-muted text-sm">Please log in to view communities.</p>
      </div>
    );
  }

  // Use admin client to bypass RLS for data fetching
  // Use admin client if available, fall back to session client
  const adminClient = tryCreateAdminClient() || supabase;

  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
  }

  // Fetch communities where the user is an approved member
  const { data: memberRows, error: memberError } = await adminClient
    .from('community_members')
    .select('community_id, role, joined_at, communities(*)')
    .eq('user_id', user.id)
    .eq('status', 'approved');

  if (memberError) {
    console.error('Member rows fetch error:', memberError);
  }

  const typedMemberRows = (memberRows || []) as unknown as MembershipRow[];

  const myCommunities = typedMemberRows
    .map((row) => {
      if (!row.communities) return null;
      return {
        ...(row.communities as CommunityRow),
        userRole: row.role,
      };
    })
    .filter((c): c is CommunityRow => c !== null);

  const myCommunityIds = myCommunities.map((c) => c.id);

  // Fetch all active communities not already joined, limited to 20
  let discoverQuery = adminClient
    .from('communities')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(20);

  if (myCommunityIds.length > 0) {
    discoverQuery = discoverQuery.not('id', 'in', `(${myCommunityIds.join(',')})`);
  }

  const { data: discoverCommunities, error: discoverError } = await discoverQuery;

  if (discoverError) {
    console.error('Discover communities fetch error:', discoverError);
  }

  const typedDiscover = (discoverCommunities || []) as unknown as CommunityRow[];

  // Fetch member counts for all communities
  const allCommunityIds = [
    ...myCommunityIds,
    ...typedDiscover.map((c) => c.id),
  ];

  const memberCounts: Record<string, number> = {};
  if (allCommunityIds.length > 0) {
    const { data: counts, error: countsError } = await adminClient
      .from('community_members')
      .select('community_id')
      .eq('status', 'approved')
      .in('community_id', allCommunityIds);

    if (countsError) {
      console.error('Member counts fetch error:', countsError);
    }

    ((counts || []) as unknown as CountRow[]).forEach((row) => {
      memberCounts[row.community_id] = (memberCounts[row.community_id] || 0) + 1;
    });
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <CommunitiesPage
        currentUserId={user.id}
        profile={profile as unknown as Profile}
        myCommunities={myCommunities}
        discoverCommunities={typedDiscover}
        memberCounts={memberCounts}
      />
    </div>
  );
}
