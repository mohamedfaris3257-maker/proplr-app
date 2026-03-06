import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunitiesFilter } from '@/components/opportunities/OpportunitiesFilter';
import type { Opportunity, ApplicationStatus } from '@/lib/types';
import { Briefcase } from 'lucide-react';

export const revalidate = 60;

interface OpportunitiesPageProps {
  searchParams: { type?: string; pillar?: string; audience?: string };
}

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: savedItems }, { data: applications }] = await Promise.all([
    supabase.from('profiles').select('type').eq('user_id', user!.id).single(),
    supabase.from('saved_items').select('item_id').eq('user_id', user!.id).eq('item_type', 'opportunity'),
    supabase.from('applications').select('opportunity_id, status').eq('user_id', user!.id),
  ]);

  const isSchoolStudent = profile?.type === 'school_student';

  let query = supabase
    .from('opportunities')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // School students cannot see "job" type opportunities
  if (isSchoolStudent) {
    query = query.neq('type', 'job');
  }

  if (searchParams.type) {
    query = query.eq('type', searchParams.type);
  }
  if (searchParams.pillar) {
    query = query.contains('pillar_tags', [searchParams.pillar]);
  }
  if (searchParams.audience && searchParams.audience !== 'all') {
    query = query.in('audience', [searchParams.audience, 'both']);
  }

  const { data: opportunities } = await query;

  const savedIds = new Set((savedItems || []).map((s: { item_id: string }) => s.item_id));
  const appMap = new Map<string, ApplicationStatus>(
    (applications || []).map((a: { opportunity_id: string; status: ApplicationStatus }) => [a.opportunity_id, a.status])
  );

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-gold" />
              Opportunities
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Internships, challenges, volunteering and more
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-gold">{(opportunities || []).length}</p>
            <p className="text-xs text-text-muted">open positions</p>
          </div>
        </div>

        {/* Filters */}
        <OpportunitiesFilter
          currentFilters={searchParams}
          isSchoolStudent={isSchoolStudent}
        />

        {/* Grid */}
        <div className="mt-6">
          {(opportunities || []).length === 0 ? (
            <div className="card p-12 text-center">
              <Briefcase className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary font-medium">No opportunities found</p>
              <p className="text-text-muted text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {(opportunities as Opportunity[]).map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  currentUserId={user!.id}
                  isSaved={savedIds.has(opp.id)}
                  applicationStatus={appMap.get(opp.id) || null}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
