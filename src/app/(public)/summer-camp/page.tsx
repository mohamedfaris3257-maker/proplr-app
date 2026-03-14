import type { Metadata } from 'next';
import { SummerCampForm } from '@/components/public/SummerCampForm';

export const metadata: Metadata = { title: 'Proplr Summer Camp 2026 — Get a Head Start' };

export default function SummerCampPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="pub-orb-yellow" style={{ width: 500, height: 500, top: -150, right: -80 }} />
        <div className="pub-orb-blue" style={{ width: 400, height: 400, bottom: -100, left: -80 }} />
        <div className="pub-section relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(255,203,93,0.15)', color: '#a07800', border: '1px solid rgba(255,203,93,0.3)' }}>
              PROPLR SUMMER CAMP 2026
            </span>
            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#071629', marginBottom: 20 }}>
              Get a head start.<br />
              <span className="pub-gradient-text">Before September even arrives.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 18, color: '#6e6e73', lineHeight: 1.65, maxWidth: 540, marginBottom: 20 }}>
              An intensive summer program for students who want to explore careers, build real skills, and meet industry mentors — before the school year begins.
            </p>
            <p className="reveal reveal-delay-2" style={{ color: '#9ca3af', fontSize: 14, marginBottom: 32 }}>Dates: Coming Soon · Dubai, UAE</p>
            <div className="reveal reveal-delay-2">
              <a href="#register-camp" className="pub-btn-primary">Secure Your Spot →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS AT CAMP ─────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>WHAT TO EXPECT</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: '#071629', marginBottom: 10 }}>
              Five days. Six pillars. One big head start.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🗺️', title: 'Career Discovery Sessions', desc: 'Facilitated workshops that help you figure out what you\'re actually interested in — not what you think you should be interested in.' },
              { icon: '🤝', title: 'Industry Guest Speakers', desc: 'Professionals from across Dubai\'s business, tech, creative, and social sectors share their paths, answer questions, and give students a real look at what different careers actually involve.' },
              { icon: '⚡', title: 'Hands-On Challenges', desc: 'Team challenges, pitch competitions, and design sprints. You\'ll work with students from different schools on real problems.' },
              { icon: '🧭', title: 'Compass Career Assessment', desc: 'Included. Every Summer Camp participant receives a full Compass report — so you leave with a clear sense of direction, not just a fun experience.' },
              { icon: '📜', title: 'Certificate of Participation', desc: 'Official Proplr Summer Camp certificate. Start building your portfolio from day one.' },
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

      {/* ── WHO SHOULD JOIN ──────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629', marginBottom: 10 }}>
              Summer Camp is for you if…
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '🎒', title: 'You want to get ahead.', desc: "You're in Grades 8–12 and you want to start your Foundation year with momentum, not from zero. Come to camp and you'll hit September running." },
              { icon: '🤔', title: "You're deciding about Foundation.", desc: "Not sure if Proplr is right for you? Summer Camp is the lowest-commitment way to try it. Experience the program, meet the team, and decide from a place of experience rather than assumption." },
              { icon: '🏫', title: "Your school doesn't have Proplr yet.", desc: "Camp is open to all Dubai students — whether or not your school runs a Proplr club. It's also how you can show your school community what Proplr is actually like." },
            ].map((item, i) => (
              <div key={item.title} className={`pub-card reveal reveal-delay-${i + 1} p-7 text-center`} style={{ border: '1px solid rgba(255,203,93,0.25)', background: 'rgba(255,203,93,0.04)' }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 14 }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAMP → FOUNDATION PIPELINE ───────────────────── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section text-center reveal" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 14 }}>🚀</span>
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(22px, 3vw, 34px)', marginBottom: 14 }}>
            Summer Camp is the beginning, not the event.
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 17, maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.65 }}>
            Every student who completes Summer Camp enters September ahead. You&apos;ll have your Compass report in hand, your first portfolio entry completed, and a real sense of which pillar you want to lead with. Summer Camp participants who enroll in Foundation receive credit toward their Year 1 journey.
          </p>
        </div>
      </section>

      {/* ── REGISTRATION FORM ────────────────────────────── */}
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
