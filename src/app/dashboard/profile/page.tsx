import { createClient } from '@/lib/supabase/server';
import { Avatar } from '@/components/ui/Avatar';
import { PillarRing } from '@/components/profile/PillarRing';
import { Badge, PillarBadge } from '@/components/ui/Badge';
import { IntegrationCards } from '@/components/profile/IntegrationCards';
import { ReferralCard } from '@/components/profile/ReferralCard';
import { PILLARS, PILLAR_COLORS } from '@/lib/types';
import type { Profile, PillarHour, Certificate, Application, PillarName } from '@/lib/types';
import { Star, Award, Briefcase, CheckCircle2, Clock, Crown } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 60;

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [
    { data: profile },
    { data: pillarHours },
    { data: certificates },
    { data: applications },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('pillar_hours').select('*').eq('user_id', user.id),
    supabase.from('certificates').select('*').eq('user_id', user.id),
    supabase.from('applications').select('*, opportunities(title, company, type)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
  ]);

  const hoursMap = new Map<PillarName, number>();
  PILLARS.forEach((p) => hoursMap.set(p, 0));
  (pillarHours || []).forEach((ph: PillarHour) => {
    if (ph.status === 'approved') hoursMap.set(ph.pillar_name, (hoursMap.get(ph.pillar_name) || 0) + ph.hours);
  });

  const totalHours = Array.from(hoursMap.values()).reduce((a, b) => a + b, 0);
  const p = profile as Profile;
  const trackLabel = p.type === 'school_student' ? 'Foundation Track' : p.type === 'uni_student' ? 'Impact Track' : 'Admin';

  const statusColor: Record<string, string> = {
    applied: '#3d9be9', reviewing: '#E8A838', interview: '#9B59B6', accepted: '#27AE60', rejected: '#E05C3A',
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile header */}
        <div style={{ background: 'linear-gradient(135deg, rgba(232,168,56,0.06) 0%, transparent 60%)', borderRadius: 16, padding: 24 }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar name={p.name} photoUrl={p.photo_url} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold" style={{ color: '#071629' }}>{p.name}</h1>
                {p.is_ambassador && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,168,56,0.15)', color: '#E8A838' }}>
                    <Crown className="w-3 h-3" /> Ambassador
                  </span>
                )}
              </div>
              <p className="text-sm mt-1" style={{ color: '#6e7591' }}>{p.email}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant="gold">{trackLabel}</Badge>
                {p.school_name && <span className="text-xs" style={{ color: '#6e7591' }}>{p.school_name}</span>}
                {p.grade && <span className="text-xs" style={{ color: '#6e7591' }}>· {p.grade}</span>}
              </div>
              {(p.career_interests || []).length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {p.career_interests.map((interest) => <Badge key={interest} variant="default">{interest}</Badge>)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 flex-shrink-0 sm:flex-col sm:gap-3 sm:items-end">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#E8A838' }}>{totalHours}</p>
                <p className="text-xs" style={{ color: '#6e7591' }}>Total Hours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#3d9be9' }}>{(certificates || []).length}</p>
                <p className="text-xs" style={{ color: '#6e7591' }}>Certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar rings */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
          <div className="flex items-center gap-2 mb-5">
            <Star className="w-4 h-4" style={{ color: '#E8A838' }} />
            <h2 className="text-base font-semibold" style={{ color: '#071629' }}>Pillar Progress</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 justify-items-center">
            {PILLARS.map((pillar) => <PillarRing key={pillar} pillar={pillar as PillarName} hours={hoursMap.get(pillar as PillarName) || 0} size={80} />)}
          </div>
          <div className="mt-5 space-y-2.5">
            {PILLARS.map((pillar) => {
              const hrs = hoursMap.get(pillar as PillarName) || 0;
              const pct = Math.min((hrs / 50) * 100, 100);
              return (
                <div key={pillar} className="flex items-center gap-3">
                  <span className="text-xs w-32 flex-shrink-0 truncate" style={{ color: '#071629' }}>{pillar}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#eef0f8' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: PILLAR_COLORS[pillar as PillarName] }} />
                  </div>
                  <span className="text-xs w-12 text-right flex-shrink-0" style={{ color: '#6e7591' }}>{hrs} / 50h</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificates */}
        {(certificates || []).length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4" style={{ color: '#E8A838' }} />
              <h2 className="text-base font-semibold" style={{ color: '#071629' }}>Certificates</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(certificates as Certificate[]).map((cert) => (
                <div key={cert.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#f5f5f7', border: '0.5px solid rgba(7,22,41,0.06)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${PILLAR_COLORS[cert.pillar_name]}20` }}>
                    <Award className="w-4 h-4" style={{ color: PILLAR_COLORS[cert.pillar_name] }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate" style={{ color: '#071629' }}>{cert.pillar_name}</p>
                    <p className="text-xs" style={{ color: '#6e7591' }}>{formatDate(cert.issued_at)}</p>
                  </div>
                  {cert.khda_attested && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm flex-shrink-0" style={{ background: 'rgba(39,174,96,0.1)', color: '#27AE60' }}>KHDA</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications */}
        {(applications || []).length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4" style={{ color: '#E8A838' }} />
              <h2 className="text-base font-semibold" style={{ color: '#071629' }}>Recent Applications</h2>
            </div>
            <div className="space-y-2">
              {(applications as Application[]).map((app) => (
                <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#f5f5f7' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#071629' }}>
                      {(app.opportunities as { title: string; company: string; type: string } | undefined)?.title || 'Opportunity'}
                    </p>
                    <p className="text-xs truncate" style={{ color: '#6e7591' }}>
                      {(app.opportunities as { title: string; company: string; type: string } | undefined)?.company}
                    </p>
                  </div>
                  <span className="text-xs font-semibold capitalize" style={{ color: statusColor[app.status] || '#6e7591' }}>{app.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hours log */}
        {(pillarHours || []).length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4" style={{ color: '#E8A838' }} />
              <h2 className="text-base font-semibold" style={{ color: '#071629' }}>Hours Log</h2>
            </div>
            <div className="space-y-2">
              {(pillarHours as PillarHour[]).slice(0, 10).map((ph) => (
                <div key={ph.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#f5f5f7' }}>
                  <PillarBadge pillar={ph.pillar_name} />
                  <span className="text-xs flex-1 truncate" style={{ color: '#071629' }}>{ph.source}</span>
                  <span className="text-xs font-semibold" style={{ color: '#071629' }}>{ph.hours}h</span>
                  {ph.status === 'approved'
                    ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#27AE60' }} />
                    : <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#E8A838' }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#071629' }}>Integrations & Partners</h2>
          <IntegrationCards profile={p} />
        </div>

        <ReferralCard />
      </div>
    </div>
  );
}
