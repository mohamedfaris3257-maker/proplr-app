import Link from 'next/link';
import Image from 'next/image';

export default async function HomePage() {
  return (
    <div>
      {/* ── HERO — FULL-BLEED IMAGE ─────────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark" style={{ minHeight: '92vh' }}>
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80&auto=format"
          alt="Students collaborating"
          fill
          priority
          className="pub-ken-burns"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div className="pub-section relative z-10 w-full" style={{ paddingTop: 120, paddingBottom: 100 }}>
          <div className="max-w-4xl">
            <div className="pub-line-grow reveal mb-8" />
            <h1
              className="pub-heading pub-text-shadow reveal"
              style={{ fontSize: 'clamp(42px, 7vw, 80px)', color: '#ffffff', marginBottom: 24, lineHeight: 1.05 }}
            >
              Your future doesn&apos;t<br />
              have to be a<br />
              <span className="pub-gradient-text-animated">guessing game.</span>
            </h1>
            <p className="reveal reveal-delay-1 pub-text-shadow" style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)', maxWidth: 520, marginBottom: 40, lineHeight: 1.6 }}>
              KHDA-certified career programs with real mentors, real companies, and a portfolio that proves you&apos;re ready.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 reveal reveal-delay-2">
              <Link href="/enroll" className="pub-btn-primary" style={{ fontSize: 18, padding: '16px 40px' }}>
                Get Started →
              </Link>
              <a href="#how-it-works" className="pub-btn-ghost" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>
                See How It Works
              </a>
            </div>
          </div>
        </div>
        {/* Scroll-down indicator */}
        <a href="#how-it-works" className="pub-scroll-hint" aria-label="Scroll down">
          <span />
        </a>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────── */}
      <section style={{ background: '#071629', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="pub-section-compact" style={{ padding: '20px 24px' }}>
          <div className="pub-marquee-track">
            {[...Array(3)].flatMap((_, j) => [
              { label: 'KHDA Permit #633441', color: '#ffcb5d' },
              { label: '6 Certified Courses', color: '#3d9be9' },
              { label: 'Grades 8 – University', color: '#ffffff' },
              { label: '150+ Industry Mentors', color: '#ffcb5d' },
              { label: 'National Showcase 2026', color: '#3d9be9' },
              { label: 'September 2026 Cohort', color: '#ffffff' },
            ].map((pill, i) => (
              <span
                key={`${j}-${i}`}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  color: pill.color,
                  opacity: 0.6,
                  whiteSpace: 'nowrap',
                  padding: '0 28px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                }}
              >
                {pill.label}
              </span>
            )))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — IMAGE + TEXT ALTERNATING ──────────────────── */}
      <section id="how-it-works" style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-16 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#071629', marginBottom: 14 }}>
              Not another class.{' '}
              <span className="pub-gradient-text-animated">A launchpad.</span>
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
              A co-curricular club that builds real skills through real industry exposure.
            </p>
          </div>

          {/* Feature Row 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="reveal reveal-left">
              <div className="pub-img-card">
                <Image
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80&auto=format"
                  alt="Industry mentorship session"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
            <div className="reveal reveal-right">
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>WEEKLY SESSIONS</span>
              <h3 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                6 pillars. Real projects. Not worksheets.
              </h3>
              <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
                Leadership, entrepreneurship, digital literacy, communication, personal branding, and project management — delivered through challenges, not lectures.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Career Panels', 'Hackathons', 'Design Sprints', 'Portfolio Building'].map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(61,155,233,0.08)', color: '#3d9be9' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Row 2 — reversed */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="reveal reveal-left md:order-2">
              <div className="pub-img-card">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format"
                  alt="Team collaboration"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
            <div className="reveal reveal-right md:order-1">
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#ffcb5d', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>INDUSTRY ACCESS</span>
              <h3 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                Real companies. Real mentors. Real work.
              </h3>
              <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
                Job shadowing, internship pathways, innovation challenges from real businesses, and 1-on-1 mentorship with professionals across 40+ industries.
              </p>
              <div className="flex flex-wrap gap-2">
                {['150+ Mentors', '20+ Countries', '40+ Industries'].map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,203,93,0.12)', color: '#a07800' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Row 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal reveal-left">
              <div className="pub-img-card">
                <Image
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80&auto=format"
                  alt="Student presenting on stage"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
            <div className="reveal reveal-right">
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#071629', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>SHOWCASE & PORTFOLIO</span>
              <h3 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                Graduate with proof, not just promises.
              </h3>
              <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
                6 KHDA certificates, a verified portfolio, and a national showcase where you present real work to industry judges.
              </p>
              <div className="flex flex-wrap gap-2">
                {['6 KHDA Certs', 'Digital Portfolio', 'Live Pitch Finals'].map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(7,22,41,0.06)', color: '#071629' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTER STATS — PARALLAX BG ─────────────────────────────── */}
      <section
        className="pub-parallax-bg relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,22,41,0.88)', zIndex: 0 }} />
        <div className="pub-section relative z-10" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { target: 8, suffix: '', label: 'Months' },
              { target: 6, suffix: '', label: 'KHDA Certificates' },
              { target: 150, suffix: '+', label: 'Industry Mentors' },
              { target: 120, suffix: 'h', label: 'Program Hours' },
            ].map((stat) => (
              <div key={stat.label} className="reveal">
                <span
                  className="pub-counter pub-stat-number pub-count-pop"
                  data-target={stat.target}
                  data-suffix={stat.suffix}
                  style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: '#ffffff', display: 'block', marginBottom: 4 }}
                >
                  0
                </span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO PROGRAMS — WITH IMAGES ──────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#071629', marginBottom: 12 }}>
              Two tracks. One ecosystem.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 17, maxWidth: 460, margin: '0 auto' }}>
              Whether you&apos;re in high school or university — we built this for you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Foundation Card */}
            <div className="pub-card reveal reveal-left p-0 overflow-hidden" style={{ border: '2px solid rgba(255,203,93,0.3)' }}>
              <div style={{ position: 'relative', height: 220 }}>
                <Image
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80&auto=format"
                  alt="High school students"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(7,22,41,0.7) 100%)' }} />
                <span className="absolute bottom-4 left-6 px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ffcb5d', color: '#071629' }}>
                  Grades 8–12
                </span>
              </div>
              <div className="p-8">
                <h3 className="pub-heading" style={{ fontSize: 26, color: '#071629', marginBottom: 10 }}>Foundation K-12</h3>
                <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                  After-school career club. 6 KHDA certificates. Real industry exposure before graduation.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['120 hours', '8 months', 'AED 400/mo'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,203,93,0.12)', color: '#a07800' }}>{tag}</span>
                  ))}
                </div>
                <Link href="/foundation" className="pub-btn-navy pub-btn-sm">Explore Foundation →</Link>
              </div>
            </div>

            {/* Impact Card */}
            <div className="pub-card reveal reveal-right p-0 overflow-hidden" style={{ border: '2px solid rgba(61,155,233,0.3)' }}>
              <div style={{ position: 'relative', height: 220 }}>
                <Image
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80&auto=format"
                  alt="University students"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(7,22,41,0.7) 100%)' }} />
                <span className="absolute bottom-4 left-6 px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#3d9be9', color: '#ffffff' }}>
                  University & Young Adults
                </span>
              </div>
              <div className="p-8">
                <h3 className="pub-heading" style={{ fontSize: 26, color: '#071629', marginBottom: 10 }}>Impact University</h3>
                <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                  Advanced acceleration for the global workforce. Industry-led, campus-delivered.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Work-ready skills', 'AED 999 flat', 'Startup track'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(61,155,233,0.08)', color: '#1a6fad' }}>{tag}</span>
                  ))}
                </div>
                <Link href="/impact" className="pub-btn-primary pub-btn-sm">Explore Impact →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPASS TEASER — DARK WITH IMAGE ─────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#071629' }}>
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&auto=format"
          alt="Abstract technology"
          fill
          style={{ objectFit: 'cover', opacity: 0.15 }}
        />
        <div className="pub-section relative z-10">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="reveal reveal-left">
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#ffcb5d', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 14 }}>COMPASS BY PROPLR</span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#ffffff', marginBottom: 16 }}>
                Not sure what you want?{' '}
                <span style={{ color: '#ffcb5d' }}>Start here.</span>
              </h2>
              <p style={{ color: '#8ca3be', fontSize: 16, lineHeight: 1.65, marginBottom: 32 }}>
                AI-powered career assessment. 30 minutes. Three career lenses. A personalized report with your top matches and clear next steps.
              </p>
              <Link href="/compass" className="pub-btn-primary">
                Try Compass →
              </Link>
            </div>
            <div className="reveal reveal-right">
              <div className="pub-glass p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="grid grid-cols-2 gap-6 text-center">
                  {[
                    { icon: '🤖', label: 'AI-Powered Report' },
                    { icon: '🧭', label: '3-Path Matching' },
                    { icon: '📊', label: 'Career Clusters' },
                    { icon: '⚡', label: 'Instant Results' },
                  ].map((item) => (
                    <div key={item.label}>
                      <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{item.icon}</span>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, color: '#ffffff' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE BANNER — FULL BLEED IMAGE ───────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark" style={{ minHeight: 400 }}>
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80&auto=format"
          alt="Conference stage"
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="pub-section relative z-10 w-full text-center reveal" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(255,203,93,0.15)', color: '#ffcb5d', border: '1px solid rgba(255,203,93,0.25)' }}>
            🏆 Coming 2026
          </div>
          <h2 className="pub-heading pub-text-shadow" style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: '#ffffff', marginBottom: 16 }}>
            Proplr National Showcase
          </h2>
          <p className="pub-text-shadow" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, maxWidth: 500, margin: '0 auto 32px' }}>
            Where the best student teams in the UAE compete on real industry challenges.
          </p>
          <Link href="/showcase" className="pub-btn-primary">Learn More →</Link>
        </div>
      </section>

      {/* ── PARENT TRUST — WITH IMAGE ────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="reveal reveal-left">
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>FOR PARENTS</span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 14 }}>
                Backed by KHDA.<br />Built for Dubai students.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, marginBottom: 24 }}>
                Officially licensed (Permit #633441). Certificates are KHDA-attested. Standards set by the highest education authority in Dubai.
              </p>
              <div className="flex flex-wrap gap-3">
                {['KHDA Certified', 'Real Certificates', 'Industry Mentors'].map((b) => (
                  <span key={b} className="pub-glass px-4 py-2 rounded-full text-sm font-bold" style={{ color: '#071629' }}>{b}</span>
                ))}
              </div>
            </div>
            <div className="reveal reveal-right">
              <div className="pub-img-card">
                <Image
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80&auto=format"
                  alt="Students learning together"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ──────────────────────────────────────────── */}
      <section className="pub-pattern-grid" style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 8 }}>
              Straightforward pricing.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            {[
              { name: 'Foundation', price: 'AED 400', unit: '/mo', note: '× 8 months = AED 3,200/year', color: '#ffcb5d', bg: 'rgba(255,203,93,0.08)', border: 'rgba(255,203,93,0.3)' },
              { name: 'Impact', price: 'AED 999', unit: '/year', note: 'University students — flat rate', color: '#3d9be9', bg: 'rgba(61,155,233,0.08)', border: 'rgba(61,155,233,0.25)' },
            ].map((plan, i) => (
              <div key={plan.name} className={`pub-card pub-glow-border reveal reveal-delay-${i + 1} p-8 text-center`} style={{ background: plan.bg, border: `1.5px solid ${plan.border}` }}>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#071629', marginBottom: 8 }}>{plan.name}</h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 36, color: plan.color, marginBottom: 4 }}>
                  {plan.price}<span style={{ fontSize: 18, opacity: 0.7 }}>{plan.unit}</span>
                </p>
                <p style={{ color: '#6e6e73', fontSize: 13 }}>{plan.note}</p>
              </div>
            ))}
          </div>
          <div className="text-center reveal">
            <Link href="/pricing" className="pub-btn-ghost">See Full Pricing →</Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA — FULL BLEED ──────────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark" style={{ minHeight: 420 }}>
        <Image
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80&auto=format"
          alt="Students working together"
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="pub-section relative z-10 w-full text-center reveal" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <h2 className="pub-heading pub-text-shadow" style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: '#ffffff', marginBottom: 16 }}>
            Ready to future-proof your path?
          </h2>
          <p className="pub-text-shadow" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 36 }}>
            Clubs are forming now. September 2026 cohort enrolling.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/enroll" className="pub-btn-primary" style={{ fontSize: 18, padding: '16px 40px' }}>
              Get Started →
            </Link>
            <Link href="/start-a-club" style={{ color: '#3d9be9', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              Or bring Proplr to your school →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
