import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Compass - AI Career Assessment by Proplr' };

export default function CompassPage() {
  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark">
        <Image
          src="https://images.pexels.com/photos/8468516/pexels-photo-8468516.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Abstract technology background"
          fill
          priority
          className="pub-ken-burns"
          style={{ objectFit: 'cover' }}
        />

        <div className="pub-section relative z-10 text-center" style={{ paddingTop: 100, paddingBottom: 80 }}>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase" style={{ background: 'rgba(255,255,255,0.06)', color: '#8ca3be', border: '1px solid rgba(255,255,255,0.08)' }}>
            AI-Powered Career Clarity
          </div>

          <h1 className="pub-heading pub-text-shadow text-white reveal" style={{ fontSize: 'clamp(38px, 7vw, 72px)', marginBottom: 20, lineHeight: 1.05 }}>
            Find your path.<br />
            <span className="pub-gradient-text-animated">Own your future.</span>
          </h1>

          <p className="reveal reveal-delay-1 pub-text-shadow" style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.6 }}>
            One assessment. Three career lenses. A personalized AI report in under 45 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal reveal-delay-2">
            <a href="#take-assessment" className="pub-btn-primary pub-pulse-glow">
              Take the Assessment
            </a>
            <a href="#what-you-get" className="pub-btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section-compact">
          <div className="text-center mb-12 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>
              How It Works
            </span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629' }}>
              Three steps to clarity.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            {[
              { num: '01', title: 'Take the Assessment', desc: '30-45 min. Interests, work style, and personal inputs.', color: '#3d9be9' },
              { num: '02', title: 'Get Your Report', desc: 'AI-powered career matches across three methodologies.', color: '#ffcb5d' },
              { num: '03', title: 'Get Direction', desc: 'Clear next steps, adjacent paths, and actionable insights.', color: '#071629' },
            ].map((step, i) => (
              <div key={step.num} className={`reveal reveal-delay-${i + 1}`}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black text-white mx-auto mb-4 pub-float" style={{ background: step.color }}>
                  {step.num}
                </div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17, color: '#071629', marginBottom: 6 }}>{step.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.55 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pub-divider" />

      {/* ── WHAT YOU GET ────────────────────────────────────── */}
      <section id="what-you-get" style={{ background: '#f5f5f7' }}>
        <div className="pub-section-compact">
          <div className="text-center mb-10 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629', marginBottom: 8 }}>
              What&apos;s in your report.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 15 }}>Everything you need to move forward with confidence.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: '✦', label: 'AI-Powered Career Report' },
              { icon: '◎', label: '3-Path Career Matches' },
              { icon: '◇', label: 'Adjacent Career Paths' },
              { icon: '▦', label: 'Career Cluster View' },
              { icon: '◈', label: 'Parent Report' },
              { icon: '▣', label: 'School Analytics' },
              { icon: '✦', label: 'Personal Input Weighting' },
              { icon: '↯', label: 'Instant Delivery' },
            ].map((item, i) => (
              <div key={item.label} className={`pub-glass reveal reveal-scale reveal-delay-${(i % 4) + 1} p-5 text-center rounded-2xl`}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{item.icon}</span>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#071629', lineHeight: 1.35, display: 'block' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR SCHOOLS ─────────────────────────────────────── */}
      <section className="relative overflow-hidden pub-pattern-grid" style={{ background: '#071629' }}>
        <div className="pub-orb-yellow" style={{ top: -100, right: -80, opacity: 0.08 }} />
        <div className="pub-section-compact relative z-10">
          <div className="max-w-2xl mx-auto text-center reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#ffcb5d', textTransform: 'uppercase' as const, letterSpacing: '0.12em', display: 'block', marginBottom: 12 }}>
              For Schools
            </span>
            <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(24px, 4vw, 40px)', marginBottom: 14, lineHeight: 1.1 }}>
              Free pilot. Zero commitment.<br />
              <span style={{ color: '#ffcb5d' }}>Real student insights.</span>
            </h2>
            <p style={{ color: '#8ca3be', fontSize: 15, lineHeight: 1.6, maxWidth: 440, margin: '0 auto 28px' }}>
              Run Compass with Grades 8-10. Get individual reports and cohort-level analytics your counselling team can use immediately.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Sample cohort assessments', 'Student reports', 'Group analytics', 'Debrief session'].map((item) => (
                <span key={item} className="pub-glass px-4 py-2 rounded-full text-xs font-semibold" style={{ color: '#fff', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {item}
                </span>
              ))}
            </div>

            <a href="mailto:hello@proplr.ae?subject=Free%20Compass%20Pilot%20Request" className="pub-btn-primary">
              Book Your Free Pilot
            </a>
          </div>
        </div>
      </section>

      {/* ── TAKE ASSESSMENT CTA ───────────────────────────── */}
      <section id="take-assessment" style={{ background: '#f5f5f7' }}>
        <div className="pub-section text-center reveal">
          <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629', marginBottom: 12 }}>
            Ready to discover your path?
          </h2>
          <p style={{ color: '#6e6e73', fontSize: 16, marginBottom: 32 }}>
            Register for a Proplr program to get your full Compass assessment included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/enroll" className="pub-btn-primary">Register Now →</Link>
            <Link href="/start-a-club" className="pub-btn-ghost">Bring Compass to Your School →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ──────────────────────────────────────── */}
      <section className="pub-bg-animated" style={{ background: '#071629', padding: '56px 24px' }}>
        <div className="max-w-[1200px] mx-auto text-center reveal">
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(22px, 3vw, 34px)', marginBottom: 12 }}>
            Already a Proplr member?
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 15, marginBottom: 24 }}>
            Compass is included in Foundation and Impact programs.
          </p>
          <Link href="/enroll" className="pub-btn-primary">Register Now</Link>
        </div>
      </section>
    </div>
  );
}
