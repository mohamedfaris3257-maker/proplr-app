import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Proplr Impact — University Program' };

const PILLARS = [
  { icon: '👑', title: 'Leadership', desc: '20 hours — chapter leadership, facilitation, strategic management' },
  { icon: '💡', title: 'Entrepreneurship', desc: '20 hours — startup pitches, mini accelerator, investor panels' },
  { icon: '💻', title: 'Digital Literacy', desc: '20 hours — AI tools, data analysis, digital product thinking' },
  { icon: '📢', title: 'Personal Branding', desc: '20 hours — LinkedIn, professional presence, thought leadership' },
  { icon: '🎙️', title: 'Communication', desc: '20 hours — presentation skills, negotiation, executive communication' },
  { icon: '📊', title: 'Project Management', desc: '20 hours — agile, team delivery, cross-functional collaboration' },
];

const TRACKS = [
  {
    icon: '📅', title: 'Weekly Sessions',
    points: ['Pillar curriculum sessions', 'Guest expert workshops', 'Peer collaboration sprints', 'Progress check-ins'],
  },
  {
    icon: '🏭', title: 'Industry Track',
    points: ['Company challenge briefs', 'Microplacements & site visits', 'Demo day presentations', 'Deliverable-based learning'],
  },
  {
    icon: '🎯', title: 'Mentorship & Leadership',
    points: ['Chapter leadership council', 'Senior career panels', '1-on-1 mentor office hours', 'Mini Accelerator & Incubator'],
  },
  {
    icon: '🔬', title: 'Skills & Assessment',
    points: ['Compass reassessment', 'Job readiness report', 'Interview prep support', 'Startup funding access'],
  },
];

export default function ImpactPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="pub-orb-blue" style={{ width: 600, height: 600, top: -200, right: -100 }} />
        <div className="pub-orb-yellow" style={{ width: 400, height: 400, bottom: -100, left: -80 }} />
        <div className="pub-section relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(61,155,233,0.12)', color: '#1a6fad', border: '1px solid rgba(61,155,233,0.25)' }}>
              PROPLR IMPACT · UNIVERSITY PROGRAM
            </span>
            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: '#071629', marginBottom: 20 }}>
              Where university students<br />
              <span className="pub-gradient-text">get industry-ready.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 18, color: '#6e6e73', lineHeight: 1.65, maxWidth: 560, marginBottom: 36 }}>
              A co-curricular chapter that lives inside your campus — startup challenges, industry mentors, real deliverables, KHDA certificates, and a professional network that actually opens doors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 reveal reveal-delay-2">
              <Link href="/register" className="pub-btn-primary">Join the Waitlist</Link>
              <Link href="/partners" className="pub-btn-ghost">Launch a Chapter at My University</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES IT DIFFERENT ──────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>FOR UNIVERSITY STUDENTS</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#071629', marginBottom: 12 }}>
              Same six pillars. Higher stakes. Real outcomes.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
              Proplr Impact is built for university students who know that a degree alone isn&apos;t enough. The program runs through your campus and connects you to industry challenges, microplacements, and a community of ambitious peers. You&apos;re not just learning about careers. You&apos;re building one.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🚀', title: 'Demo Days', desc: 'Present your project to a panel of industry judges and investors — not just your professor.' },
              { icon: '🔗', title: 'Microplacements', desc: 'Short-term embedded experiences with real companies. Show up, deliver, learn.' },
              { icon: '🏆', title: 'National Competition Entry', desc: 'Represent your campus at the Proplr National Showcase and compete for industry recognition.' },
              { icon: '📈', title: 'Startup Funding Access', desc: 'Top Impact students get access to Proplr startup network and potential seed funding opportunities.' },
              { icon: '🏅', title: 'Yearly Student Awards', desc: 'Recognition for leadership, innovation, and impact — goes on your CV and LinkedIn.' },
              { icon: '💼', title: 'Job & Internship Readiness', desc: 'Structured interview prep, CV review, and recruiter introductions built into the curriculum.' },
            ].map((item, i) => (
              <div key={item.title} className={`pub-card reveal reveal-delay-${(i % 3) + 1} p-7`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 14 }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 PILLARS ────────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#071629', marginBottom: 12 }}>
              6 Pillars. Higher intensity.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16 }}>Same framework as Foundation, post-secondary intensity. 20 hours per pillar, 6 KHDA certificates total.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <div key={p.title} className={`pub-card reveal reveal-delay-${(i % 3) + 1} p-7`} style={{ border: '1px solid rgba(61,155,233,0.12)' }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 14 }}>{p.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17, color: '#071629', marginBottom: 8 }}>{p.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 TRACKS ─────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629' }}>
              4 Connected Program Tracks
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {TRACKS.map((t, i) => (
              <div key={t.title} className={`pub-card reveal reveal-delay-${(i % 2) + 1} p-8`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <span style={{ fontSize: 28 }}>{t.icon}</span>
                  <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 17, color: '#071629' }}>{t.title}</h4>
                </div>
                <ul className="space-y-2">
                  {t.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm" style={{ color: '#6e6e73' }}>
                      <span style={{ color: '#3d9be9', fontWeight: 700 }}>→</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRADUATION OUTCOMES ──────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 12 }}>
              What you graduate with
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              '6 KHDA-attested certificates',
              'Verified professional portfolio',
              'Job/internship readiness report',
              'National Showcase participation',
              'Startup funding pathway access',
              'Yearly Student Awards eligibility',
              'Option: Impact Year 2 pathway',
              'Industry mentor introductions',
              'Alumni network lifetime access',
            ].map((item, i) => (
              <div key={item} className={`reveal reveal-delay-${(i % 3) + 1} flex items-start gap-3 p-4 rounded-xl`} style={{ background: '#f5f5f7' }}>
                <span style={{ color: '#3d9be9', fontSize: 18, flexShrink: 0, fontWeight: 700 }}>✓</span>
                <span style={{ color: '#1d1d1f', fontSize: 15, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UAE AI 2031 ──────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-3xl mx-auto text-center reveal">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(61,155,233,0.1)', color: '#1a6fad', border: '1px solid rgba(61,155,233,0.2)' }}>
              UAE AI 2031 Aligned
            </span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629', marginBottom: 14 }}>
              Building the next generation for a knowledge economy.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65 }}>
              Proplr Impact aligns with UAE&apos;s ambition to develop world-class talent. Our curriculum prepares students for the AI-driven economy with practical skills, not just theory. Universities hosting a Proplr Impact chapter demonstrate measurable co-curricular outcomes to accreditation bodies.
            </p>
          </div>
        </div>
      </section>

      {/* ── CHAPTER MODEL ────────────────────────────────── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section reveal" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 14 }}>
                Bring Proplr Impact to your campus.
              </h2>
              <p style={{ color: '#8ca3be', fontSize: 16, lineHeight: 1.65, marginBottom: 28 }}>
                Proplr Impact operates as a student chapter inside universities, entrepreneurship centers, and accelerators. We provide the program, mentors, and industry connections. You provide the students and the platform.
              </p>
              <Link href="/partners" className="pub-btn-primary">
                Launch a Chapter →
              </Link>
            </div>
            <div>
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-semibold text-white text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>What universities get:</p>
                <ul className="space-y-3">
                  {[
                    'KHDA-aligned co-curricular offering',
                    'Industry engagement infrastructure for students',
                    'Inspection and accreditation evidence',
                    'Feature on Proplr platform and Compass reports',
                    'On-campus info session to kickstart enrollment',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#8ca3be' }}>
                      <span style={{ color: '#3d9be9' }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING + CTA ────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section text-center reveal" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629', marginBottom: 8 }}>
            AED 999
          </h2>
          <p style={{ color: '#6e6e73', fontSize: 18, marginBottom: 4 }}>Flat rate · Full academic year · Everything included</p>
          <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 28 }}>6 KHDA Certificates · Demo Days · Industry Mentors · Showcase Eligibility</p>
          <Link href="/register" className="pub-btn-primary">Join Now →</Link>
        </div>
      </section>
    </div>
  );
}
