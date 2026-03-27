import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SummerCampForm } from '@/components/public/SummerCampForm';

export const metadata: Metadata = { title: 'Proplr Summer Camp 2026' };

export default function SummerCampPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="pub-hero-image pub-overlay-left">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80&auto=format"
          alt="Students working together outdoors during summer"
          fill
          priority
          className="pub-ken-burns"
          style={{ objectFit: 'cover' }}
        />
        <div className="pub-section relative z-10 w-full">
          <div className="max-w-2xl">
            <div className="pub-line-grow reveal mb-6" />
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(255,203,93,0.15)', color: '#ffcb5d', border: '1px solid rgba(255,203,93,0.3)' }}>
              SUMMER 2026
            </span>
            <h1 className="pub-heading pub-text-shadow reveal" style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: '#ffffff', marginBottom: 20 }}>
              Summer Camp 2026.<br />
              <span style={{ color: '#ffcb5d' }}>Don&apos;t waste your summer.</span>
            </h1>
            <p className="reveal reveal-delay-1 pub-text-shadow" style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 480, marginBottom: 32 }}>
              4 weekends. 3 pillars. Real skills. Entrepreneurship, Personal Branding, and Digital Literacy - built for students who want more.
            </p>
            <div className="flex flex-wrap gap-3 reveal reveal-delay-2">
              <a href="#register-camp" className="pub-btn-primary">Secure Your Spot</a>
              <span className="pub-text-shadow" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, alignSelf: 'center' }}>Dubai, UAE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section-compact">
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center reveal">
            {[
              { value: '4', label: 'Weekends' },
              { value: '3', label: 'Pillars' },
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

      {/* ── 3 PILLARS ── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', color: '#071629', marginBottom: 10 }}>
              3 pillars this summer.
            </h2>
            <p style={{ color: '#5a5f7a', fontSize: 15 }}>Focused. Intensive. Practical.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { num: '01', title: 'Entrepreneurship', desc: 'Build and pitch a real business idea. Work with mentors who have launched companies.' },
              { num: '02', title: 'Personal Branding', desc: 'Build your LinkedIn, portfolio, and professional identity before you need one.' },
              { num: '03', title: 'Digital Literacy', desc: 'AI tools, data skills, and digital creation. Go from user to creator.' },
            ].map((p, i) => (
              <div
                key={p.title}
                className={`pub-card pub-glow-border reveal reveal-delay-${i + 1}`}
                style={{ padding: '28px 24px', textAlign: 'center' }}
              >
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 32, color: '#ffcb5d', display: 'block', marginBottom: 6 }}>
                  {p.num}
                </span>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', display: 'block', marginBottom: 8 }}>
                  {p.title}
                </span>
                <span style={{ fontSize: 13.5, color: '#5a5f7a', lineHeight: 1.6 }}>
                  {p.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT TO EXPECT ── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <h2 className="pub-heading text-center reveal" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', color: '#071629', marginBottom: 40 }}>
            What to expect.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: '01', title: 'Career Discovery' },
              { icon: '02', title: 'Industry Speakers' },
              { icon: '03', title: 'Pitch Your Startup' },
              { icon: '04', title: 'Compass Assessment' },
              { icon: '05', title: 'Certificate' },
            ].map((item, i) => (
              <div key={item.title} className={`pub-card pub-glow-border reveal reveal-delay-${(i % 4) + 1} p-5 text-center`}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 24, color: '#3d9be9', display: 'block', marginBottom: 10 }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#071629' }}>{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO SHOULD JOIN ── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <h2 className="pub-heading text-center reveal" style={{ fontSize: 'clamp(22px, 3vw, 36px)', color: '#071629', marginBottom: 36 }}>
            Summer Camp is for you if...
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'You want a head start', desc: 'Grades 8-12. Hit September running, not from zero.' },
              { title: 'You\'re exploring Proplr', desc: 'Try the program before committing to the full year.' },
              { title: 'Done with school? Keep growing.', desc: 'Already graduated or on break? Grow your skills this summer. Open to all UAE students.' },
            ].map((item, i) => (
              <div key={item.title} className={`pub-card reveal reveal-delay-${i + 1} p-6 text-center`} style={{ border: '1px solid rgba(255,203,93,0.25)', background: 'rgba(255,203,93,0.04)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,203,93,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section text-center reveal">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#ffcb5d', marginBottom: 16 }}>PRICING</div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            <div style={{ background: 'rgba(255,203,93,0.1)', border: '1.5px solid rgba(255,203,93,0.3)', borderRadius: 20, padding: 32 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ffcb5d', letterSpacing: 1.5, display: 'block', marginBottom: 8 }}>EARLY BIRD</span>
              <span className="pub-stat-number" style={{ fontSize: 36, color: '#ffffff', display: 'block', marginBottom: 4 }}>AED 999</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Limited spots</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, display: 'block', marginBottom: 8 }}>STANDARD</span>
              <span className="pub-stat-number" style={{ fontSize: 36, color: '#ffffff', display: 'block', marginBottom: 4 }}>AED 1,500</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Regular price</span>
            </div>
          </div>
          <p style={{ color: '#8ca3be', fontSize: 14, marginTop: 20 }}>
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
              <p style={{ color: '#6e6e73', fontSize: 15 }}>Submit your interest and we&apos;ll confirm details.</p>
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
