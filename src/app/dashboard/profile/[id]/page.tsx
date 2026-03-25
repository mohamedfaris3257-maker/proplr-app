import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';
import { PILLARS, PILLAR_COLORS, BADGE_META } from '@/lib/types';
import type { PillarName, PillarHour, Certificate, Badge as BadgeType } from '@/lib/types';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function getInitials(name: string): string {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = tryCreateAdminClient() || supabase;

  // Fetch profile — id could be user_id (auth id) or profile id
  let profile: any = null;

  // Try as user_id first (auth id — what leaderboard uses)
  const { data: profileByUserId } = await db
    .from('profiles')
    .select('*')
    .eq('user_id', id)
    .single();

  if (profileByUserId) {
    profile = profileByUserId;
  } else {
    // Try as profile id
    const { data: profileById } = await db
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    profile = profileById;
  }

  if (!profile) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 700, color: '#000', marginBottom: 6 }}>
            Profile not found
          </h2>
          <p style={{ fontSize: 13, color: '#666' }}>This user may not exist or their profile is private.</p>
          <Link href="/dashboard/community" style={{ display: 'inline-block', marginTop: 16, fontSize: 13, color: '#3d9be9', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to feed
          </Link>
        </div>
      </div>
    );
  }

  // Fetch related data in parallel
  const [
    { data: pillarHours },
    { data: certificates },
    { data: badges },
  ] = await Promise.all([
    db.from('pillar_hours').select('*').eq('user_id', profile.user_id).eq('status', 'approved'),
    db.from('certificates').select('*').eq('user_id', profile.user_id),
    db.from('badges').select('*').eq('user_id', profile.user_id),
  ]);

  // Calculate hours per pillar
  const hoursMap = new Map<string, number>();
  PILLARS.forEach((p) => hoursMap.set(p, 0));
  (pillarHours || []).forEach((ph: PillarHour) => {
    hoursMap.set(ph.pillar_name, (hoursMap.get(ph.pillar_name) || 0) + ph.hours);
  });
  const totalHours = Array.from(hoursMap.values()).reduce((a, b) => a + b, 0);
  const pillarsCompleted = Array.from(hoursMap.entries()).filter(([, h]) => h >= 50).length;

  const isOwnProfile = user.id === profile.user_id;
  const initial = getInitials(profile.name);
  const trackLabel = profile.type === 'school_student' ? 'Foundation' : profile.type === 'uni_student' ? 'Impact' : 'Admin';

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f3f2ef' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>

        {/* Profile Header Card */}
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: 8 }}>
          {/* Banner */}
          <div style={{ height: 120, background: 'linear-gradient(135deg, #071629 0%, #3d9be9 100%)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5 }}>PROPLR</div>
          </div>

          {/* Profile info */}
          <div style={{ padding: '0 24px 20px', position: 'relative' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%', background: '#3d9be9',
              border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 36,
              marginTop: -48, marginBottom: 8,
            }}>
              {initial}
            </div>

            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 22, color: '#000', margin: '0 0 2px' }}>
              {profile.name}
            </h1>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
              {trackLabel} Program {profile.school_name ? `· ${profile.school_name}` : ''}
            </div>
            {profile.grade && (
              <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>Grade {profile.grade}</div>
            )}

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
              <div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 22, color: '#E8A838' }}>{totalHours}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Total Hours</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 22, color: '#3d9be9' }}>{(certificates || []).length}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Certificates</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 22, color: '#27AE60' }}>{pillarsCompleted}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Pillars Done</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 22, color: '#9B59B6' }}>{(badges || []).length}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Badges</div>
              </div>
            </div>

            {/* Actions */}
            {!isOwnProfile && (
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Link
                  href={`/dashboard/messages?user=${profile.user_id}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#3d9be9', color: '#fff', border: 'none', borderRadius: 20,
                    padding: '8px 20px', fontSize: 14, fontWeight: 700, textDecoration: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  💬 Message
                </Link>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'transparent', color: '#000', border: '1.5px solid #666',
                  borderRadius: 20, padding: '8px 20px', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  + Connect
                </button>
              </div>
            )}
            {isOwnProfile && (
              <Link
                href="/dashboard/profile"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'transparent', color: '#3d9be9', border: '1.5px solid #3d9be9',
                  borderRadius: 20, padding: '8px 20px', fontSize: 14, fontWeight: 700,
                  textDecoration: 'none', fontFamily: 'inherit', marginTop: 16,
                }}
              >
                ✏️ Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* Pillar Progress */}
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '16px 20px', marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 15, color: '#000', marginBottom: 14 }}>
            Pillar Progress
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PILLARS.map((pillar) => {
              const hrs = hoursMap.get(pillar) || 0;
              const pct = Math.min((hrs / 50) * 100, 100);
              return (
                <div key={pillar} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12.5, width: 130, flexShrink: 0, color: '#000', fontWeight: 500 }}>{pillar}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#eef0f4', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${pct}%`, background: PILLAR_COLORS[pillar as PillarName], transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#666', width: 50, textAlign: 'right', flexShrink: 0 }}>{hrs}/50h</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        {(badges || []).length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '16px 20px', marginBottom: 8 }}>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 15, color: '#000', marginBottom: 14 }}>
              Badges
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
              {(badges as BadgeType[]).map((badge) => {
                const meta = BADGE_META[badge.badge_type];
                return (
                  <div key={badge.id} style={{ background: '#f3f2ef', borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 28 }}>{meta?.icon || '🏅'}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#000', marginTop: 4 }}>{meta?.label || badge.badge_type}</div>
                    <div style={{ fontSize: 10.5, color: '#666', marginTop: 2 }}>{meta?.description || ''}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Certificates */}
        {(certificates || []).length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '16px 20px', marginBottom: 8 }}>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 15, color: '#000', marginBottom: 14 }}>
              Certificates
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(certificates as Certificate[]).map((cert) => (
                <div key={cert.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: '#f3f2ef', borderRadius: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${PILLAR_COLORS[cert.pillar_name]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    🏆
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{cert.pillar_name}</div>
                    <div style={{ fontSize: 11, color: '#666' }}>{formatDate(cert.issued_at)}</div>
                  </div>
                  {cert.khda_attested && (
                    <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(39,174,96,0.1)', color: '#27AE60', padding: '2px 6px', borderRadius: 4, marginLeft: 'auto', flexShrink: 0 }}>KHDA</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Interests */}
        {profile.career_interests && profile.career_interests.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '16px 20px', marginBottom: 8 }}>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 15, color: '#000', marginBottom: 10 }}>
              Career Interests
            </h2>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {profile.career_interests.map((interest: string) => (
                <span key={interest} style={{ fontSize: 12.5, padding: '4px 12px', borderRadius: 20, background: '#f3f2ef', color: '#000', fontWeight: 500 }}>
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
