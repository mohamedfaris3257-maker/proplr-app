import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Proplr Impact — University Program' };

const PILLARS = [
  { num: '01', title: 'Leadership' },
  { num: '02', title: 'Entrepreneurship' },
  { num: '03', title: 'Digital Literacy' },
  { num: '04', title: 'Personal Branding' },
  { num: '05', title: 'Communication' },
  { num: '06', title: 'Project Management' },
];

const DIFFERENTIATORS = [
  {
    title: 'Industry-Led Curriculum',
    desc: 'Real briefs from real companies. Not textbooks.',
  },
  {
    title: 'Startup Track',
    desc: 'Pitch. Build. Ship. Access seed-stage funding pathways.',
  },
  {
    title: 'Global Certification',
    desc: '6 KHDA-attested certificates that travel with you.',
  },
];

const SHOWCASE_CHIPS = ['Company-sponsored briefs', 'Cash prizes', 'National leaderboard', 'Cross-campus teams'];

export default function ImpactPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="pub-pattern-dots relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="pub-orb-blue" style={{ width: 600, height: 600, top: -200, right: -100 }} />
        <div className="pub-orb-yellow" style={{ width: 400, height: 400, bottom: -100, left: -80 }} />
        <div className="pub-section relative z-10" style={{ paddingTop: 100, paddingBottom: 80 }}>
          <div className="max-w-3xl">
            <span
              className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6 reveal"
              style={{ background: 'rgba(61,155,233,0.12)', color: '#1a6fad', border: '1px solid rgba(61,155,233,0.25)' }}
            >
              PROPLR IMPACT
            </span>
            <h1
              className="pub-heading reveal"
              style={{ fontSize: 'clamp(36px, 6vw, 68px)', color: '#071629', marginBottom: 20, letterSpacing: '-0.03em' }}
            >
              Your degree opens doors.<br />
              <span className="pub-gradient-text-animated">We make sure you walk through them.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 19, color: '#6e6e73', lineHeight: 1.6, maxWidth: 520, marginBottom: 40 }}>
              The university program that turns ambition into industry-ready capability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 reveal reveal-delay-2">
              <Link href="/register" className="pub-btn-primary">Join the Waitlist</Link>
              <Link href="/partners" className="pub-btn-ghost">Launch a Campus Chapter</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section className="pub-bg-animated">
        <div className="pub-section-compact">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-6">
            {[
              { value: '120+', label: 'Hours of Training' },
              { value: '6', label: 'KHDA Certificates' },
              { value: '150+', label: 'Industry Mentors' },
              { value: '35%', label: 'Faster Job Placement' },
            ].map((s) => (
              <div key={s.label} className="reveal">
                <span className="pub-stat-number" style={{ fontSize: 'clamp(28px, 4vw, 44px)', display: 'block' }}>
                  {s.value}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 PILLARS ────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629', marginBottom: 10 }}>
              6 Pillars. University intensity.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16 }}>Same framework as Foundation. Higher stakes. Real deliverables.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                className={`pub-card pub-glow-border reveal reveal-delay-${(i % 3) + 1}`}
                style={{ padding: '24px 20px', textAlign: 'center' }}
              >
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: 32,
                    color: '#3d9be9',
                    display: 'block',
                    marginBottom: 6,
                    opacity: 0.3,
                  }}
                >
                  {p.num}
                </span>
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: 15,
                    color: '#071629',
                  }}
                >
                  {p.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES IMPACT DIFFERENT ───────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 11,
                color: '#3d9be9',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: 12,
              }}
            >
              NOT ANOTHER WORKSHOP
            </span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629' }}>
              What makes Impact <span className="pub-gradient-text-animated">different.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {DIFFERENTIATORS.map((d, i) => (
              <div
                key={d.title}
                className={`pub-card pub-glow-border reveal reveal-delay-${i + 1} p-8`}
                style={{ textAlign: 'center' }}
              >
                <div
                  className="pub-pulse-glow mx-auto mb-5"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(61,155,233,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 20, color: '#3d9be9' }}>
                    0{i + 1}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17, color: '#071629', marginBottom: 8 }}>
                  {d.title}
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NATIONAL SHOWCASE ────────────────────────────── */}
      <section className="pub-pattern-grid" style={{ background: '#071629' }}>
        <div className="pub-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6 reveal pub-float-slow"
              style={{ background: 'rgba(255,203,93,0.15)', color: '#ffcb5d', border: '1px solid rgba(255,203,93,0.3)' }}
            >
              NATIONAL SHOWCASE
            </span>
            <h2
              className="pub-heading reveal"
              style={{ fontSize: 'clamp(28px, 5vw, 50px)', color: '#ffffff', marginBottom: 16 }}
            >
              From campus to national stage.
            </h2>
            <p className="reveal reveal-delay-1" style={{ color: '#8ca3be', fontSize: 17, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 32px' }}>
              Teams compete on live industry briefs. Judges are hiring managers. Winners get funded.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10 reveal reveal-delay-2">
              {SHOWCASE_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="pub-glass inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ color: '#ffffff' }}
                >
                  <span style={{ color: '#ffcb5d', fontSize: 10 }}>●</span>
                  {chip}
                </span>
              ))}
            </div>
            <div className="reveal reveal-delay-3">
              <Link href="/showcase" className="pub-btn-primary">
                Explore Showcase
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── UNIVERSITY PARTNERSHIPS ──────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section-compact">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal reveal-left">
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  color: '#3d9be9',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: 12,
                }}
              >
                FOR UNIVERSITIES
              </span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                We bring the program.<br />You bring the students.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                Proplr Impact runs as a student chapter on your campus — mentors, curriculum, and industry connections included.
              </p>
              <Link href="/partners" className="pub-btn-navy">Launch a Chapter</Link>
            </div>
            <div className="reveal reveal-right">
              <div className="pub-card p-6" style={{ border: '1px solid rgba(61,155,233,0.12)' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#071629', marginBottom: 16 }}>
                  What your campus gets:
                </p>
                <ul className="space-y-3">
                  {[
                    'KHDA-aligned co-curricular program',
                    'Industry engagement infrastructure',
                    'Accreditation-ready reporting',
                    'Proplr platform & Compass integration',
                    'On-campus kickoff & enrollment support',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#6e6e73' }}>
                      <span style={{ color: '#3d9be9', fontWeight: 700, flexShrink: 0 }}>+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pub-divider" />

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section text-center" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <h2
            className="pub-heading reveal reveal-scale"
            style={{ fontSize: 'clamp(28px, 5vw, 52px)', color: '#071629', marginBottom: 12 }}
          >
            Ready to go <span className="pub-gradient-text-animated">beyond the degree?</span>
          </h2>
          <p className="reveal reveal-delay-1" style={{ color: '#6e6e73', fontSize: 17, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            AED 999 &middot; Full academic year &middot; Everything included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal reveal-delay-2">
            <Link href="/register" className="pub-btn-primary">Register Now</Link>
            <Link href="/foundation" className="pub-btn-ghost">Explore Foundation (K-12)</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
