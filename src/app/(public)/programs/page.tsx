import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Programs – Proplr' };

const PILLARS = [
  { num: '01', title: 'Leadership', color: '#ffcb5d' },
  { num: '02', title: 'Entrepreneurship', color: '#3d9be9' },
  { num: '03', title: 'Digital Literacy', color: '#ffcb5d' },
  { num: '04', title: 'Communication', color: '#3d9be9' },
  { num: '05', title: 'Personal Branding', color: '#ffcb5d' },
  { num: '06', title: 'Project Management', color: '#3d9be9' },
];

export default function ProgramsPage() {
  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden pub-pattern-dots" style={{ background: '#ffffff', minHeight: 520 }}>
        <div className="pub-orb-blue pub-pulse-glow" style={{ width: 600, height: 600, top: -200, right: -150 }} />
        <div className="pub-orb-yellow pub-pulse-glow" style={{ width: 500, height: 500, bottom: -200, left: -150 }} />

        <div className="pub-section relative z-10" style={{ paddingTop: 100, paddingBottom: 100 }}>
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="pub-heading reveal"
              style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: '#071629', marginBottom: 20, lineHeight: 1.05 }}
            >
              School to career.{' '}
              <span className="pub-gradient-text-animated">One pipeline.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 19, color: '#6e6e73', lineHeight: 1.6, maxWidth: 480, margin: '0 auto 40px' }}>
              KHDA-certified programs that build real skills, industry access, and a portfolio — not just another certificate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center reveal reveal-delay-2">
              <Link href="/foundation" className="pub-btn-primary">Foundation K-12 →</Link>
              <Link href="/impact" className="pub-btn-ghost">Impact University →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE — PILLAR STRIP ────────────────────────── */}
      <section style={{ background: '#071629', overflow: 'hidden' }}>
        <div style={{ padding: '20px 0' }}>
          <div className="pub-marquee-track">
            {[...PILLARS, ...PILLARS, ...PILLARS].map((p, i) => (
              <span
                key={`${p.num}-${i}`}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 800,
                  fontSize: 14,
                  color: p.color,
                  opacity: 0.7,
                  whiteSpace: 'nowrap',
                  padding: '0 32px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase' as const,
                }}
              >
                {p.num} {p.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO COHORTS — BENTO LAYOUT ────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#071629', marginBottom: 12 }}>
              Two cohorts. One ecosystem.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 460, margin: '0 auto' }}>
              A continuous development pipeline from high school through university.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Foundation */}
            <div className="pub-card pub-glow-border reveal reveal-delay-1 p-0 overflow-hidden" style={{ border: '1px solid rgba(255,203,93,0.2)' }}>
              <div style={{ height: 4, background: 'linear-gradient(90deg, #ffcb5d, #f5a623)' }} />
              <div className="p-8">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: 'rgba(255,203,93,0.15)', color: '#a07800' }}>
                  Grades 8–12
                </span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 28, color: '#071629', marginBottom: 12 }}>
                  Foundation <span style={{ color: '#ffcb5d' }}>K-12</span>
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                  After-school career club. 6 KHDA certificates. Real industry exposure.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['120 hours', '8 months', 'AED 400/mo'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#f5f5f7', color: '#6e6e73' }}>{tag}</span>
                  ))}
                </div>
                <Link href="/foundation" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#a07800', textDecoration: 'none' }}>
                  Explore Foundation →
                </Link>
              </div>
            </div>

            {/* Impact */}
            <div className="pub-card pub-glow-border reveal reveal-delay-2 p-0 overflow-hidden" style={{ border: '1px solid rgba(61,155,233,0.2)' }}>
              <div style={{ height: 4, background: 'linear-gradient(90deg, #3d9be9, #1a6fad)' }} />
              <div className="p-8">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: 'rgba(61,155,233,0.12)', color: '#1a6fad' }}>
                  University & Young Adults
                </span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 28, color: '#071629', marginBottom: 12 }}>
                  Impact <span style={{ color: '#3d9be9' }}>University</span>
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                  Advanced acceleration for the global workforce. Industry-led, university-delivered.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Work-ready skills', 'Global certification', 'Startup track'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#f5f5f7', color: '#6e6e73' }}>{tag}</span>
                  ))}
                </div>
                <Link href="/impact" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#1a6fad', textDecoration: 'none' }}>
                  Explore Impact →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 PILLARS — COMPACT GRID ──────────────────────── */}
      <section className="relative overflow-hidden pub-pattern-grid" style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 12 }}>
              Six pillars. One portfolio.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                className={`reveal reveal-delay-${(i % 3) + 1} p-6 rounded-2xl pub-glow-border`}
                style={{ background: '#f5f5f7', border: '1px solid rgba(0,0,0,0.04)', textAlign: 'center' }}
              >
                <span className="pub-stat-number" style={{ fontSize: 36, color: p.color, opacity: 0.3, display: 'block', marginBottom: 4 }}>
                  {p.num}
                </span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 15, color: '#071629' }}>
                  {p.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ──────────────────────────────────── */}
      <section className="pub-bg-animated">
        <div className="pub-section-compact">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center reveal">
            {[
              { value: '8', label: 'Months', suffix: '' },
              { value: '6', label: 'KHDA Certificates', suffix: '' },
              { value: '120', label: 'Total Hours', suffix: 'h' },
              { value: '150', label: 'Mentors', suffix: '+' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="pub-stat-number" style={{ fontSize: 42, color: '#ffffff', marginBottom: 4 }}>
                  {stat.value}<span style={{ color: '#ffcb5d' }}>{stat.suffix}</span>
                </p>
                <p style={{ color: '#8ca3be', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR EVERYONE — JOURNEY CARDS ───────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 12 }}>
              Built for everyone in the ecosystem.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              { title: 'Students', icon: '🎓', link: '/register', accent: '#3d9be9', desc: 'Build your portfolio and career skills.' },
              { title: 'Schools', icon: '🏫', link: '/start-a-club', accent: '#ffcb5d', desc: 'Plug-and-play KHDA career program.' },
              { title: 'Universities', icon: '🏛️', link: '/impact', accent: '#3d9be9', desc: 'Engage high-potential talent early.' },
              { title: 'Partners', icon: '🤝', link: '/partners', accent: '#ffcb5d', desc: 'Shape the next generation of talent.' },
            ].map((card, i) => (
              <Link
                key={card.title}
                href={card.link}
                className={`pub-card pub-glow-border reveal reveal-delay-${(i % 4) + 1} p-6 block`}
                style={{ border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none' }}
              >
                <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>{card.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#071629', marginBottom: 6 }}>
                  {card.title}
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.55 }}>{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="pub-bg-animated relative overflow-hidden">
        <div className="pub-orb-blue pub-pulse-glow" style={{ width: 300, height: 300, top: -100, right: -60, opacity: 0.15 }} />
        <div className="pub-orb-yellow pub-pulse-glow" style={{ width: 250, height: 250, bottom: -80, left: -40, opacity: 0.12 }} />
        <div className="pub-section relative z-10 text-center reveal" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#ffffff', marginBottom: 16 }}>
            Ready to launch?
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 17, marginBottom: 36, maxWidth: 420, margin: '0 auto 36px' }}>
            Join the Proplr pipeline. September 2026 cohort now enrolling.
          </p>
          <Link href="/register" className="pub-btn-primary">Get Started →</Link>
        </div>
      </section>
    </div>
  );
}
