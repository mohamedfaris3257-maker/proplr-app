import type { Metadata } from 'next';
import Link from 'next/link';
import { MentorApplicationForm } from '@/components/public/MentorApplicationForm';

export const metadata: Metadata = { title: 'Mentorship — Proplr', description: 'Get matched with experienced UAE professionals.' };

const MENTOR_BENEFITS = [
  { icon: '🎯', title: 'Assigned Mentor', desc: 'Monthly 1:1 sessions with a professional matched to your career interests.' },
  { icon: '📋', title: 'CV & Portfolio Review', desc: 'Direct feedback on your materials before applying to internships or jobs.' },
  { icon: '🤝', title: 'Industry Introductions', desc: 'Warm network connections to professionals in your target field.' },
  { icon: '🗣', title: 'Interview Preparation', desc: 'Mock interviews and practical guidance for real applications.' },
  { icon: '🧭', title: 'Career Clarity', desc: 'Direction setting based on your Compass assessment results and goals.' },
  { icon: '🌍', title: 'UAE Network', desc: 'Access to the broader Proplr mentor community across industries.' },
];

const MENTOR_REQS = [
  'Minimum 3 years professional experience',
  'Based in the UAE (or UAE-connected)',
  'Commitment of 2 hours/month',
  'Genuine interest in student development',
];

export default function MentorshipPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="pub-orb-blue" style={{ width: 500, height: 500, top: -200, right: -100 }} />
        <div className="pub-section relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(61,155,233,0.1)', color: '#1a6fad', border: '1px solid rgba(61,155,233,0.2)' }}>
              Mentorship Program
            </span>
            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: '#071629', marginBottom: 20 }}>
              Guidance from people<br />
              <span className="pub-gradient-text">who&apos;ve been there.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 17, color: '#6e6e73', lineHeight: 1.65, maxWidth: 520 }}>
              Every Proplr student gets matched with experienced UAE professionals for regular 1:1 guidance — real advice from real careers.
            </p>
            <div className="flex flex-wrap gap-3 mt-8 reveal reveal-delay-2">
              <Link href="/register" className="pub-btn-primary">Join a Program →</Link>
              <a href="#become-mentor" className="pub-btn-ghost">Become a Mentor →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR STUDENTS ─────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 10 }}>What students get.</h2>
            <p style={{ color: '#6e6e73', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
              Mentorship is built into every Proplr program — not an add-on.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MENTOR_BENEFITS.map((b, i) => (
              <div key={b.title} className={`pub-card reveal reveal-delay-${(i % 3) + 1} p-6`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{b.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#071629', marginBottom: 6 }}>{b.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{b.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <Link href="/register" className="pub-btn-navy">Register for a Program →</Link>
          </div>
        </div>
      </section>

      {/* ── HOW MATCHING WORKS ───────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 reveal">
              <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629', marginBottom: 10 }}>How mentor matching works.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Complete Compass', desc: 'Your Compass assessment identifies your strengths and career direction — this powers your match.' },
                { step: '02', title: 'Get Matched', desc: 'Our team pairs you with a mentor whose expertise aligns with your goals and interests.' },
                { step: '03', title: 'Start Connecting', desc: 'Monthly 1:1 sessions, portfolio reviews, and networking — throughout your program year.' },
              ].map((s, i) => (
                <div key={s.step} className={`pub-card reveal reveal-delay-${i + 1} p-6 text-center`} style={{ border: '1px solid rgba(61,155,233,0.15)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#3d9be9', marginBottom: 12, fontFamily: 'Montserrat, sans-serif' }}>{s.step}</div>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BECOME A MENTOR ──────────────────────────────── */}
      <section id="become-mentor" style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: '#071629', color: '#ffffff' }}>
                For Professionals
              </span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                Become a Proplr Mentor.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                Share your experience and help shape the next generation of UAE professionals. It&apos;s 2 hours a month — and the impact lasts years.
              </p>
              <div className="mb-6">
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#071629', marginBottom: 10 }}>What we look for:</p>
                <ul className="space-y-3">
                  {MENTOR_REQS.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm" style={{ color: '#6e6e73' }}>
                      <span style={{ color: '#3d9be9', fontWeight: 700, flexShrink: 0 }}>→</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pub-card p-5" style={{ border: '1px solid rgba(255,203,93,0.3)', background: 'rgba(255,203,93,0.05)' }}>
                <p style={{ fontSize: 14, color: '#6e6e73', lineHeight: 1.65 }}>
                  <strong style={{ color: '#071629' }}>What mentors get:</strong> Recognition on the Proplr platform, UAE AI 2031 / E33 CSR alignment, invitations to the National Showcase and partner events.
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
