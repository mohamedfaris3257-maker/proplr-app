import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Proplr Foundation — K-12 Program' };

export default function FoundationPage() {
  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="pub-pattern-dots relative overflow-hidden">
        <div className="pub-orb-blue" style={{ width: 500, height: 500, top: -120, right: -100 }} />
        <div className="pub-orb-yellow" style={{ width: 400, height: 400, bottom: -80, left: -60 }} />

        <div className="pub-section relative z-10" style={{ paddingTop: 100, paddingBottom: 80 }}>
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6" style={{ background: 'rgba(255,203,93,0.15)', color: '#a07800', border: '1px solid rgba(255,203,93,0.3)' }}>
              PROPLR FOUNDATION &middot; GRADES 8 &ndash; 12
            </span>

            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: '#071629', marginBottom: 20, lineHeight: 1.05 }}>
              Career-ready before<br />
              <span className="pub-gradient-text-animated">graduation.</span>
            </h1>

            <p className="reveal reveal-delay-1" style={{ fontSize: 20, color: '#6e6e73', maxWidth: 520, marginBottom: 40 }}>
              KHDA-certified skills, real industry exposure, and a portfolio &mdash; all inside one after-school club.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 reveal reveal-delay-2">
              <Link href="/register" className="pub-btn-primary">Register Now</Link>
              <Link href="/start-a-club" className="pub-btn-ghost">Start a Club</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <section className="pub-bg-animated">
        <div className="pub-section-compact">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-6">
            {[
              { num: '8', label: 'Months' },
              { num: '6', label: 'KHDA Certificates' },
              { num: '120', label: 'Program Hours' },
              { num: '400', label: 'AED / Month' },
            ].map((s) => (
              <div key={s.label} className="reveal">
                <span className="pub-stat-number" style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: '#ffffff', fontFamily: 'Montserrat, sans-serif', fontWeight: 900, display: 'block' }}>
                  {s.num}
                </span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 PILLARS ──────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 10 }}>
              6 pillars. <span className="pub-gradient-text-animated">One program.</span>
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16 }}>20 hours per pillar &middot; KHDA-certified</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { num: '01', title: 'Leadership' },
              { num: '02', title: 'Entrepreneurship' },
              { num: '03', title: 'Digital Literacy' },
              { num: '04', title: 'Communication' },
              { num: '05', title: 'Personal Branding' },
              { num: '06', title: 'Project Management' },
            ].map((p, i) => (
              <div
                key={p.title}
                className={`pub-card pub-glow-border reveal reveal-delay-${(i % 3) + 1}`}
                style={{ padding: '28px 24px', textAlign: 'center' }}
              >
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 32, color: '#3d9be9', display: 'block', marginBottom: 6 }}>
                  {p.num}
                </span>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#071629' }}>
                  {p.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 TERMS TIMELINE ───────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629' }}>
              One year. Three acts.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { badge: 'Term 1', title: 'Explore', line: 'Discover all 6 pillars and find your strengths.' },
              { badge: 'Term 2', title: 'Apply', line: 'Tackle real industry challenges with mentors.' },
              { badge: 'Term 3', title: 'Present', line: 'Ship your portfolio and hit the national stage.' },
            ].map((t, i) => (
              <div key={t.title} className={`reveal reveal-delay-${i + 1} text-center p-8 rounded-2xl`} style={{ background: 'rgba(255,203,93,0.06)', border: '1.5px solid rgba(255,203,93,0.25)' }}>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#ffcb5d', color: '#071629' }}>
                  {t.badge}
                </span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#071629', marginBottom: 8 }}>
                  {t.title}
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 14 }}>{t.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pub-divider" />

      {/* ── INDUSTRY EXPOSURE ──────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>
              INDUSTRY EXPOSURE
            </span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629' }}>
              Start your career early.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Job Shadowing', desc: 'Observe professionals in real workflows.', badge: 'Years 9 &ndash; 12' },
              { title: 'Internships', desc: 'Hands-on projects during school breaks.', badge: 'Senior Years' },
              { title: 'Mentorship', desc: '150+ experts across 20+ countries.', badge: '150+ Mentors' },
            ].map((card, i) => (
              <div key={card.title} className={`pub-card pub-glow-border reveal reveal-delay-${i + 1} p-8`}>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5"
                  style={{ background: 'rgba(255,203,93,0.15)', color: '#a07800', border: '1px solid rgba(255,203,93,0.3)' }}
                  dangerouslySetInnerHTML={{ __html: card.badge }}
                />
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#071629', marginBottom: 8 }}>
                  {card.title}
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KHDA ALIGNMENT ─────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section-compact">
          <div className="max-w-3xl mx-auto text-center reveal py-10">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['KHDA Permit #633441', 'Dubai E33 Aligned', 'UAE AI 2031', 'Rahhal Framework'].map((badge) => (
                <span key={badge} className="pub-glass px-5 py-2 rounded-full text-sm font-bold" style={{ color: '#071629' }}>
                  {badge}
                </span>
              ))}
            </div>
            <p style={{ color: '#6e6e73', fontSize: 15 }}>
              Built for Dubai&apos;s education priorities. Inspection-ready from day one.
            </p>
          </div>
        </div>
      </section>

      {/* ── NATIONAL SHOWCASE ──────────────────────────────── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section">
          <div className="max-w-2xl mx-auto text-center reveal">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6 pub-pulse-glow" style={{ background: 'rgba(61,155,233,0.15)', color: '#3d9be9', border: '1px solid rgba(61,155,233,0.25)' }}>
              NATIONAL SHOWCASE
            </span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#ffffff', marginBottom: 14 }}>
              From classroom to <span style={{ color: '#ffcb5d' }}>national stage.</span>
            </h2>
            <p className="reveal reveal-delay-1" style={{ color: '#8ca3be', fontSize: 16, marginBottom: 32 }}>
              Cross-school teams. Company-sponsored briefs. Cash prizes. Live pitch finals.
            </p>
            <Link href="/showcase" className="pub-btn-primary reveal reveal-delay-2">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING CTA ────────────────────────────────────── */}
      <section className="pub-pattern-grid" style={{ background: '#ffffff' }}>
        <div className="pub-section text-center reveal" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <h2 className="pub-heading" style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: '#071629', marginBottom: 8 }}>
            <span className="pub-gradient-text-animated">AED 400</span>/month
          </h2>
          <p style={{ color: '#6e6e73', fontSize: 18, marginBottom: 6 }}>
            8 months &middot; AED 3,200/year
          </p>
          <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 36 }}>
            Everything included. No hidden fees. KHDA certified.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['6 KHDA Certificates', 'Industry Mentorship', 'Portfolio Building', 'Compass Assessment', 'Showcase Eligibility'].map((f) => (
              <span key={f} className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: '#f5f5f7', color: '#1d1d1f', border: '1px solid rgba(0,0,0,0.08)' }}>
                {f}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="pub-btn-primary">Register for Foundation</Link>
            <Link href="/start-a-club" className="pub-btn-navy">Start a Club at My School</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
