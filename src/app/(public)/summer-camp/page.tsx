import type { Metadata } from 'next';
import Link from 'next/link';
import { SummerCampForm } from '@/components/public/SummerCampForm';

export const metadata: Metadata = { title: 'Proplr Summer Camp 2026 — Get a Head Start' };

export default function SummerCampPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="pub-orb-yellow" style={{ width: 500, height: 500, top: -150, right: -80 }} />
        <div className="pub-orb-blue" style={{ width: 400, height: 400, bottom: -100, left: -80 }} />
        <div className="pub-section relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(255,203,93,0.15)', color: '#a07800', border: '1px solid rgba(255,203,93,0.3)' }}>
              SUMMER CAMP 2026
            </span>
            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: '#071629', marginBottom: 20 }}>
              Get a head start.<br />
              <span className="pub-gradient-text-animated">Before September arrives.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 18, color: '#6e6e73', maxWidth: 480, marginBottom: 32 }}>
              5 days of career exploration, industry mentors, and real skill-building — before school even starts.
            </p>
            <div className="flex flex-wrap gap-3 reveal reveal-delay-2">
              <a href="#register-camp" className="pub-btn-primary">Secure Your Spot →</a>
              <span style={{ color: '#9ca3af', fontSize: 14, alignSelf: 'center' }}>Dubai, UAE · Dates Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section-compact">
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center reveal">
            {[
              { value: '5', label: 'Days' },
              { value: '6', label: 'Pillars' },
              { value: '1', label: 'Compass Report' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="pub-stat-number" style={{ color: '#ffcb5d' }}>{stat.value}</p>
                <p style={{ color: '#8ca3be', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT TO EXPECT ── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <h2 className="pub-heading text-center reveal" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', color: '#071629', marginBottom: 40 }}>
            What to expect.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: '🗺️', title: 'Career Discovery' },
              { icon: '🤝', title: 'Industry Speakers' },
              { icon: '⚡', title: 'Design Sprints' },
              { icon: '🧭', title: 'Compass Assessment' },
              { icon: '📜', title: 'Certificate' },
            ].map((item, i) => (
              <div key={item.title} className={`pub-card pub-glow-border reveal reveal-delay-${(i % 4) + 1} p-5 text-center`}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#071629' }}>{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO SHOULD JOIN ── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <h2 className="pub-heading text-center reveal" style={{ fontSize: 'clamp(22px, 3vw, 36px)', color: '#071629', marginBottom: 36 }}>
            Summer Camp is for you if...
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '🎒', title: 'You want a head start', desc: 'Grades 8-12. Hit September running, not from zero.' },
              { icon: '🤔', title: 'You\'re exploring Proplr', desc: 'Try the program before committing. Lowest-risk way in.' },
              { icon: '🏫', title: 'Your school isn\'t on Proplr yet', desc: 'Open to all Dubai students. No school partnership needed.' },
            ].map((item, i) => (
              <div key={item.title} className={`pub-card reveal reveal-delay-${i + 1} p-6 text-center`} style={{ border: '1px solid rgba(255,203,93,0.25)', background: 'rgba(255,203,93,0.04)' }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section-compact text-center reveal">
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(22px, 3vw, 34px)', marginBottom: 12 }}>
            Camp ends. The momentum doesn&apos;t.
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Camp participants who enroll in Foundation receive credit toward Year 1.
          </p>
        </div>
      </section>

      {/* ── FORM ── */}
      <section id="register-camp" style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10 reveal">
              <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: '#071629', marginBottom: 8 }}>
                Register for Summer Camp 2026
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15 }}>Pricing TBD — submit your interest and we&apos;ll confirm details.</p>
            </div>
            <div className="pub-card p-8 reveal reveal-delay-1" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <SummerCampForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
