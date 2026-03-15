import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ShowcaseRegisterForm } from '@/components/public/ShowcaseRegisterForm';

export const metadata: Metadata = { title: 'Proplr National Showcase 2026' };

export default function ShowcasePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="pub-hero-image" style={{ minHeight: 420 }}>
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80&auto=format"
          alt="Conference stage"
          fill
          priority
          className="pub-ken-burns"
          style={{ objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #071629 0%, #0d2440 100%)', opacity: 0.75, zIndex: 1 }} />
        <div className="pub-section relative z-10 text-center" style={{ paddingTop: 88, paddingBottom: 72 }}>
          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(255,203,93,0.15)', color: '#ffcb5d', border: '1px solid rgba(255,203,93,0.25)' }}>
            NATIONAL SHOWCASE 2026
          </span>
          <h1 className="pub-heading pub-text-shadow text-white reveal" style={{ fontSize: 'clamp(36px, 6vw, 68px)', marginBottom: 20 }}>
            Where ambitious students<br />
            <span className="pub-gradient-text-animated">take the stage.</span>
          </h1>
          <p className="reveal reveal-delay-1 pub-text-shadow" style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 520, margin: '0 auto 32px' }}>
            Present real work. Compete in live challenges. Get judged by industry professionals.
          </p>
          <div className="flex items-center justify-center gap-4 reveal reveal-delay-2">
            <a href="#register-showcase" className="pub-btn-primary">Register Your School →</a>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: '#f5f5f7', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="pub-section-compact">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto text-center reveal">
            {[
              { value: '6', label: 'Pillars' },
              { value: '1', label: 'Epic Showcase' },
              { value: '2', label: 'Cohorts Compete' },
              { value: '\u221E', label: 'Possibilities' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="pub-stat-number" style={{ color: '#ffcb5d' }}>{stat.value}</p>
                <p style={{ color: '#6e6e73', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS ── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <h2 className="pub-heading text-center reveal" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629', marginBottom: 40 }}>
            What happens at Showcase.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏆', title: 'National Competition', desc: 'Compete across industry challenge categories for prizes and recognition.' },
              { icon: '🏗️', title: 'Live Case Challenges', desc: 'Real company briefs. Real business judges. Not teachers.' },
              { icon: '💰', title: 'Startup Funding Access', desc: 'Top Impact students meet seed funding partners from our network.' },
              { icon: '🏅', title: 'Student Awards', desc: 'Leadership, Innovation, Impact, and Community — recognized on stage.' },
              { icon: '👔', title: 'Industry Judge Panel', desc: 'Assessed by UAE professionals, not academics.' },
            ].map((item, i) => (
              <div key={item.title} className={`pub-card pub-glow-border reveal reveal-delay-${(i % 3) + 1} p-6`}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#071629', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <h2 className="pub-heading text-center reveal" style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: '#071629', marginBottom: 36 }}>
            Why the Showcase matters.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                label: 'For Students', color: '#3d9be9',
                points: ['Public proof of what you built', 'Industry recognition for your portfolio', 'Network with professionals and peers', 'CV anchor for future applications'],
              },
              {
                label: 'For Schools', color: '#ffcb5d',
                points: ['External validation of outcomes', 'Parent satisfaction and pride', 'KHDA inspection evidence', 'Recruitment for next cohort'],
              },
              {
                label: 'For Parents', color: '#071629',
                points: ['See exactly what the program produced', 'Industry-judged, not school-graded', 'Tangible outcomes before committing further', 'Your child on stage — literally'],
              },
            ].map((section, i) => (
              <div key={section.label} className={`pub-card reveal reveal-delay-${i + 1} p-7`} style={{ border: `2px solid ${section.color}25` }}>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: section.color, color: section.color === '#071629' ? '#fff' : '#071629' }}>
                  {section.label}
                </div>
                <ul className="space-y-2">
                  {section.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: '#1d1d1f' }}>
                      <span style={{ color: section.color, flexShrink: 0, fontWeight: 700 }}>&#10003;</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section-compact text-center reveal">
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(24px, 3vw, 38px)', marginBottom: 12 }}>
            More details coming soon.
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 16, maxWidth: 480, margin: '0 auto 24px' }}>
            Get your students in by September 2026 and they&apos;ll be on stage.
          </p>
          <Link href="/register" className="pub-btn-primary">Register Your School →</Link>
        </div>
      </section>

      {/* ── FORM ── */}
      <section id="register-showcase" style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10 reveal">
              <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: '#071629', marginBottom: 8 }}>
                Register for Showcase spots.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15 }}>Secure your students&apos; place. We&apos;ll follow up with details.</p>
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
