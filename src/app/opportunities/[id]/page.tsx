import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { OpportunityDetail } from '@/components/opportunities/OpportunityDetail';
import { createClient } from '@/lib/supabase/server';
import type { Opportunity, ApplicationStatus, Profile } from '@/lib/types';

interface OpportunityDetailPageProps {
  params: { id: string };
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [
    { data: opportunity },
    { data: profile },
  ] = await Promise.all([
    supabase
      .from('opportunities')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single(),
  ]);

  if (!opportunity) redirect('/opportunities');
  if (!profile) redirect('/onboarding');

  const [
    { data: portfolioItems },
    { data: application },
    { data: savedItem },
  ] = await Promise.all([
    supabase
      .from('portfolio_items')
      .select('id, title')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('applications')
      .select('status')
      .eq('user_id', user.id)
      .eq('opportunity_id', params.id)
      .maybeSingle(),
    supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_id', params.id)
      .eq('item_type', 'opportunity')
      .maybeSingle(),
  ]);

  const applicationStatus: ApplicationStatus | null =
    (application?.status as ApplicationStatus) ?? null;

  const isSaved = !!savedItem;

  return (
    <AppShell>
      <OpportunityDetail
        opportunity={opportunity as Opportunity}
        currentUserId={user.id}
        profile={profile as Profile}
        portfolioItems={portfolioItems ?? []}
        applicationStatus={applicationStatus}
        isSaved={isSaved}
      />
    </AppShell>
  );
}
