import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Proplr Foundation — K-12 Program' };

export default function FoundationPage() {
  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-left" style={{ minHeight: 520 }}>
        <Image
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&q=80&auto=format"
          alt="High school students collaborating"
          fill
          className="pub-ken-burns"
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="pub-section relative z-10" style={{ paddingTop: 120, paddingBottom: 100 }}>
          <div className="max-w-2xl">
            <div className="pub-line-grow reveal mb-8" />
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6" style={{ background: 'rgba(255,203,93,0.2)', color: '#ffcb5d', border: '1px solid rgba(255,203,93,0.3)' }}>
              PROPLR FOUNDATION &middot; GRADES 8 &ndash; 12
            </span>

            <h1 className="pub-heading pub-text-shadow reveal" style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: '#ffffff', marginBottom: 20, lineHeight: 1.05 }}>
              Get career-ready while<br />
              you&apos;re still in <span style={{ color: '#ffcb5d' }}>school.</span>
            </h1>

            <p className="pub-text-shadow reveal reveal-delay-1" style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', maxWidth: 520, marginBottom: 40 }}>
              Most students graduate with zero real-world experience. Proplr students graduate with 6 KHDA certificates, a portfolio, and industry connections.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 reveal reveal-delay-2">
              <Link href="/enroll?plan=foundation" className="pub-btn-primary">Register Now</Link>
              <Link href="/start-a-club" className="pub-btn-ghost" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>Start a Club</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <section className="pub-bg-animated">
        <div className="pub-section-compact">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-6">
            {[
              { num: '8', label: 'Months' },
              { num: '6', label: 'KHDA Certificates' },
              { num: '120', label: 'Program Hours' },
              { num: '150+', label: 'Industry Mentors' },
            ].map((s) => (
              <div key={s.label} className="reveal">
                <span className="pub-stat-number" style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: '#ffffff', fontFamily: 'Montserrat, sans-serif', fontWeight: 900, display: 'block' }}>
                  {s.num}
                </span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 PILLARS ──────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 10 }}>
              6 pillars. <span className="pub-gradient-text-animated">One program.</span>
            </h2>
            <p style={{ color: '#5a5f7a', fontSize: 16 }}>20 hours per pillar &middot; KHDA-certified</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { num: '01', title: 'Leadership', desc: 'Learn to lead teams, run meetings, and make decisions under pressure.' },
              { num: '02', title: 'Entrepreneurship', desc: 'Build and pitch a real business idea with mentors who\'ve done it.' },
              { num: '03', title: 'Digital Literacy', desc: 'Go from user to creator — AI tools, data, and digital skills that actually matter.' },
              { num: '04', title: 'Communication', desc: 'Present to real audiences. Write. Persuade. Be heard.' },
              { num: '05', title: 'Personal Branding', desc: 'Build a LinkedIn, a portfolio, and a reputation — before you need one.' },
              { num: '06', title: 'Project Management', desc: 'Ship real projects on time. Skills every employer wants.' },
            ].map((p, i) => (
              <div
                key={p.title}
                className={`pub-card pub-glow-border reveal reveal-delay-${(i % 3) + 1}`}
                style={{ padding: '28px 24px', textAlign: 'center' }}
              >
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 32, color: '#3d9be9', display: 'block', marginBottom: 6 }}>
                  {p.num}
                </span>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#071629', display: 'block', marginBottom: 6 }}>
                  {p.title}
                </span>
                <span style={{ fontSize: 13, color: '#5a5f7a', lineHeight: 1.5 }}>
                  {p.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 TERMS TIMELINE ───────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629' }}>
              One year. Three acts.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { badge: 'Term 1', title: 'Explore', line: 'Discover all 6 pillars and find your strengths.' },
              { badge: 'Term 2', title: 'Apply', line: 'Tackle real industry challenges with mentors.' },
              { badge: 'Term 3', title: 'Present', line: 'Ship your portfolio and hit the national stage.' },
            ].map((t, i) => (
              <div key={t.title} className={`reveal reveal-delay-${i + 1} text-center p-8 rounded-2xl`} style={{ background: 'rgba(255,203,93,0.06)', border: '1.5px solid rgba(255,203,93,0.25)' }}>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#ffcb5d', color: '#071629' }}>
                  {t.badge}
                </span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, color: '#071629', marginBottom: 8 }}>
                  {t.title}
                </h3>
                <p style={{ color: '#5a5f7a', fontSize: 14 }}>{t.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRY EXPOSURE — IMAGE + TEXT ROW ──────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal-left">
              <div className="pub-img-card">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80&auto=format"
                  alt="Students in office mentorship session"
                  width={800}
                  height={530}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto', borderRadius: 16 }}
                />
              </div>
            </div>
            <div className="reveal-right">
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>
                INDUSTRY EXPOSURE
              </span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', color: '#071629', marginBottom: 14 }}>
                Start your career early.
              </h2>
              <p style={{ color: '#5a5f7a', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                From job shadowing to internships and global mentorship, Foundation students gain real-world experience before they leave school. Over 150 mentors across 20+ countries guide students through live industry challenges.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Job Shadowing', 'Internships', '150+ Mentors'].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(61,155,233,0.1)', color: '#3d9be9', border: '1px solid rgba(61,155,233,0.2)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pub-divider" />

      {/* ── INDUSTRY EXPOSURE CARDS ───────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Job Shadowing', desc: 'Observe professionals in real workflows.', badge: 'Years 9 &ndash; 12' },
              { title: 'Internships', desc: 'Hands-on projects during school breaks.', badge: 'Senior Years' },
              { title: 'Mentorship', desc: '150+ experts across 20+ countries.', badge: '150+ Mentors' },
            ].map((card, i) => (
              <div key={card.title} className={`pub-card pub-glow-border reveal reveal-delay-${i + 1} p-8`}>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5"
                  style={{ background: 'rgba(255,203,93,0.15)', color: '#a07800', border: '1px solid rgba(255,203,93,0.3)' }}
                  dangerouslySetInnerHTML={{ __html: card.badge }}
                />
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#071629', marginBottom: 8 }}>
                  {card.title}
                </h3>
                <p style={{ color: '#5a5f7a', fontSize: 14, lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KHDA ALIGNMENT ─────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section-compact">
          <div className="max-w-3xl mx-auto text-center reveal py-10">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['KHDA Permit #633441', 'Dubai E33 Aligned', 'UAE AI 2031', 'Rahhal Framework'].map((badge) => (
                <span key={badge} className="pub-glass px-5 py-2 rounded-full text-sm font-bold" style={{ color: '#071629' }}>
                  {badge}
                </span>
              ))}
            </div>
            <p style={{ color: '#5a5f7a', fontSize: 15 }}>
              Built for UAE&apos;s education priorities. Inspection-ready from day one.
            </p>
          </div>
        </div>
      </section>

      {/* ── NATIONAL SHOWCASE ──────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark" style={{ minHeight: 380 }}>
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80&auto=format"
          alt="Conference stage with audience"
          fill
          className="pub-ken-burns"
          style={{ objectFit: 'cover' }}
        />
        <div className="pub-section relative z-10" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="max-w-2xl mx-auto text-center reveal">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6 pub-pulse-glow" style={{ background: 'rgba(61,155,233,0.15)', color: '#3d9be9', border: '1px solid rgba(61,155,233,0.25)' }}>
              NATIONAL SHOWCASE
            </span>
            <h2 className="pub-heading pub-text-shadow" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#ffffff', marginBottom: 14 }}>
              From classroom to <span style={{ color: '#ffcb5d' }}>national stage.</span>
            </h2>
            <p className="pub-text-shadow reveal reveal-delay-1" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 32 }}>
              Cross-school teams. Company-sponsored briefs. Cash prizes. Live pitch finals.
            </p>
            <Link href="/showcase" className="pub-btn-primary reveal reveal-delay-2">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── SUMMER CAMP BANNER ────────────────────────────────────── */}
      <section className="reveal" style={{ background: 'linear-gradient(135deg, #ffcb5d 0%, #f59e0b 100%)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(7,22,41,0.6)', marginBottom: 12 }}>SUMMER 2026</div>
          <h2 className="pub-heading" style={{ fontSize: 36, color: '#071629', marginBottom: 16, lineHeight: 1.2 }}>
            Proplr Summer Camp
          </h2>
          <p style={{ fontSize: 16, color: '#071629', opacity: 0.8, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            4 weekends. 3 pillars. Real skills. Entrepreneurship, Personal Branding, and Digital Literacy - built for students who don't want to waste their summer.
          </p>
          <Link href="/summer-camp" className="pub-btn-navy">
            Learn More
          </Link>
        </div>
      </section>

      {/* ── ENROLLMENT CTA ────────────────────────────────────────── */}
      <section className="pub-pattern-grid" style={{ background: '#ffffff' }}>
        <div className="pub-section text-center reveal" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 12 }}>
            Ready to get started?
          </h2>
          <p style={{ color: '#5a5f7a', fontSize: 16, marginBottom: 36 }}>
            Everything included. No hidden fees. KHDA certified.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['6 KHDA Certificates', 'Industry Mentorship', 'Portfolio Building', 'Compass Assessment', 'Showcase Eligibility'].map((f) => (
              <span key={f} className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: '#f5f5f7', color: '#1d1d1f', border: '1px solid rgba(0,0,0,0.08)' }}>
                {f}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/enroll?plan=foundation" className="pub-btn-primary">Register for Foundation</Link>
            <Link href="/start-a-club" className="pub-btn-navy">Start a Club at My School</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
