import { createClient } from '@/lib/supabase/server';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunitiesFilter } from '@/components/opportunities/OpportunitiesFilter';
import type { Opportunity, ApplicationStatus, Profile } from '@/lib/types';
import { Briefcase } from 'lucide-react';

export const revalidate = 60;

interface OpportunitiesPageProps {
  searchParams: { type?: string; pillar?: string; audience?: string };
}

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [
    { data: profile },
    { data: savedItems },
    { data: applications },
    { data: portfolioItems },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('saved_items').select('item_id').eq('user_id', user.id).eq('item_type', 'opportunity'),
    supabase.from('applications').select('opportunity_id, status').eq('user_id', user.id),
    supabase.from('portfolio_items').select('id, title').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  const isSchoolStudent = profile?.type === 'school_student';

  let query = supabase.from('opportunities').select('*').eq('is_active', true).eq('status', 'approved').order('created_at', { ascending: false });
  if (isSchoolStudent) query = query.neq('type', 'job');
  if (searchParams.type) query = query.eq('type', searchParams.type);
  if (searchParams.pillar) query = query.contains('pillar_tags', [searchParams.pillar]);
  if (searchParams.audience && searchParams.audience !== 'all') query = query.in('audience', [searchParams.audience, 'both']);

  const { data: opportunities } = await query;

  const savedIds = new Set((savedItems || []).map((s: { item_id: string }) => s.item_id));
  const appMap = new Map<string, ApplicationStatus>(
    (applications || []).map((a: { opportunity_id: string; status: ApplicationStatus }) => [a.opportunity_id, a.status])
  );

  const typedProfile = profile as Profile | null;
  const typedPortfolioItems = (portfolioItems || []) as { id: string; title: string }[];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#071629' }}>
              <Briefcase className="w-6 h-6" style={{ color: '#E8A838' }} />
              Opportunities
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6e7591' }}>Internships, challenges, volunteering and more</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold" style={{ color: '#E8A838' }}>{(opportunities || []).length}</p>
            <p className="text-xs" style={{ color: '#6e7591' }}>open positions</p>
          </div>
        </div>
        <OpportunitiesFilter currentFilters={searchParams} isSchoolStudent={isSchoolStudent} />
        <div className="mt-6">
          {(opportunities || []).length === 0 ? (
            <div className="p-12 text-center" style={{ background: '#fff', borderRadius: 16 }}>
              <Briefcase className="w-10 h-10 mx-auto mb-3" style={{ color: '#6e7591' }} />
              <p className="font-medium" style={{ color: '#071629' }}>No opportunities found</p>
              <p className="text-sm mt-1" style={{ color: '#6e7591' }}>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {(opportunities as Opportunity[]).map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  currentUserId={user.id}
                  isSaved={savedIds.has(opp.id)}
                  applicationStatus={appMap.get(opp.id) || null}
                  profile={typedProfile}
                  portfolioItems={typedPortfolioItems}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
