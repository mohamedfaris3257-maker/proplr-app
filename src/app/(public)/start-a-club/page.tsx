import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ClubInterestForm } from '@/components/public/ClubInterestForm';

export const metadata: Metadata = { title: 'Start a Proplr Club — Bring Proplr to Your School' };

export default function StartAClubPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="pub-hero-image pub-overlay-left">
        <Image
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80&auto=format"
          alt="Classroom setting"
          fill
          priority
          className="pub-ken-burns"
          style={{ objectFit: 'cover' }}
        />
        <div className="pub-section relative z-10 w-full">
          <div className="max-w-2xl">
            <div className="pub-line-grow reveal mb-6" />
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(61,155,233,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              FOR SCHOOLS & INSTITUTIONS
            </span>
            <h1 className="pub-heading pub-text-shadow reveal" style={{ fontSize: 'clamp(36px, 6vw, 60px)', color: '#ffffff', marginBottom: 20 }}>
              Bring Proplr<br />
              <span style={{ color: '#ffcb5d' }}>to your school.</span>
            </h1>
            <p className="reveal reveal-delay-1 pub-text-shadow" style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 480, marginBottom: 32 }}>
              We handle facilitators, mentors, industry reps, and reporting. You provide students and space. That&apos;s it.
            </p>
            <a href="#club-form" className="pub-btn-primary reveal reveal-delay-2">Get Started →</a>
          </div>
        </div>
      </section>

      {/* ── 3 STEPS ── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section">
          <h2 className="pub-heading text-white text-center reveal" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: 40 }}>
            Three steps to launch.
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Submit Interest', desc: 'Fill out the form below. Takes 3 minutes.' },
              { step: '2', title: 'Free Intro Session', desc: 'We come to your school or hop on a call.' },
              { step: '3', title: 'Launch in September', desc: 'Your Proplr club goes live with full support.' },
            ].map((s, i) => (
              <div key={s.step} className={`reveal reveal-delay-${i + 1} text-center`}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-4 pub-pulse-glow" style={{ background: '#3d9be9', fontFamily: 'Montserrat, sans-serif' }}>
                  {s.step}
                </div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 17, color: '#ffffff', marginBottom: 6 }}>{s.title}</h3>
                <p style={{ color: '#8ca3be', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT SCHOOLS GET ── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <h2 className="pub-heading text-center reveal" style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: '#071629', marginBottom: 36 }}>
            Everything included. Zero operational headache.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              { icon: '▤', text: 'KHDA-aligned curriculum and reporting' },
              { icon: '📁', text: 'Inspection-ready documentation' },
              { icon: '🏭', text: 'Industry access: internships, panels, challenges' },
              { icon: '◆', text: 'No disruption to teaching staff' },
              { icon: '◆', text: 'Facilitators and mentors provided' },
              { icon: '★', text: '6 KHDA-attested certificates per student' },
            ].map((item, i) => (
              <div key={item.text} className={`pub-card reveal reveal-delay-${(i % 3) + 1} p-4 flex items-start gap-3`}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ color: '#1d1d1f', fontSize: 14, fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <div className="max-w-lg mx-auto mt-8 reveal">
            <div className="pub-card pub-glow-border p-6 text-center" style={{ background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)' }}>
              <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>◎</span>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 6 }}>
                Start with a free Compass pilot
              </h3>
              <p style={{ color: '#6e6e73', fontSize: 14 }}>
                Run a free career assessment for a sample cohort. No cost. No commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <section id="club-form" style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10 reveal">
              <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 8 }}>
                Submit your interest.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15 }}>We&apos;ll be in touch within 48 hours.</p>
            </div>
            <div className="pub-card p-8 reveal reveal-delay-1" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <ClubInterestForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
