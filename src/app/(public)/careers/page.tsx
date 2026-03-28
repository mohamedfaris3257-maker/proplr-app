import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Careers - Proplr', description: 'Join the team building the future of student career development in the UAE.' };

interface JobPosting {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  description: string | null;
  created_at: string;
}

export default async function CareersPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from('job_postings')
    .select('id, title, department, location, type, description, created_at')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  const openRoles = (jobs ?? []) as JobPosting[];

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="pub-orb-yellow" style={{ width: 400, height: 400, top: -150, right: -80 }} />
        <div className="pub-section relative z-10">
          <div className="max-w-3xl">
            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: '#071629', marginBottom: 20 }}>
              Join the team building<br />
              <span className="pub-gradient-text">UAE&apos;s student future.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 17, color: '#6e6e73', lineHeight: 1.65, maxWidth: 520 }}>
              We&apos;re a small, ambitious team with a mission that matters. We work hard, move fast, and care deeply about every student we serve.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: '●', title: 'Mission-Driven', desc: 'Every decision traces back to student outcomes.' },
              { icon: '◆', title: 'UAE-Built', desc: 'Fully rooted in the UAE, building for the nation\'s vision.' },
              { icon: '★', title: 'High Ownership', desc: 'Small team means your work has outsized impact from day one.' },
            ].map((v, i) => (
              <div key={v.title} className={`pub-card reveal reveal-delay-${i + 1} p-6 text-center`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>{v.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 6 }}>{v.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN ROLES ───────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10 reveal">
              <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629', marginBottom: 8 }}>
                Open Roles
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15 }}>
                {openRoles.length > 0
                  ? `${openRoles.length} open position${openRoles.length !== 1 ? 's' : ''}`
                  : 'No open roles right now - but we\'re always growing.'}
              </p>
            </div>

            {openRoles.length > 0 ? (
              <div className="space-y-4">
                {openRoles.map((job, i) => (
                  <div key={job.id} className={`pub-card reveal reveal-delay-${(i % 3) + 1} p-6`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#071629', marginBottom: 4 }}>
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {job.department && (
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#3d9be9', background: 'rgba(61,155,233,0.1)', padding: '2px 10px', borderRadius: 100 }}>
                              {job.department}
                            </span>
                          )}
                          {job.location && (
                            <span style={{ fontSize: 12, color: '#6e6e73', background: 'rgba(0,0,0,0.05)', padding: '2px 10px', borderRadius: 100 }}>
                              {job.location}
                            </span>
                          )}
                          {job.type && (
                            <span style={{ fontSize: 12, color: '#6e6e73', background: 'rgba(0,0,0,0.05)', padding: '2px 10px', borderRadius: 100 }}>
                              {job.type}
                            </span>
                          )}
                        </div>
                      </div>
                      <a
                        href={`mailto:hello@proplr.ae?subject=Application: ${encodeURIComponent(job.title)}`}
                        className="pub-btn-navy pub-btn-sm"
                        style={{ flexShrink: 0 }}
                      >
                        Apply →
                      </a>
                    </div>
                    {job.description && (
                      <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{job.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="pub-card reveal p-10 text-center" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 40, display: 'block', marginBottom: 14 }}>↗</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#071629', marginBottom: 8 }}>
                  We&apos;re expanding across the UAE.
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 20px' }}>
                  No openings are listed yet, but we&apos;re always interested in passionate educators, technologists, and career development professionals.
                </p>
                <a href="mailto:hello@proplr.ae?subject=General Interest - Proplr Careers" className="pub-btn-navy">
                  Send Us Your CV →
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ background: '#071629', padding: '64px 24px' }}>
        <div className="max-w-[1200px] mx-auto text-center reveal">
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(22px, 3vw, 34px)', marginBottom: 12 }}>
            Interested in what we&apos;re building?
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 16, marginBottom: 28 }}>
            Learn more about Proplr or get in touch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/about" className="pub-btn-primary">About Proplr →</Link>
            <a href="mailto:hello@proplr.ae" style={{ color: '#8ca3be', fontSize: 15 }} className="hover:text-white transition-colors">
              hello@proplr.ae
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
