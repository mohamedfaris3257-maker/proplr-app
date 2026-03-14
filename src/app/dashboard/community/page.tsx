import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { CommunitiesPage } from '@/components/communities/CommunitiesPage';
import type { Profile } from '@/lib/types';

export const revalidate = 60;

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single();

  // Fetch communities where the user is an approved member
  const { data: memberRows } = await supabase
    .from('community_members')
    .select('community_id, role, joined_at, communities(*)')
    .eq('user_id', user!.id)
    .eq('status', 'approved');

  const typedMemberRows = (memberRows || []) as unknown as MembershipRow[];

  const myCommunities = typedMemberRows
    .map((row) => ({
      ...(row.communities as CommunityRow),
      userRole: row.role,
    }))
    .filter(Boolean) as CommunityRow[];

  const myCommunityIds = myCommunities.map((c) => c.id);

  // Fetch all active communities not already joined, limited to 20
  let discoverQuery = supabase
    .from('communities')
    .select('*')
    .eq('is_active', true)
    .limit(20);

  if (myCommunityIds.length > 0) {
    discoverQuery = discoverQuery.not('id', 'in', `(${myCommunityIds.join(',')})`);
  }

  const { data: discoverCommunities } = await discoverQuery;
  const typedDiscover = (discoverCommunities || []) as unknown as CommunityRow[];

  // Fetch member counts for all communities
  const allCommunityIds = [
    ...myCommunityIds,
    ...typedDiscover.map((c) => c.id),
  ];

  const memberCounts: Record<string, number> = {};
  if (allCommunityIds.length > 0) {
    const { data: counts } = await supabase
      .from('community_members')
      .select('community_id')
      .eq('status', 'approved')
      .in('community_id', allCommunityIds);

    ((counts || []) as unknown as CountRow[]).forEach((row) => {
      memberCounts[row.community_id] = (memberCounts[row.community_id] || 0) + 1;
    });
  }

  return (
    <AppShell>
      <CommunitiesPage
        currentUserId={user!.id}
        profile={profile as unknown as Profile}
        myCommunities={myCommunities}
        discoverCommunities={typedDiscover}
        memberCounts={memberCounts}
      />
    </AppShell>
  );
}
