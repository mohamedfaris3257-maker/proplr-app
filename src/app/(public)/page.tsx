import Link from 'next/link';
import Image from 'next/image';
import { IconAI, IconCompass, IconChart, IconZap, IconTrophy } from '@/components/icons';

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
              Build your career<br />
              before you<br />
              <span className="pub-gradient-text-animated">graduate.</span>
            </h1>
            <p className="reveal reveal-delay-1 pub-text-shadow" style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)', maxWidth: 520, marginBottom: 40, lineHeight: 1.6 }}>
              Real skills. Real mentors. Real certificates. Proplr turns your after-school hours into a career head start - backed by KHDA.
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
              'KHDA Permit #633441',
              '6 Certified Courses',
              'Grades 8 – University',
              '150+ Industry Mentors',
              'National Showcase 2026',
              'September 2026 Cohort',
            ].map((label, i) => (
              <span
                key={`${j}-${i}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 28,
                  whiteSpace: 'nowrap',
                  paddingRight: 28,
                }}
              >
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  color: i % 3 === 0 ? '#ffcb5d' : i % 3 === 1 ? '#3d9be9' : '#ffffff',
                  opacity: 0.7,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                }}>
                  {label}
                </span>
                <span style={{ color: '#ffcb5d', fontSize: 8, opacity: 0.5 }}>◆</span>
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
            <p style={{ color: '#5a5f7a', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
              No lectures. No theory. Just real challenges, real mentors, and a portfolio you can actually show employers.
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
              <p style={{ color: '#5a5f7a', fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
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
              <p style={{ color: '#5a5f7a', fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
                Get matched with professionals from 40+ industries. Shadow them at work. Take on real briefs from real companies. Walk out with experience most graduates never get.
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
              <p style={{ color: '#5a5f7a', fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
                6 KHDA certificates, a verified portfolio, and a national showcase where you present real work to industry judges.
              </p>
              <div className="flex flex-wrap gap-2">
                {['6 KHDA Certificates', 'Digital Portfolio', 'Live Pitch Finals'].map((t) => (
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
              { value: '8', label: 'Month Program' },
              { value: '6', label: 'KHDA Certificates' },
              { value: '150+', label: 'Industry Mentors' },
              { value: '120', label: 'Program Hours' },
            ].map((stat) => (
              <div key={stat.label} className="reveal">
                <span
                  className="pub-stat-number"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 56px)', color: '#ffffff', display: 'block', marginBottom: 4 }}
                >
                  {stat.value}
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
            <p style={{ color: '#5a5f7a', fontSize: 17, maxWidth: 460, margin: '0 auto' }}>
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
                <p style={{ color: '#5a5f7a', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                  After-school career club. 6 KHDA certificates. Real industry exposure before graduation.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['120 hours', '8 months', '6 KHDA Certificates'].map((tag) => (
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
                <p style={{ color: '#5a5f7a', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                  Advanced acceleration for the global workforce. Industry-led, campus-delivered.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Work-ready skills', 'Full Year', 'Startup track'].map((tag) => (
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
                    { icon: <IconAI />, label: 'AI-Powered Report' },
                    { icon: <IconCompass />, label: '3-Path Matching' },
                    { icon: <IconChart />, label: 'Career Clusters' },
                    { icon: <IconZap />, label: 'Instant Results' },
                  ].map((item) => (
                    <div key={item.label} style={{ color: '#ffffff' }}>
                      <span style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{item.icon}</span>
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
            <IconTrophy /> Coming 2026
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
                Backed by KHDA.<br />Built for UAE students.
              </h2>
              <p style={{ color: '#5a5f7a', fontSize: 16, lineHeight: 1.65, marginBottom: 24 }}>
                Officially licensed (Permit #633441). Certificates are KHDA-attested. Standards set by the highest education authority in Dubai.
              </p>
              <div className="flex flex-wrap gap-3">
                {['KHDA Certified', 'Future-Proofing', 'Industry Mentors'].map((b) => (
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
            Your peers are already building their careers. Don&apos;t wait.
          </h2>
          <p className="pub-text-shadow" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 36 }}>
            September 2026 cohort is forming now. Spots are limited to keep clubs small and impactful.
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
