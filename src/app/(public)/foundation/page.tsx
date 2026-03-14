import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Proplr Foundation — K-12 Program' };

const PILLARS = [
  { icon: '🧭', title: 'Leadership', desc: 'Learn to lead yourself before you lead others. Decision-making, accountability, team dynamics, and building the confidence to take initiative.' },
  { icon: '💡', title: 'Entrepreneurship', desc: 'From idea to execution. Students pitch business ideas, run innovation challenges, and learn the entrepreneurial mindset the UAE economy is built on.' },
  { icon: '💻', title: 'Digital Literacy', desc: 'More than just using technology — understanding it, evaluating it, and applying it responsibly. Includes AI literacy and digital professionalism.' },
  { icon: '📣', title: 'Personal Branding', desc: 'How you show up in the world matters. Students build their personal narrative, practice presenting themselves, and create a digital presence they\'re proud of.' },
  { icon: '🗣️', title: 'Communication', desc: 'Public speaking, professional writing, active listening, and storytelling. Skills that transfer to every career path, every interview, every room you walk into.' },
  { icon: '📋', title: 'Project Management', desc: 'Plan it. Execute it. Deliver it. Students learn real project frameworks, collaboration tools, and how to take an idea from brief to outcome.' },
];

const TRACKS = [
  {
    icon: '📅', title: 'Weekly Sessions',
    points: ['Facilitated pillar workshops', 'Structured curriculum delivery', 'In-club peer collaboration', 'Progress tracking & check-ins'],
  },
  {
    icon: '🏭', title: 'Industry Track',
    points: ['Real company challenge briefs', 'Site visits with deliverables', 'Industry speaker sessions', 'Case study competitions'],
  },
  {
    icon: '🎯', title: 'Mentorship & Leadership',
    points: ['Senior career panel access', '1-on-1 mentor office hours', 'Student Leadership Council', 'Parent engagement events'],
  },
  {
    icon: '🔬', title: 'Skills & Assessment',
    points: ['Compass career assessment', 'Portfolio building sessions', 'Hackathons & case competitions', 'KHDA certification pathway'],
  },
];

const FEATURED_ACTIVITIES = [
  { icon: '🎤', label: 'Career Discovery Panels' },
  { icon: '🏢', label: 'Internships & Job Shadow Days' },
  { icon: '🏛️', label: 'Student Leadership Council' },
  { icon: '⚡', label: 'Industry Innovation Challenges' },
  { icon: '👪', label: 'Parent Engagement Events' },
  { icon: '💻', label: 'Hackathons & Case Competitions' },
];

export default function FoundationPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="pub-orb-yellow" style={{ width: 500, height: 500, top: -150, right: -100 }} />
        <div className="pub-orb-blue" style={{ width: 400, height: 400, bottom: -100, left: -80 }} />
        <div className="pub-section relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(255,203,93,0.15)', color: '#a07800', border: '1px solid rgba(255,203,93,0.3)' }}>
              PROPLR FOUNDATION · K-12 PROGRAM
            </span>
            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: '#071629', marginBottom: 20 }}>
              The program your school<br />
              <span className="pub-gradient-text">should have had.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 18, color: '#6e6e73', lineHeight: 1.65, maxWidth: 560, marginBottom: 36 }}>
              A co-curricular club built for Grades 8–12 that gives students KHDA-certified career skills, real industry exposure, and a portfolio before graduation — without disrupting a single class.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 reveal reveal-delay-2">
              <Link href="/register" className="pub-btn-primary">Register Now</Link>
              <Link href="/start-a-club" className="pub-btn-ghost">Start a Club at My School</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 PILLARS ────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>THE 6 PILLARS</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#071629', marginBottom: 12 }}>
              Six skills. One program. A lifetime of impact.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16 }}>20 hours per pillar · 6 KHDA-certified certificates · Completed across 3 trimesters</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <div key={p.title} className={`pub-card reveal reveal-delay-${(i % 3) + 1} p-7`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 14 }}>{p.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17, color: '#071629', marginBottom: 8 }}>{p.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>HOW IT WORKS</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#071629', marginBottom: 12 }}>
              A full-year experience,<br />not a weekend workshop.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>The Foundation year is divided into three trimesters. Every trimester, students encounter all six pillars through different experiences — so the learning compounds, not repeats.</p>
          </div>

          {/* Trimester layout */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              { label: 'Term 1', title: 'Explore', desc: 'Students are introduced to all 6 pillars through structured sessions, team challenges, and initial career discovery. Compass assessment happens here.' },
              { label: 'Term 2', title: 'Apply', desc: 'Industry exposure deepens. Students begin portfolio projects, attend career panels, connect with mentors, and take on real-world challenges.' },
              { label: 'Term 3', title: 'Present', desc: 'Showcase preparation begins. Students refine their portfolios, present to peers and mentors, and compete in the National Showcase. Certificates issued.' },
            ].map((term, i) => (
              <div key={term.label} className={`reveal reveal-delay-${i + 1} p-7 rounded-2xl text-center`} style={{ background: 'rgba(255,203,93,0.06)', border: '1.5px solid rgba(255,203,93,0.25)' }}>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#ffcb5d', color: '#071629' }}>{term.label}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 8 }}>{term.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{term.desc}</p>
              </div>
            ))}
          </div>

          {/* 4 Program Tracks */}
          <h3 className="pub-heading text-center mb-10 reveal" style={{ fontSize: 26, color: '#071629' }}>
            4 Connected Program Tracks
          </h3>
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
                      <span style={{ color: '#ffcb5d', fontWeight: 700 }}>→</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ACTIVITIES ──────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-10 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629' }}>
              What students actually do
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_ACTIVITIES.map((a, i) => (
              <div key={a.label} className={`reveal reveal-delay-${(i % 3) + 1} text-center p-5 rounded-2xl`} style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{a.icon}</span>
                <p style={{ fontSize: 13, color: '#1d1d1f', fontWeight: 600, lineHeight: 1.4 }}>{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY MODEL TABLE ─────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-10 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629' }}>
              Program Delivery
            </h2>
          </div>
          <div className="overflow-x-auto reveal">
            <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#071629' }}>
                  {['Component', 'Details'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-white font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Structure', '3 trimesters × 6 pillars × 20 hours each = 120 hours/year'],
                  ['Delivery Mode', 'After-school club or co-curricular module, on campus'],
                  ['Learning Methodology', 'Project-based, mentor-supported, interactive simulations'],
                  ['Assessment', 'Portfolio review, challenge deliverables, peer feedback, mentor notes'],
                  ['Certification', '6 KHDA-attested certificates + digital portfolio'],
                  ['Program Team', 'Proplr provides facilitator, mentors, industry reps, and reporting'],
                ].map(([label, value], i) => (
                  <tr key={label} style={{ background: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                    <td className="px-6 py-4 font-semibold" style={{ color: '#071629', borderBottom: '1px solid rgba(0,0,0,0.05)', whiteSpace: 'nowrap' }}>{label}</td>
                    <td className="px-6 py-4" style={{ color: '#6e6e73', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── KHDA & UAE ALIGNMENT ─────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>WHY SCHOOLS CHOOSE PROPLR</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629', marginBottom: 12 }}>
              Aligned with Dubai&apos;s E33, UAE AI 2031,<br />and the Rahhal framework.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 600, margin: '0 auto 16px' }}>Proplr isn&apos;t a nice-to-have. It&apos;s how schools make Dubai&apos;s national education priorities real in their classrooms.</p>
            <div className="inline-block mt-4 px-5 py-2 rounded-full text-sm font-bold" style={{ background: '#3d9be9', color: '#ffffff' }}>
              KHDA Permit #633441
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Inspection-Ready Evidence',
                body: 'Proplr generates attendance records, rubric scores, mentor notes, and certificates — all formatted for KHDA and school inspection processes.',
              },
              {
                title: 'Visible Student Futures',
                body: 'Schools that host a Proplr club demonstrate tangible career readiness outcomes for their students, supporting both E33 and Rahhal compliance.',
              },
              {
                title: 'Zero Curriculum Disruption',
                body: 'Runs as an after-school club or co-curricular module. Proplr provides the facilitator, mentors, and industry connections — staff just open the door.',
              },
            ].map((card, i) => (
              <div key={card.title} className={`pub-card reveal reveal-delay-${i + 1} p-8`} style={{ border: '1px solid rgba(61,155,233,0.15)' }}>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 17, color: '#071629', marginBottom: 10 }}>{card.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.7 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI INTEGRATION ───────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="max-w-3xl mx-auto text-center reveal">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(61,155,233,0.1)', color: '#1a6fad', border: '1px solid rgba(61,155,233,0.2)' }}>
              UAE AI 2031 Aligned
            </span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629', marginBottom: 12 }}>
              AI is in the curriculum, not just the buzzwords.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, marginBottom: 32 }}>
              Proplr Foundation integrates AI literacy across all pillars — not as an add-on, but as a practical skill. Students use AI as a co-pilot, learn AI ethics, and tackle real AI for Good challenges.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {['AI Literacy & Ethics', 'AI as Co-Pilot', 'AI for Good Challenges'].map((item) => (
                <div key={item} className="px-5 py-4 rounded-xl text-sm font-semibold" style={{ background: 'rgba(61,155,233,0.08)', color: '#1a6fad', border: '1px solid rgba(61,155,233,0.15)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── START A CLUB CTA ─────────────────────────────── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section reveal" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 14 }}>
                Your school doesn&apos;t have a Proplr club yet?
              </h2>
              <p style={{ color: '#8ca3be', fontSize: 16, lineHeight: 1.65, marginBottom: 28 }}>
                Proplr provides the facilitator, mentors, industry representatives, and reporting. The school provides the students and the space. That&apos;s the deal.
              </p>
              <Link href="/start-a-club" className="pub-btn-primary">
                Bring Proplr to Your School →
              </Link>
            </div>
            <div>
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-semibold text-white text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>What schools get:</p>
                <ul className="space-y-3">
                  {[
                    'KHDA-aligned program content and reporting',
                    'Inspection-ready evidence (attendance, rubrics, certificates)',
                    'Industry access for students — panels, challenges, internships',
                    'Free Compass pilot for a sample Grades 8–10 cohort',
                    'Zero curriculum disruption — after-school or co-curricular',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#8ca3be' }}>
                      <span style={{ color: '#ffcb5d' }}>✓</span> {item}
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
            AED 400/month
          </h2>
          <p style={{ color: '#6e6e73', fontSize: 18, marginBottom: 4 }}>8 months = AED 3,200/year</p>
          <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 28 }}>Everything included. No hidden fees. KHDA certified.</p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['6 KHDA Certificates', 'Weekly Program Sessions', 'Industry Mentorship', 'Career Discovery Panels', 'Portfolio Building', 'Compass Assessment', 'Showcase Eligibility'].map((f) => (
              <span key={f} className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: '#ffffff', color: '#1d1d1f', border: '1px solid rgba(0,0,0,0.08)' }}>
                {f}
              </span>
            ))}
          </div>
          <Link href="/register" className="pub-btn-primary">Register for Foundation →</Link>
        </div>
      </section>
    </div>
  );
}
