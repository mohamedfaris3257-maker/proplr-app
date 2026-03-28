import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Proplr Foundation - K-12 Program' };

export default function FoundationPage() {
  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-left" style={{ minHeight: 520 }}>
        <Image
          src="https://images.pexels.com/photos/32165215/pexels-photo-32165215.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
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
              PROPLR FOUNDATION &middot; GRADES 8 - 12
            </span>

            <h1 className="pub-heading pub-text-shadow reveal" style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: '#ffffff', marginBottom: 20, lineHeight: 1.05 }}>
              Get career-ready while you&apos;re still in <span style={{ color: '#ffcb5d' }}>school.</span>
            </h1>

            <p className="pub-text-shadow reveal reveal-delay-1" style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', maxWidth: 520, marginBottom: 40 }}>
              You don&apos;t know what you want to do after school - and that&apos;s okay. Proplr helps you figure it out through real experiences, real mentors, and a career assessment that actually makes sense.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 reveal reveal-delay-2">
              <a href="/enroll?plan=foundation" target="_blank" rel="noopener noreferrer" className="pub-btn-primary">Register Now</a>
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

      {/* ── THE PROBLEM ──────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="max-w-3xl mx-auto text-center reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', color: '#071629', marginBottom: 16 }}>
              School teaches you subjects.<br />
              <span className="pub-gradient-text-animated">Nobody teaches you what to do with them.</span>
            </h2>
            <p style={{ color: '#5a5f7a', fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 32px' }}>
              Most students pick a university or career path based on guesswork. Proplr gives you real experiences across 6 industries so you can make an informed choice - not a panicked one.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Confused about careers?', 'No real-world experience?', 'Blank CV?', 'Picking a major blindly?'].map(tag => (
                <span key={tag} className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPASS TEASER ──────────────────────────────── */}
      <section style={{ background: '#071629', padding: '64px 24px' }}>
        <div className="max-w-3xl mx-auto text-center reveal">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(61,155,233,0.15)', color: '#3d9be9', border: '1px solid rgba(61,155,233,0.25)' }}>
            COMPASS AI ASSESSMENT
          </span>
          <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: '#ffffff', marginBottom: 12 }}>
            It starts with knowing yourself.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 28px' }}>
            Every Foundation student takes the Compass Career Assessment - an AI-powered report that maps your strengths, interests, and career paths. It&apos;s your north star for the rest of the program.
          </p>
          <Link href="/compass" className="pub-btn-primary pub-btn-sm">Learn About Compass</Link>
        </div>
      </section>

      {/* ── 6 PILLARS ──────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 10 }}>
              6 Pillars. <span className="pub-gradient-text-animated">One program.</span>
            </h2>
            <p style={{ color: '#5a5f7a', fontSize: 16 }}>20 hours per pillar &middot; KHDA-certified</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { num: '01', title: 'Leadership', desc: 'Learn to lead teams, run meetings, and make decisions under pressure.' },
              { num: '02', title: 'Entrepreneurship', desc: 'Build and pitch a real business idea with mentors who\'ve done it.' },
              { num: '03', title: 'Digital Literacy', desc: 'Go from user to creator - AI tools, data, and digital skills that actually matter.' },
              { num: '04', title: 'Communication', desc: 'Present to real audiences. Write. Persuade. Be heard.' },
              { num: '05', title: 'Personal Branding', desc: 'Build a LinkedIn, a portfolio, and a reputation - before you need one.' },
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

      {/* ── INDUSTRY EXPOSURE - IMAGE + TEXT ROW ──────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal reveal-left">
              <div className="pub-img-card">
                <Image
                  src="https://images.pexels.com/photos/8419521/pexels-photo-8419521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Students in office mentorship session"
                  width={800}
                  height={530}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto', borderRadius: 16 }}
                />
              </div>
            </div>
            <div className="reveal reveal-right">
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

      {/* ── SUMMER CAMP BANNER ────────────────────────────────────── */}
      <section className="reveal" style={{ position: 'relative', overflow: 'hidden', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffcb5d 0%, #f59e0b 50%, #ff8c00 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(7,22,41,0.1)', borderRadius: 100, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ fontSize: 18 }}>&#9728;</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#071629', letterSpacing: 1.5 }}>SUMMER 2026</span>
          </div>
          <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#071629', marginBottom: 14, lineHeight: 1.15 }}>
            Don&apos;t waste your summer.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(7,22,41,0.75)', marginBottom: 28, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.6 }}>
            4 weekends. 3 pillars. Entrepreneurship, Personal Branding, and Digital Literacy. Build something real while everyone else is doing nothing.
          </p>
          <Link href="/summer-camp" style={{ background: '#071629', color: '#fff', borderRadius: 100, padding: '14px 32px', fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: 'inherit', display: 'inline-block' }}>
            Check It Out
          </Link>
        </div>
      </section>

      {/* ── NATIONAL SHOWCASE ──────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark" style={{ minHeight: 380 }}>
        <Image
          src="https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
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
            <a href="/enroll?plan=foundation" target="_blank" rel="noopener noreferrer" className="pub-btn-primary">Register for Foundation</a>
            <Link href="/start-a-club" className="pub-btn-navy">Start a Club at My School</Link>
          </div>

          <div className="mt-10">
            <p style={{ fontSize: 13, color: '#5a5f7a', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>Follow us</p>
            <div className="flex justify-center gap-4">
              <a href="https://www.instagram.com/proplrae/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: '#071629', transition: 'background 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="#3d9be9" strokeWidth="2" />
                  <circle cx="12" cy="12" r="5" stroke="#3d9be9" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="#3d9be9" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/proplrae/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: '#071629', transition: 'background 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" stroke="#3d9be9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="2" y="9" width="4" height="12" stroke="#3d9be9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="4" cy="4" r="2" stroke="#3d9be9" strokeWidth="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
