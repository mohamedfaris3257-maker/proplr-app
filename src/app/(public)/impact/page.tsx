import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Proplr Impact - University Program' };

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
      <section className="pub-hero-image pub-overlay-left" style={{ minHeight: 520 }}>
        <Image
          src="https://images.pexels.com/photos/6684506/pexels-photo-6684506.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="University students on campus"
          fill
          className="pub-ken-burns"
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="pub-section relative z-10" style={{ paddingTop: 120, paddingBottom: 100 }}>
          <div className="max-w-2xl">
            <div className="pub-line-grow reveal mb-8" />
            <span
              className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6"
              style={{ background: 'rgba(61,155,233,0.2)', color: '#93cbf7', border: '1px solid rgba(61,155,233,0.3)' }}
            >
              PROPLR IMPACT
            </span>
            <h1
              className="pub-heading pub-text-shadow reveal"
              style={{ fontSize: 'clamp(36px, 6vw, 68px)', color: '#ffffff', marginBottom: 20, letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
              Your degree opens doors.<br />
              <span style={{ color: '#ffcb5d' }}>We make sure you walk through them.</span>
            </h1>
            <p className="pub-text-shadow reveal reveal-delay-1" style={{ fontSize: 19, color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, maxWidth: 480, marginBottom: 40 }}>
              The university program that turns ambition into industry-ready capability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 reveal reveal-delay-2">
              <a href="/enroll?plan=impact" target="_blank" rel="noopener noreferrer" className="pub-btn-primary">Join the Waitlist</a>
              <Link href="/campus-chapter" className="pub-btn-ghost" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>Launch a Campus Chapter</Link>
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
                <span className="pub-stat-number" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#ffffff', display: 'block' }}>
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
              6 Pillars. <span className="pub-gradient-text-animated">One program.</span>
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16 }}>Same framework. Higher stakes. Real deliverables.</p>
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

      {/* ── WHAT MAKES IMPACT DIFFERENT - SPLIT LAYOUT ──── */}
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
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="reveal-left">
              <div className="pub-img-card">
                <Image
                  src="https://images.pexels.com/photos/18999483/pexels-photo-18999483.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Team collaborating on a project"
                  width={800}
                  height={530}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto', borderRadius: 16 }}
                />
              </div>
            </div>
            {/* Right - 3 Differentiator Cards */}
            <div className="reveal-right space-y-5">
              {DIFFERENTIATORS.map((d, i) => (
                <div
                  key={d.title}
                  className={`pub-card pub-glow-border p-6 reveal reveal-delay-${i + 1}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="pub-pulse-glow flex-shrink-0"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(61,155,233,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 16, color: '#3d9be9' }}>
                        0{i + 1}
                      </span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17, color: '#071629', marginBottom: 6 }}>
                        {d.title}
                      </h3>
                      <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{d.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NATIONAL SHOWCASE ────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark" style={{ minHeight: 420 }}>
        <Image
          src="https://images.pexels.com/photos/15141529/pexels-photo-15141529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Person presenting on stage"
          fill
          className="pub-ken-burns"
          style={{ objectFit: 'cover' }}
        />
        <div className="pub-section relative z-10" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6 reveal pub-float-slow"
              style={{ background: '#ffcb5d', color: '#071629', letterSpacing: 1 }}
            >
              NATIONAL SHOWCASE
            </span>
            <h2
              className="pub-heading pub-text-shadow reveal"
              style={{ fontSize: 'clamp(28px, 5vw, 50px)', color: '#ffffff', marginBottom: 16 }}
            >
              From campus to national stage.
            </h2>
            <p className="pub-text-shadow reveal reveal-delay-1" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, lineHeight: 1.6, maxWidth: 560, margin: '0 auto 32px' }}>
              Teams compete on live industry briefs. Judges are hiring managers. Winners get funded.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10 reveal reveal-delay-2" style={{ whiteSpace: 'nowrap' }}>
              {SHOWCASE_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="pub-glass inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ color: '#ffffff' }}
                >
                  <span style={{ color: '#ffcb5d', fontSize: 10 }}>&#9679;</span>
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
            {/* Left - Image */}
            <div className="reveal reveal-left">
              <div className="pub-img-card">
                <Image
                  src="https://images.pexels.com/photos/6684506/pexels-photo-6684506.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="University campus"
                  width={800}
                  height={530}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto', borderRadius: 16 }}
                />
              </div>
            </div>
            {/* Right - What your campus gets */}
            <div className="reveal reveal-right">
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
              <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                Proplr Impact runs as a student chapter on your campus  - mentors, curriculum, and industry connections included.
              </p>
              <div className="pub-card p-6 mb-6" style={{ border: '1px solid rgba(61,155,233,0.12)' }}>
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
              <Link href="/campus-chapter" className="pub-btn-navy">Launch a Chapter</Link>
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
            Full academic year. Everything included. KHDA certified.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal reveal-delay-2">
            <a href="/enroll?plan=impact" target="_blank" rel="noopener noreferrer" className="pub-btn-primary">Register Now</a>
            <Link href="/foundation" className="pub-btn-ghost">Explore Foundation (K-12)</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
