import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { Avatar } from '@/components/ui/Avatar';
import { PillarRing } from '@/components/profile/PillarRing';
import { Badge, PillarBadge } from '@/components/ui/Badge';
import { IntegrationCards } from '@/components/profile/IntegrationCards';
import { ReferralCard } from '@/components/profile/ReferralCard';
import { PILLARS, PILLAR_COLORS } from '@/lib/types';
import type { Profile, PillarHour, Certificate, Application, PillarName } from '@/lib/types';
import {
  Star,
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  Crown,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 60;

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    { data: profile },
    { data: pillarHours },
    { data: certificates },
    { data: applications },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user!.id).single(),
    supabase.from('pillar_hours').select('*').eq('user_id', user!.id),
    supabase.from('certificates').select('*').eq('user_id', user!.id),
    supabase
      .from('applications')
      .select('*, opportunities(title, company, type)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  // Aggregate hours per pillar
  const hoursMap = new Map<PillarName, number>();
  PILLARS.forEach((p) => hoursMap.set(p, 0));
  (pillarHours || []).forEach((ph: PillarHour) => {
    if (ph.status === 'approved') {
      hoursMap.set(ph.pillar_name, (hoursMap.get(ph.pillar_name) || 0) + ph.hours);
    }
  });

  const totalHours = Array.from(hoursMap.values()).reduce((a, b) => a + b, 0);
  const p = profile as Profile;

  const trackLabel = p.type === 'school_student' ? 'Foundation Track' : p.type === 'uni_student' ? 'Impact Track' : 'Admin';

  const statusColor: Record<string, string> = {
    applied: 'text-blue',
    reviewing: 'text-gold',
    interview: 'text-purple',
    accepted: 'text-green',
    rejected: 'text-red',
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Profile header card */}
        <div className="card p-6 card-gradient-gold">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar name={p.name} photoUrl={p.photo_url} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-text-primary">{p.name}</h1>
                {p.is_ambassador && (
                  <span className="flex items-center gap-1 text-xs font-semibold bg-gold/15 text-gold px-2 py-0.5 rounded-full">
                    <Crown className="w-3 h-3" /> Ambassador
                  </span>
                )}
                {p.subscription_status === 'premium' && (
                  <span className="text-xs font-bold bg-purple/10 text-purple px-2 py-0.5 rounded-full">PRO</span>
                )}
              </div>
              <p className="text-text-muted text-sm mt-1">{p.email}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant="gold">{trackLabel}</Badge>
                {p.school_name && <span className="text-xs text-text-muted">{p.school_name}</span>}
                {p.grade && <span className="text-xs text-text-muted">· {p.grade}</span>}
              </div>
              {/* Career interests */}
              {(p.career_interests || []).length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {p.career_interests.map((interest) => (
                    <Badge key={interest} variant="default">{interest}</Badge>
                  ))}
                </div>
              )}
            </div>
            {/* Stats */}
            <div className="flex items-center gap-6 flex-shrink-0 sm:flex-col sm:gap-3 sm:items-end">
              <div className="text-center">
                <p className="text-2xl font-bold text-gold">{totalHours}</p>
                <p className="text-xs text-text-muted">Total Hours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue">{(certificates || []).length}</p>
                <p className="text-xs text-text-muted">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar rings */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Star className="w-4 h-4 text-gold" />
            <h2 className="text-base font-semibold text-text-primary">Pillar Progress</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 justify-items-center">
            {PILLARS.map((pillar) => (
              <PillarRing
                key={pillar}
                pillar={pillar as PillarName}
                hours={hoursMap.get(pillar as PillarName) || 0}
                size={80}
              />
            ))}
          </div>

          {/* Hour breakdown */}
          <div className="mt-5 space-y-2.5">
            {PILLARS.map((pillar) => {
              const hrs = hoursMap.get(pillar as PillarName) || 0;
              const pct = Math.min((hrs / 50) * 100, 100);
              return (
                <div key={pillar} className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary w-32 flex-shrink-0 truncate">{pillar}</span>
                  <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: PILLAR_COLORS[pillar as PillarName] }}
                    />
                  </div>
                  <span className="text-xs text-text-muted w-12 text-right flex-shrink-0">{hrs} / 50h</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificates */}
        {(certificates || []).length > 0 && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-gold" />
              <h2 className="text-base font-semibold text-text-primary">Certificates</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(certificates as Certificate[]).map((cert) => (
                <div key={cert.id} className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg border border-border">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${PILLAR_COLORS[cert.pillar_name]}20` }}
                  >
                    <Award className="w-4 h-4" style={{ color: PILLAR_COLORS[cert.pillar_name] }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">{cert.pillar_name}</p>
                    <p className="text-xs text-text-muted">{formatDate(cert.issued_at)}</p>
                  </div>
                  {cert.khda_attested && (
                    <span className="text-[10px] font-semibold bg-green/10 text-green px-1.5 py-0.5 rounded-sm flex-shrink-0">KHDA</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications */}
        {(applications || []).length > 0 && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-gold" />
              <h2 className="text-base font-semibold text-text-primary">Recent Applications</h2>
            </div>
            <div className="space-y-2">
              {(applications as Application[]).map((app) => (
                <div key={app.id} className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {(app.opportunities as { title: string; company: string; type: string } | undefined)?.title || 'Opportunity'}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {(app.opportunities as { title: string; company: string; type: string } | undefined)?.company}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold capitalize ${statusColor[app.status] || 'text-text-muted'}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pillar hours log */}
        {(pillarHours || []).length > 0 && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gold" />
              <h2 className="text-base font-semibold text-text-primary">Hours Log</h2>
            </div>
            <div className="space-y-2">
              {(pillarHours as PillarHour[]).slice(0, 10).map((ph) => (
                <div key={ph.id} className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
                  <PillarBadge pillar={ph.pillar_name} />
                  <span className="text-xs text-text-secondary flex-1 truncate">{ph.source}</span>
                  <span className="text-xs font-semibold text-text-primary">{ph.hours}h</span>
                  {ph.status === 'approved' ? (
                    <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Cards: Dibz + Compass */}
        <div className="card p-5">
          <h2 className="text-base font-semibold text-text-primary mb-4">Integrations & Partners</h2>
          <IntegrationCards profile={p} />
        </div>

        {/* Referral Card */}
        <ReferralCard />

      </div>
    </AppShell>
  );
}
