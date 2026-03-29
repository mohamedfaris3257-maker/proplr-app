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
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px' }}>
      <div className="max-w-6xl mx-auto">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, padding: '20px 24px',
          background: '#111f36', borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 800,
              color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 10,
              letterSpacing: -0.3,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'rgba(249,115,22,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Briefcase className="w-5 h-5" style={{ color: '#f97316' }} />
              </div>
              Opportunities
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '6px 0 0 50px' }}>Internships, challenges, volunteering and more</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 28, fontWeight: 800, color: '#f97316', margin: 0 }}>{(opportunities || []).length}</p>
            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>open positions</p>
          </div>
        </div>
        <OpportunitiesFilter currentFilters={searchParams} isSchoolStudent={isSchoolStudent} />
        <div className="mt-6">
          {(opportunities || []).length === 0 ? (
            <div style={{
              padding: 48, textAlign: 'center',
              background: '#111f36', borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <Briefcase className="w-10 h-10 mx-auto mb-3" style={{ color: '#64748b' }} />
              <p style={{ fontWeight: 700, color: '#e2e8f0', fontFamily: "'Montserrat', sans-serif" }}>No opportunities found</p>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Try adjusting your filters</p>
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
