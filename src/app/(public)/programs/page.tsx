import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Programs – Proplr' };

const PILLARS = [
  { num: '01', title: 'Leadership & Teamwork', desc: 'Sprint planning, team stand-ups, strategic decision-making', color: '#ffcb5d' },
  { num: '02', title: 'Entrepreneurship', desc: 'Problem framing, rapid prototyping, pitch sprint', color: '#3d9be9' },
  { num: '03', title: 'Digital Literacy', desc: 'No-code apps, data visualization, AI prompts', color: '#ffcb5d' },
  { num: '04', title: 'Communication', desc: 'Presentation skills, portfolio writing, podcasting', color: '#3d9be9' },
  { num: '05', title: 'Personal Branding', desc: 'CV & LinkedIn, portfolio site, mock interviews', color: '#ffcb5d' },
  { num: '06', title: 'Project Management', desc: 'OKRs & goals, backlog & Kanban, capstone showcase', color: '#3d9be9' },
];

const ADVANTAGE_CARDS = [
  {
    title: 'Career Exploration',
    desc: 'Real-world role simulations and immersive labs that turn workshops into professional portfolios.',
    icon: '🧭',
    dark: false,
  },
  {
    title: 'Global Mentorship',
    desc: 'Direct access to expert guides from the UAE, UK, and Canada, offering insights that transcend the classroom.',
    icon: '🌍',
    dark: false,
  },
  {
    title: 'AI & Tech Literacy',
    desc: 'Mastering the tools of 2025. From prompt engineering to digital ethics and entrepreneurship.',
    icon: '🤖',
    dark: false,
  },
  {
    title: 'Future-Ready Identity',
    desc: 'Students earn Foundation & Impact certificates mapped to global university standards.',
    icon: '🚀',
    dark: true,
  },
];

const JOURNEY_CARDS = [
  {
    title: 'Students',
    desc: 'Hands-on career test-drives, design sprints & internships to build your professional portfolio.',
    link: '/register',
    linkLabel: 'Explore Paths \u2192',
    icon: '🎓',
    accent: '#3d9be9',
  },
  {
    title: 'Schools',
    desc: 'Plug-and-play career pathways that automate KHDA E33 compliance and reduce teacher workload.',
    link: '/foundation',
    linkLabel: 'For Schools \u2192',
    icon: '🏫',
    accent: '#ffcb5d',
  },
  {
    title: 'Universities',
    desc: 'Showcase programs, engage high-potential prospects, and streamline your recruitment pipeline.',
    link: '/impact',
    linkLabel: 'For Universities \u2192',
    icon: '🏛️',
    accent: '#3d9be9',
  },
  {
    title: 'Partners',
    desc: 'Host corporate challenges, mentor local talent & shape the workforce of tomorrow.',
    link: '/partners',
    linkLabel: 'Join as Partner \u2192',
    icon: '🤝',
    accent: '#ffcb5d',
  },
];

export default function ProgramsPage() {
  return (
    <div>
      {/* ── SECTION 1: HERO ──────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="pub-orb-blue" style={{ width: 520, height: 520, top: -180, right: -120 }} />
        <div className="pub-orb-yellow" style={{ width: 420, height: 420, bottom: -140, left: -100 }} />
        <div className="pub-section relative z-10" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6 reveal"
              style={{
                background: 'rgba(61,155,233,0.1)',
                color: '#1a6fad',
                border: '1px solid rgba(61,155,233,0.2)',
                letterSpacing: '0.05em',
              }}
            >
              Programs &middot; Proplr Pipeline
            </span>
            <h1
              className="pub-heading reveal"
              style={{
                fontSize: 'clamp(34px, 5.5vw, 64px)',
                color: '#071629',
                marginBottom: 20,
                lineHeight: 1.1,
              }}
            >
              A student development pipeline{' '}
              <span className="pub-gradient-text">from school to university.</span>
            </h1>
            <p
              className="reveal reveal-delay-1"
              style={{
                fontSize: 19,
                color: '#6e6e73',
                lineHeight: 1.65,
                maxWidth: 580,
                margin: '0 auto 40px',
              }}
            >
              Not counselling. Not tutoring. Built for real-world outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center reveal reveal-delay-2">
              <Link href="/foundation" className="pub-btn-primary">
                Explore Foundation
              </Link>
              <Link href="/impact" className="pub-btn-ghost">
                Explore Impact
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: DUAL-COHORT SYSTEM ────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  color: '#3d9be9',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.1em',
                }}
              >
                THE PROPLR PROGRAM
              </span>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: 'rgba(39,174,96,0.1)',
                  color: '#1a8a4a',
                  border: '1px solid rgba(39,174,96,0.25)',
                }}
              >
                KHDA Certified
              </span>
            </div>
            <h2
              className="pub-heading"
              style={{
                fontSize: 'clamp(26px, 4vw, 44px)',
                color: '#071629',
                marginBottom: 14,
              }}
            >
              A Continuous Development Ecosystem
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 640, margin: '0 auto', lineHeight: 1.65 }}>
              A student and career development pipeline designed to bridge the gap between academic
              learning and the real-world through two interconnected cohorts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Foundation Card */}
            <div
              className="pub-card reveal reveal-delay-1 p-0 overflow-hidden"
              style={{
                border: '1.5px solid rgba(255,203,93,0.35)',
                transition: 'transform 0.35s ease, box-shadow 0.35s ease',
              }}
              onMouseEnter={undefined}
            >
              <div
                style={{
                  height: 5,
                  background: 'linear-gradient(90deg, #ffcb5d, #f5a623)',
                }}
              />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(255,203,93,0.18)', color: '#a07800' }}
                  >
                    Grades 8-12
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 800,
                    fontSize: 24,
                    color: '#071629',
                    marginBottom: 12,
                  }}
                >
                  Foundation
                  <span style={{ color: '#ffcb5d', marginLeft: 8 }}>K-12</span>
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                  Tailored for K-12 students to build early professional confidence and self-awareness.
                  Delivered as enrichment courses that augment existing academic school work.
                  6 KHDA-approved courses focusing on leadership, invention, and adaptation.
                </p>
                <Link
                  href="/foundation"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#a07800',
                    textDecoration: 'none',
                  }}
                >
                  Explore Foundation &rarr;
                </Link>
              </div>
            </div>

            {/* Impact Card */}
            <div
              className="pub-card reveal reveal-delay-2 p-0 overflow-hidden"
              style={{
                border: '1.5px solid rgba(61,155,233,0.3)',
                transition: 'transform 0.35s ease, box-shadow 0.35s ease',
              }}
            >
              <div
                style={{
                  height: 5,
                  background: 'linear-gradient(90deg, #3d9be9, #1a6fad)',
                }}
              />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(61,155,233,0.12)', color: '#1a6fad' }}
                  >
                    University &amp; Young Adults
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 800,
                    fontSize: 24,
                    color: '#071629',
                    marginBottom: 12,
                  }}
                >
                  Impact
                  <span style={{ color: '#3d9be9', marginLeft: 8 }}>University</span>
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                  Advanced acceleration for university students entering the global workforce.
                  Industry-led exposure through university entrepreneurship centers.
                  Transforming academic knowledge into work-ready skills with global certification.
                </p>
                <Link
                  href="/impact"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#1a6fad',
                    textDecoration: 'none',
                  }}
                >
                  Explore Impact &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: 8-MONTH PILLAR JOURNEY ────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-10 reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  color: '#3d9be9',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.1em',
                }}
              >
                ACCREDITED FRAMEWORK
              </span>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: 'rgba(39,174,96,0.1)',
                  color: '#1a8a4a',
                  border: '1px solid rgba(39,174,96,0.25)',
                }}
              >
                KHDA
              </span>
            </div>
            <h2
              className="pub-heading"
              style={{
                fontSize: 'clamp(26px, 4vw, 44px)',
                color: '#071629',
                marginBottom: 14,
              }}
            >
              The 8-Month Pillar Journey
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 620, margin: '0 auto', lineHeight: 1.65 }}>
              Master 6 accredited certificate courses over an 8-month cycle to build a portfolio of
              verified real-world skills.
            </p>
          </div>

          {/* Stats Bar */}
          <div
            className="reveal reveal-delay-1 grid grid-cols-2 md:grid-cols-4 gap-0 mb-14 mx-auto overflow-hidden"
            style={{
              maxWidth: 800,
              borderRadius: 16,
              border: '1px solid rgba(0,0,0,0.08)',
              background: '#071629',
            }}
          >
            {[
              { value: '8 Months', label: 'Duration' },
              { value: '6 Courses', label: 'KHDA Certificates' },
              { value: '120', label: 'Total Hours' },
              { value: '20 Hours', label: 'Per Pillar' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center py-5 px-4"
                style={{
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 800,
                    fontSize: 20,
                    color: '#ffffff',
                    marginBottom: 2,
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ color: '#8ca3be', fontSize: 12, fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* 6 Pillar Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                className={`pub-card reveal reveal-delay-${(i % 3) + 1} p-7`}
                style={{
                  border: '1px solid rgba(0,0,0,0.06)',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                  cursor: 'default',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: 32,
                    color: p.color,
                    opacity: 0.35,
                    display: 'block',
                    marginBottom: 10,
                  }}
                >
                  {p.num}
                </span>
                <h3
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 800,
                    fontSize: 17,
                    color: '#071629',
                    marginBottom: 8,
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: THE PROPLR ADVANTAGE ──────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-10 reveal">
            <h2
              className="pub-heading"
              style={{
                fontSize: 'clamp(26px, 4vw, 44px)',
                color: '#071629',
                marginBottom: 14,
              }}
            >
              The Proplr Advantage
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 640, margin: '0 auto 20px', lineHeight: 1.65 }}>
              Where student growth meets real-world skills, industry access, and future-ready
              confidence — all fully KHDA aligned.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span
                className="inline-block px-4 py-2 rounded-full text-xs font-bold"
                style={{
                  background: 'rgba(39,174,96,0.1)',
                  color: '#1a8a4a',
                  border: '1px solid rgba(39,174,96,0.25)',
                }}
              >
                KHDA Permitted
              </span>
              <span
                className="inline-block px-4 py-2 rounded-full text-xs font-bold"
                style={{
                  background: 'rgba(61,155,233,0.1)',
                  color: '#1a6fad',
                  border: '1px solid rgba(61,155,233,0.2)',
                }}
              >
                E33 Aligned
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {ADVANTAGE_CARDS.map((card, i) => (
              <div
                key={card.title}
                className={`pub-card reveal reveal-delay-${(i % 2) + 1} p-8`}
                style={{
                  background: card.dark ? '#071629' : '#ffffff',
                  border: card.dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                }}
              >
                <span style={{ fontSize: 32, display: 'block', marginBottom: 14 }}>{card.icon}</span>
                <h3
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 800,
                    fontSize: 19,
                    color: card.dark ? '#ffffff' : '#071629',
                    marginBottom: 10,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    color: card.dark ? '#8ca3be' : '#6e6e73',
                    fontSize: 14,
                    lineHeight: 1.7,
                    marginBottom: card.dark ? 20 : 0,
                  }}
                >
                  {card.desc}
                </p>
                {card.dark && (
                  <Link
                    href="/register"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#ffcb5d',
                      textDecoration: 'none',
                    }}
                  >
                    View All Programs &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: BEGIN YOUR JOURNEY ─────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2
              className="pub-heading"
              style={{
                fontSize: 'clamp(26px, 4vw, 44px)',
                color: '#071629',
                marginBottom: 14,
              }}
            >
              Begin your Journey
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 640, margin: '0 auto', lineHeight: 1.65 }}>
              Whether you&apos;re a student, a school administrator, a university, or an industry
              partner — we&apos;ve built Proplr for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {JOURNEY_CARDS.map((card, i) => (
              <div
                key={card.title}
                className={`pub-card reveal reveal-delay-${(i % 4) + 1} p-7`}
                style={{
                  border: '1px solid rgba(0,0,0,0.06)',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span style={{ fontSize: 32, display: 'block', marginBottom: 14 }}>{card.icon}</span>
                <h3
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 800,
                    fontSize: 18,
                    color: '#071629',
                    marginBottom: 10,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    color: '#6e6e73',
                    fontSize: 14,
                    lineHeight: 1.65,
                    marginBottom: 20,
                    flex: 1,
                  }}
                >
                  {card.desc}
                </p>
                <Link
                  href={card.link}
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: 13,
                    color: card.accent,
                    textDecoration: 'none',
                  }}
                >
                  {card.linkLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CTA BANNER ────────────────────────── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section relative overflow-hidden" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="pub-orb-blue" style={{ width: 300, height: 300, top: -100, right: -60, opacity: 0.15 }} />
          <div className="pub-orb-yellow" style={{ width: 250, height: 250, bottom: -80, left: -40, opacity: 0.12 }} />
          <div className="relative z-10 text-center max-w-2xl mx-auto reveal">
            <h2
              className="pub-heading"
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: '#ffffff',
                marginBottom: 16,
              }}
            >
              Your Launchpad Awaits
            </h2>
            <p
              style={{
                color: '#8ca3be',
                fontSize: 17,
                lineHeight: 1.65,
                marginBottom: 36,
                maxWidth: 500,
                margin: '0 auto 36px',
              }}
            >
              Become part of Proplr&apos;s Career Ecosystem today. Explore, connect, and ignite your
              future.
            </p>
            <Link href="/register" className="pub-btn-primary">
              Get Started &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
