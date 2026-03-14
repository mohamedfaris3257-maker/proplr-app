import type { Metadata } from 'next';
import { ShowcaseRegisterForm } from '@/components/public/ShowcaseRegisterForm';

export const metadata: Metadata = { title: 'Proplr National Showcase 2026' };

export default function ShowcasePage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #071629 0%, #0d2440 100%)', minHeight: 480 }} className="relative overflow-hidden">
        <div style={{ position: 'absolute', width: 500, height: 500, top: -100, right: -80, background: '#ffcb5d', opacity: 0.06, filter: 'blur(80px)', borderRadius: '50%' }} />
        <div className="pub-section relative z-10 text-center" style={{ paddingTop: 96, paddingBottom: 80 }}>
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(255,203,93,0.15)', color: '#ffcb5d', border: '1px solid rgba(255,203,93,0.25)' }}>
            PROPLR NATIONAL SHOWCASE 2026
          </div>
          <h1 className="pub-heading text-white reveal" style={{ fontSize: 'clamp(32px, 6vw, 64px)', marginBottom: 20 }}>
            Where Dubai&apos;s most ambitious<br />
            <span style={{ color: '#ffcb5d' }}>students take the stage.</span>
          </h1>
          <p className="reveal reveal-delay-1" style={{ fontSize: 18, color: '#8ca3be', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.65 }}>
            The Proplr National Showcase is the flagship annual event where students present the work they&apos;ve built, compete in industry challenges, receive recognition, and celebrate a year of real growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal reveal-delay-2">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Date', value: 'TBD' },
                { label: 'Venue', value: 'Dubai, UAE' },
                { label: 'Status', value: 'Announcing Soon' },
              ].map((d) => (
                <div key={d.label} className="px-5 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ color: '#4a6785', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{d.label}</p>
                  <p className="font-semibold text-white text-sm">{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS THE SHOWCASE ─────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>ABOUT THE EVENT</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629', marginBottom: 12 }}>
              This is what the whole year builds toward.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 17, maxWidth: 600, margin: '0 auto' }}>
              The National Showcase isn&apos;t an award ceremony for attendance. It&apos;s a real event where students stand in front of industry professionals, present the projects they&apos;ve built over the year, and compete in live challenges. It&apos;s the moment the portfolio becomes a performance.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏆', title: 'National Competition', desc: 'Students compete in industry challenge categories. Winners get recognition, prizes, and industry introductions.' },
              { icon: '🏗️', title: 'Case Challenges', desc: 'Live company briefs presented to real business judges — not teachers.' },
              { icon: '💰', title: 'Startup Funding Opportunities', desc: 'Top Impact students get access to seed funding introductions from our network.' },
              { icon: '🏅', title: 'Yearly Student Awards', desc: 'Recognition for the top students in Leadership, Innovation, Impact, and Community.' },
              { icon: '👔', title: 'Industry Judge Panel', desc: 'Assessed by actual professionals from UAE companies, not just academics.' },
              { icon: '👨‍👩‍👧', title: 'Parent Attendance', desc: 'The tangible proof moment parents have been waiting for. Their investment on stage.' },
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

      {/* ── WHY IT MATTERS ───────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: '#071629', marginBottom: 10 }}>
              Why the Showcase matters.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                label: 'For Students', color: '#3d9be9',
                points: ['Proof of what you built — on a public stage', 'Industry recognition for your portfolio', 'Networking with professionals and peers', 'CV anchor point for future applications'],
              },
              {
                label: 'For Schools', color: '#ffcb5d',
                points: ['Visible, external validation of program outcomes', 'Parent satisfaction and community pride', 'Inspection evidence for KHDA and beyond', 'Recruitment for next year\'s program cohort'],
              },
              {
                label: 'For Parents', color: '#071629',
                points: ['See exactly what your AED 3,200 produced', 'Industry-judged, not just school-graded', 'Tangible outcomes before committing further', 'Your child on stage — literally'],
              },
            ].map((section, i) => (
              <div key={section.label} className={`pub-card reveal reveal-delay-${i + 1} p-8`} style={{ border: `2px solid ${section.color}25` }}>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: section.color, color: section.color === '#071629' ? '#ffffff' : '#071629' }}>
                  {section.label}
                </div>
                <ul className="space-y-2.5">
                  {section.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: '#1d1d1f' }}>
                      <span style={{ color: section.color, flexShrink: 0, fontWeight: 700 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNOUNCE COMING SOON ─────────────────────────── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section text-center reveal" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(24px, 3vw, 38px)', marginBottom: 14 }}>
            First Showcase. More Details Coming Soon.
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 17, maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.65 }}>
            We&apos;re building toward something big. Get your students in the program by September 2026 and they&apos;ll be on stage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register" className="pub-btn-primary">Register Your School</a>
          </div>
        </div>
      </section>

      {/* ── SCHOOL REGISTRATION FORM ─────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10 reveal">
              <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: '#071629', marginBottom: 8 }}>
                Register your school for Showcase spots.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15 }}>Secure your students&apos; place now. We&apos;ll follow up with details as they&apos;re confirmed.</p>
            </div>
            <div className="pub-card p-8 reveal reveal-delay-1" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <ShowcaseRegisterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
