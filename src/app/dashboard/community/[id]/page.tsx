import { createClient } from '@/lib/supabase/server';
import { CommunityDetailPage } from '@/components/communities/CommunityDetailPage';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface Props {
  params: { id: string };
}

interface CommunityRow {
  id: string;
  name: string;
  description: string | null;
  type: 'cohort' | 'school' | 'interest';
  cover_url: string | null;
  created_by: string;
  is_active: boolean;
  created_at: string;
}

interface MemberRow {
  id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'admin';
  joined_at: string;
  status: string;
  profiles: {
    name: string;
    email: string;
    photo_url: string | null;
    school_name: string | null;
    type: string;
  } | null;
}

export default async function CommunityDetailRoute({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: communityData }, { data: memberRows }, { data: pendingRows }] = await Promise.all([
    supabase
      .from('communities')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('community_members')
      .select('id, role, joined_at, user_id, status, profiles(*)')
      .eq('community_id', params.id)
      .eq('status', 'approved'),
    supabase
      .from('community_members')
      .select('id, role, joined_at, user_id, status, profiles(*)')
      .eq('community_id', params.id)
      .eq('status', 'pending'),
  ]);

  if (!communityData) notFound();

  const community = communityData as unknown as CommunityRow;
  const members = (memberRows || []) as unknown as MemberRow[];
  const pendingMembers = (pendingRows || []) as unknown as MemberRow[];

  // Check if current user is a member
  const currentMember = members.find((m) => m.user_id === user!.id);
  const isAdmin = currentMember?.role === 'admin' || currentMember?.role === 'moderator';

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <CommunityDetailPage
        community={community}
        members={members}
        pendingMembers={isAdmin ? pendingMembers : []}
        currentUserId={user!.id}
        isMember={!!currentMember}
        userRole={currentMember?.role ?? null}
      />
    </div>
  );
}
