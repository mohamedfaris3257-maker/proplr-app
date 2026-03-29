import Link from 'next/link';
import Image from 'next/image';
import { IconAI, IconCompass, IconChart, IconZap, IconTrophy } from '@/components/icons';

export default async function HomePage() {
  return (
    <div>
      {/* ── HERO - GRADIENT BACKGROUND, NO IMAGE ────────────────────── */}
      <section
        style={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #071629 0%, #0a2540 40%, #1a3a5c 70%, #3d9be9 100%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Floating decorative elements */}
        <div style={{ position: 'absolute', top: '15%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,203,93,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(61,155,233,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '60%', right: '25%', width: 80, height: 80, borderRadius: '50%', border: '2px solid rgba(255,203,93,0.2)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(61,155,233,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(61,155,233,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '35%', left: '60%', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,203,93,0.1)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '160px 24px 120px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            {/* Eyebrow badge */}
            <div className="reveal" style={{ marginBottom: 32 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 100,
                padding: '8px 20px',
                fontSize: 11,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase' as const,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffcb5d', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
                KHDA Certified &middot; Permit #633441
              </span>
            </div>
            <h1
              className="pub-heading reveal"
              style={{
                fontSize: 'clamp(42px, 7vw, 80px)',
                color: '#ffffff',
                marginBottom: 28,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                fontWeight: 800,
              }}
            >
              Build your career<br />
              before you{' '}
              <span style={{ color: '#ffcb5d' }}>graduate.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{
              fontSize: 19,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 520,
              marginBottom: 48,
              lineHeight: 1.7,
              fontWeight: 400,
            }}>
              Real skills. Real mentors. Real certificates. Proplr turns your after-school hours into a career head start — backed by KHDA.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 reveal reveal-delay-2">
              <a
                href="/enroll"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#ffcb5d',
                  color: '#071629',
                  borderRadius: 100,
                  padding: '14px 36px',
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                Get Started →
              </a>
              <a
                href="#how-it-works"
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: 100,
                  padding: '14px 36px',
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'background 0.2s',
                }}
              >
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
              'Grades 8 - University',
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

      {/* ── HOW IT WORKS - 3 CARDS LAYOUT ──────────────────────────── */}
      <section id="how-it-works" style={{ background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(60px, 10vw, 120px) 24px' }}>
          <div className="text-center reveal" style={{ marginBottom: 64 }}>
            <span style={{
              display: 'inline-block',
              fontWeight: 700,
              fontSize: 11,
              color: '#3d9be9',
              textTransform: 'uppercase' as const,
              letterSpacing: '1.5px',
              marginBottom: 16,
            }}>
              HOW IT WORKS
            </span>
            <h2 className="pub-heading" style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: '#071629',
              marginBottom: 16,
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}>
              Not another class.{' '}
              <span style={{ color: '#3d9be9' }}>A launchpad.</span>
            </h2>
            <p style={{ color: '#6e7591', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              No lectures. No theory. Just real challenges, real mentors, and a portfolio you can actually show employers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '📋',
                gradient: 'linear-gradient(135deg, #3d9be9, #1a6fad)',
                title: '6 Pillars. Real Projects.',
                description: 'Leadership, entrepreneurship, digital literacy, communication, personal branding, and project management — delivered through challenges, not lectures.',
                tags: ['Career Panels', 'Hackathons', 'Design Sprints', 'Portfolio Building'],
                tagBg: 'rgba(61,155,233,0.08)',
                tagColor: '#3d9be9',
              },
              {
                icon: '🤝',
                gradient: 'linear-gradient(135deg, #ffcb5d, #e0a800)',
                title: 'Real Mentors. Real Work.',
                description: 'Get matched with professionals from 40+ industries. Shadow them at work. Take on real briefs from real companies.',
                tags: ['150+ Mentors', '20+ Countries', '40+ Industries'],
                tagBg: 'rgba(255,203,93,0.12)',
                tagColor: '#a07800',
              },
              {
                icon: '🏆',
                gradient: 'linear-gradient(135deg, #071629, #1a3a5c)',
                title: 'Graduate with Proof.',
                description: '6 KHDA certificates, a verified portfolio, and a national showcase where you present real work to industry judges.',
                tags: ['6 KHDA Certificates', 'Digital Portfolio', 'Live Pitch Finals'],
                tagBg: 'rgba(7,22,41,0.06)',
                tagColor: '#071629',
              },
            ].map((card, idx) => (
              <div
                key={card.title}
                className={`reveal ${idx === 0 ? '' : idx === 1 ? 'reveal-delay-1' : 'reveal-delay-2'}`}
                style={{
                  background: '#ffffff',
                  borderRadius: 24,
                  padding: 36,
                  boxShadow: '0 4px 24px rgba(7,22,41,0.06), 0 1px 4px rgba(7,22,41,0.04)',
                  border: '1px solid rgba(7,22,41,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: card.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  marginBottom: 24,
                }}>
                  {card.icon}
                </div>
                <h3 className="pub-heading" style={{
                  fontSize: 22,
                  color: '#071629',
                  marginBottom: 12,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}>
                  {card.title}
                </h3>
                <p style={{ color: '#6e7591', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                  {card.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: card.tagBg, color: card.tagColor }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO PROGRAMS ──────────────────────────────────────────── */}
      <section style={{ background: '#f8f9fc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(60px, 10vw, 120px) 24px' }}>
          <div className="text-center reveal" style={{ marginBottom: 64 }}>
            <span style={{
              display: 'inline-block',
              fontWeight: 700,
              fontSize: 11,
              color: '#ffcb5d',
              textTransform: 'uppercase' as const,
              letterSpacing: '1.5px',
              marginBottom: 16,
            }}>
              OUR PROGRAMS
            </span>
            <h2 className="pub-heading" style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: '#071629',
              marginBottom: 16,
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}>
              Two tracks. One ecosystem.
            </h2>
            <p style={{ color: '#6e7591', fontSize: 17, maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
              Whether you&apos;re in high school or university — we built this for you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Foundation Card */}
            <div className="reveal reveal-left" style={{
              background: '#ffffff',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(7,22,41,0.06), 0 1px 4px rgba(7,22,41,0.04)',
              border: '1px solid rgba(7,22,41,0.06)',
            }}>
              <div style={{
                height: 8,
                background: 'linear-gradient(90deg, #ffcb5d, #e0a800)',
              }} />
              <div style={{ padding: 36 }}>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(255,203,93,0.12)',
                  color: '#a07800',
                  borderRadius: 100,
                  padding: '6px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase' as const,
                  marginBottom: 20,
                }}>
                  Grades 8-12
                </div>
                <h3 className="pub-heading" style={{ fontSize: 28, color: '#071629', marginBottom: 12, fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Foundation K-12
                </h3>
                <p style={{ color: '#6e7591', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                  After-school career club. 6 KHDA certificates. Real industry exposure before graduation.
                </p>
                <div className="flex flex-wrap gap-2" style={{ marginBottom: 28 }}>
                  {['120 hours', '8 months', '6 KHDA Certificates'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,203,93,0.12)', color: '#a07800' }}>{tag}</span>
                  ))}
                </div>
                <Link href="/foundation" style={{
                  background: 'transparent',
                  color: '#071629',
                  border: '2px solid #071629',
                  borderRadius: 100,
                  padding: '12px 28px',
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}>
                  Explore Foundation →
                </Link>
              </div>
            </div>

            {/* Impact Card */}
            <div className="reveal reveal-right" style={{
              background: '#ffffff',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(7,22,41,0.06), 0 1px 4px rgba(7,22,41,0.04)',
              border: '1px solid rgba(7,22,41,0.06)',
            }}>
              <div style={{
                height: 8,
                background: 'linear-gradient(90deg, #3d9be9, #1a6fad)',
              }} />
              <div style={{ padding: 36 }}>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(61,155,233,0.08)',
                  color: '#1a6fad',
                  borderRadius: 100,
                  padding: '6px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase' as const,
                  marginBottom: 20,
                }}>
                  University & Young Adults
                </div>
                <h3 className="pub-heading" style={{ fontSize: 28, color: '#071629', marginBottom: 12, fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Impact University
                </h3>
                <p style={{ color: '#6e7591', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                  Advanced acceleration for the global workforce. Industry-led, campus-delivered.
                </p>
                <div className="flex flex-wrap gap-2" style={{ marginBottom: 28 }}>
                  {['Work-ready skills', 'Full Year', 'Startup track'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(61,155,233,0.08)', color: '#1a6fad' }}>{tag}</span>
                  ))}
                </div>
                <Link href="/impact" style={{
                  background: '#ffcb5d',
                  color: '#071629',
                  borderRadius: 100,
                  padding: '12px 28px',
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}>
                  Explore Impact →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPASS TEASER - DARK GRADIENT ─────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #071629 0%, #0a2540 50%, #1a3a5c 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,203,93,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 100, height: 100, borderRadius: '50%', border: '2px solid rgba(61,155,233,0.1)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(60px, 10vw, 120px) 24px', position: 'relative', zIndex: 1 }}>
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="reveal reveal-left">
              <span style={{
                display: 'inline-block',
                fontWeight: 700,
                fontSize: 11,
                color: '#ffcb5d',
                textTransform: 'uppercase' as const,
                letterSpacing: '1.5px',
                marginBottom: 16,
              }}>
                COMPASS BY PROPLR
              </span>
              <h2 className="pub-heading" style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: '#ffffff',
                marginBottom: 16,
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}>
                Not sure what you want?{' '}
                <span style={{ color: '#ffcb5d' }}>Start here.</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
                AI-powered career assessment. 30 minutes. Three career lenses. A personalized report with your top matches and clear next steps.
              </p>
              <Link href="/compass" style={{
                background: '#ffcb5d',
                color: '#071629',
                borderRadius: 100,
                padding: '14px 36px',
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-block',
              }}>
                Try Compass →
              </Link>
            </div>
            <div className="reveal reveal-right">
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24,
                padding: 36,
                backdropFilter: 'blur(12px)',
              }}>
                <div className="grid grid-cols-2 gap-8 text-center">
                  {[
                    { icon: <IconAI />, label: 'AI-Powered Report' },
                    { icon: <IconCompass />, label: '3-Path Matching' },
                    { icon: <IconChart />, label: 'Career Clusters' },
                    { icon: <IconZap />, label: 'Instant Results' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: 'linear-gradient(135deg, rgba(61,155,233,0.2), rgba(255,203,93,0.15))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        color: '#ffffff',
                      }}>
                        {item.icon}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.02em' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KHDA / PARENT TRUST - NAVY BG WITH GRADIENT CARD ───────── */}
      <section style={{ background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(60px, 10vw, 120px) 24px' }}>
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="reveal reveal-left">
              <span style={{
                display: 'inline-block',
                fontWeight: 700,
                fontSize: 11,
                color: '#3d9be9',
                textTransform: 'uppercase' as const,
                letterSpacing: '1.5px',
                marginBottom: 16,
              }}>
                FOR PARENTS
              </span>
              <h2 className="pub-heading" style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: '#071629',
                marginBottom: 16,
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}>
                Backed by KHDA.<br />Built for UAE students.
              </h2>
              <p style={{ color: '#6e7591', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
                Officially licensed (Permit #633441). Certificates are KHDA-attested. Standards set by the highest education authority in Dubai.
              </p>
              <div className="flex flex-wrap gap-3">
                {['KHDA Certified', 'Future-Proofing', 'Industry Mentors'].map((b) => (
                  <span key={b} style={{
                    background: 'rgba(7,22,41,0.04)',
                    border: '1px solid rgba(7,22,41,0.08)',
                    borderRadius: 100,
                    padding: '10px 20px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#071629',
                  }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="reveal reveal-right">
              <div style={{
                background: 'linear-gradient(135deg, #071629 0%, #0a2540 50%, #1a3a5c 100%)',
                borderRadius: 24,
                padding: 40,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Decorative glow */}
                <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,203,93,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(61,155,233,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ marginBottom: 28 }}>
                    <span style={{ fontSize: 36 }}>🏛️</span>
                  </div>
                  <h3 style={{ fontSize: 24, color: '#ffffff', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
                    KHDA Permit #633441
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                    Every certificate your child earns is officially attested by the Knowledge and Human Development Authority of Dubai.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { num: '6', label: 'Attested Certificates' },
                      { num: '120', label: 'Program Hours' },
                      { num: '8', label: 'Month Duration' },
                    ].map((s) => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontWeight: 900, fontSize: 28, color: '#ffcb5d', minWidth: 50 }}>{s.num}</span>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUMMER CAMP BANNER ────────────────────────────────────── */}
      <section className="pub-hero-image" style={{ minHeight: 380, position: 'relative', overflow: 'hidden' }}>
        <Image
          src="https://images.pexels.com/photos/8423041/pexels-photo-8423041.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Summer camp students"
          fill
          style={{ objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(7,22,41,0.8) 0%, rgba(255,160,0,0.6) 50%, rgba(245,158,11,0.7) 100%)', zIndex: 1 }} />
        <div className="relative z-10 w-full text-center reveal" style={{ padding: 'clamp(60px, 10vw, 100px) 24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: 100,
            padding: '6px 16px',
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 18 }}>&#9728;</span>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '1.5px',
              textTransform: 'uppercase' as const,
            }}>
              SUMMER 2026
            </span>
          </div>
          <h2 className="pub-heading" style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            color: '#ffffff',
            marginBottom: 16,
            lineHeight: 1.15,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            Don&apos;t waste your summer.
          </h2>
          <p style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 32,
            maxWidth: 480,
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}>
            4 weekends. 3 pillars. Entrepreneurship, Personal Branding, and Digital Literacy. Build something real while everyone else is doing nothing.
          </p>
          <Link href="/summer-camp" style={{
            background: '#ffcb5d',
            color: '#071629',
            borderRadius: 100,
            padding: '14px 36px',
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            Check It Out
          </Link>
        </div>
      </section>

      {/* ── SHOWCASE BANNER - FULL BLEED IMAGE ───────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark" style={{ minHeight: 400 }}>
        <Image
          src="https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Conference stage"
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="relative z-10 w-full text-center reveal" style={{ padding: 'clamp(60px, 10vw, 100px) 24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#ffcb5d',
            color: '#071629',
            borderRadius: 100,
            padding: '8px 20px',
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 24,
          }}>
            <IconTrophy /> Coming 2026
          </div>
          <h2 className="pub-heading pub-text-shadow" style={{
            fontSize: 'clamp(30px, 5vw, 52px)',
            color: '#ffffff',
            marginBottom: 16,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            Proplr National Showcase
          </h2>
          <p className="pub-text-shadow" style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 17,
            maxWidth: 500,
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>
            Where the best student teams in the UAE compete on real industry challenges.
          </p>
          <Link href="/showcase" style={{
            background: '#ffcb5d',
            color: '#071629',
            borderRadius: 100,
            padding: '14px 36px',
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            Learn More
          </Link>
        </div>
      </section>

      {/* ── FINAL CTA - GRADIENT BG ──────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #071629 0%, #0a2540 30%, #1a3a5c 60%, #3d9be9 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,203,93,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '8%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(61,155,233,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', right: '30%', width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(255,203,93,0.15)', pointerEvents: 'none' }} />

        <div className="text-center reveal" style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: 'clamp(80px, 12vw, 140px) 24px',
          position: 'relative',
          zIndex: 1,
        }}>
          <h2 className="pub-heading" style={{
            fontSize: 'clamp(30px, 5vw, 52px)',
            color: '#ffffff',
            marginBottom: 20,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}>
            Your peers are already building their careers. Don&apos;t wait.
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 18,
            marginBottom: 44,
            lineHeight: 1.7,
          }}>
            September 2026 cohort is forming now. Spots are limited to keep clubs small and impactful.
          </p>
          <a
            href="/enroll"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#ffcb5d',
              color: '#071629',
              borderRadius: 100,
              padding: '16px 44px',
              fontSize: 18,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Get Started →
          </a>
        </div>
      </section>
    </div>
  );
}
