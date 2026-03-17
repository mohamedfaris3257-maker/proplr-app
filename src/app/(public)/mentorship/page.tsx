import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MentorApplicationForm } from '@/components/public/MentorApplicationForm';

export const metadata: Metadata = { title: 'Mentorship — Proplr', description: 'Get matched with experienced UAE professionals.' };

export default function MentorshipPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="pub-hero-image pub-overlay-left">
        <Image
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80&auto=format"
          alt="Mentorship session"
          fill
          priority
          className="pub-ken-burns"
          style={{ objectFit: 'cover' }}
        />
        <div className="pub-section relative z-10 w-full">
          <div className="max-w-2xl">
            <div className="pub-line-grow reveal mb-6" />
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(61,155,233,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              MENTORSHIP PROGRAM
            </span>
            <h1 className="pub-heading pub-text-shadow reveal" style={{ fontSize: 'clamp(36px, 6vw, 60px)', color: '#ffffff', marginBottom: 20 }}>
              Guidance from people<br />
              <span style={{ color: '#ffcb5d' }}>who&apos;ve been there.</span>
            </h1>
            <p className="reveal reveal-delay-1 pub-text-shadow" style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 480, marginBottom: 32 }}>
              Every student gets matched with a real professional. Real advice. Real careers. Not textbook theory.
            </p>
            <div className="flex flex-wrap gap-3 reveal reveal-delay-2">
              <Link href="/enroll" className="pub-btn-primary">Join a Program →</Link>
              <a href="#become-mentor" className="pub-btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Become a Mentor →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section-compact">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto text-center reveal">
            {[
              { value: '150+', label: 'Active Mentors', color: '#3d9be9' },
              { value: '20+', label: 'Countries', color: '#ffcb5d' },
              { value: '40+', label: 'Industries', color: '#3d9be9' },
              { value: '2hrs', label: 'Per Month', color: '#ffcb5d' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="pub-stat-number" style={{ color: stat.color }}>{stat.value}</p>
                <p style={{ color: '#8ca3be', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT STUDENTS GET ── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <h2 className="pub-heading text-center reveal" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', color: '#071629', marginBottom: 36 }}>
            What students get.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🎯', title: 'Assigned Mentor', desc: 'Monthly 1:1 sessions matched to your interests.' },
              { icon: '📋', title: 'CV & Portfolio Review', desc: 'Direct feedback before real applications.' },
              { icon: '🤝', title: 'Industry Intros', desc: 'Warm connections in your target field.' },
              { icon: '🗣', title: 'Interview Prep', desc: 'Mock interviews and practical guidance.' },
              { icon: '🧭', title: 'Career Clarity', desc: 'Direction based on your Compass results.' },
              { icon: '🌍', title: 'UAE Network', desc: 'Access to the broader mentor community.' },
            ].map((b, i) => (
              <div key={b.title} className={`pub-card pub-glow-border reveal reveal-delay-${(i % 3) + 1} p-5`}>
                <span style={{ fontSize: 26, display: 'block', marginBottom: 10 }}>{b.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#071629', marginBottom: 4 }}>{b.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 13, lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW MATCHING WORKS ── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <h2 className="pub-heading text-center reveal" style={{ fontSize: 'clamp(22px, 3vw, 36px)', color: '#071629', marginBottom: 36 }}>
            How matching works.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Complete Compass', desc: 'Your assessment powers the match.' },
              { step: '02', title: 'Get Matched', desc: 'Paired with a mentor in your field.' },
              { step: '03', title: 'Start Connecting', desc: 'Monthly sessions all year long.' },
            ].map((s, i) => (
              <div key={s.step} className={`pub-card reveal reveal-delay-${i + 1} p-6 text-center`} style={{ border: '1px solid rgba(61,155,233,0.15)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#3d9be9', marginBottom: 10, fontFamily: 'Montserrat, sans-serif' }}>{s.step}</div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 6 }}>{s.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BECOME A MENTOR ── */}
      <section id="become-mentor" style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div className="reveal">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: '#071629', color: '#ffffff' }}>
                FOR PROFESSIONALS
              </span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                Become a Proplr Mentor.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                2 hours a month. Impact that lasts years.
              </p>
              <div className="mb-6">
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#071629', marginBottom: 10 }}>Requirements:</p>
                <ul className="space-y-2">
                  {[
                    '3+ years professional experience',
                    'UAE-based or UAE-connected',
                    '2 hours/month commitment',
                    'Genuine interest in student growth',
                  ].map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm" style={{ color: '#6e6e73' }}>
                      <span style={{ color: '#3d9be9', fontWeight: 700, flexShrink: 0 }}>→</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pub-card p-4" style={{ border: '1px solid rgba(255,203,93,0.3)', background: 'rgba(255,203,93,0.05)' }}>
                <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.6 }}>
                  <strong style={{ color: '#071629' }}>You get:</strong> Platform recognition, CSR alignment, Showcase invitations, and partner events.
                </p>
              </div>
            </div>
            <div className="pub-card reveal reveal-delay-1 p-8" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#071629', marginBottom: 20 }}>
                Apply as a Mentor
              </h3>
              <MentorApplicationForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
