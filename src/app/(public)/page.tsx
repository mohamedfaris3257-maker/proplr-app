'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { AnimatedHero } from '@/components/public/AnimatedHero';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { PropellerSpinner } from '@/components/ui/propeller-spinner';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { MagneticButton } from '@/components/ui/magnetic-button';

export default function HomePage() {
  const statsRef = useRef(null);
  const { scrollYProgress: statsScroll } = useScroll({
    target: statsRef,
    offset: ['start end', 'end start'],
  });
  const statsBgY = useTransform(statsScroll, [0, 1], ['-10%', '10%']);

  return (
    <div>
      {/* ── ANIMATED HERO ─────────────────────────────────────────── */}
      <AnimatedHero />

      {/* ── TRUST STRIP ───────────────────────────────────────────── */}
      <section style={{ background: '#071629', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="pub-section-compact" style={{ padding: '20px 24px' }}>
          <div className="pub-marquee-track">
            {[...Array(3)].flatMap((_, j) => [
              { label: 'KHDA Certified', color: '#ffcb5d' },
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
                  textTransform: 'uppercase',
                }}
              >
                {pill.label}
              </span>
            )))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how-it-works" className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <PropellerSpinner size={300} className="absolute -top-20 -right-20 opacity-[0.03]" speed={40} />
        <div className="pub-section">
          <ScrollFadeIn direction="up" className="text-center mb-16">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#071629', marginBottom: 14 }}>
              Not another class.{' '}
              <span className="pub-gradient-text-animated">A launchpad.</span>
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
              A co-curricular club that builds real skills through real industry exposure.
            </p>
          </ScrollFadeIn>

          {/* Feature rows */}
          {[
            {
              img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80&auto=format',
              alt: 'Industry mentorship session',
              label: 'WEEKLY SESSIONS',
              labelColor: '#3d9be9',
              title: '6 pillars. Real projects. Not worksheets.',
              desc: 'Leadership, entrepreneurship, digital literacy, communication, personal branding, and project management — delivered through challenges, not lectures.',
              tags: ['Career Panels', 'Hackathons', 'Design Sprints', 'Portfolio Building'],
              tagBg: 'rgba(61,155,233,0.08)',
              tagColor: '#3d9be9',
              reverse: false,
            },
            {
              img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format',
              alt: 'Team collaboration',
              label: 'INDUSTRY ACCESS',
              labelColor: '#ffcb5d',
              title: 'Real companies. Real mentors. Real work.',
              desc: 'Job shadowing, internship pathways, innovation challenges from real businesses, and 1-on-1 mentorship with professionals across 40+ industries.',
              tags: ['150+ Mentors', '20+ Countries', '40+ Industries'],
              tagBg: 'rgba(255,203,93,0.12)',
              tagColor: '#a07800',
              reverse: true,
            },
            {
              img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80&auto=format',
              alt: 'Student presenting on stage',
              label: 'SHOWCASE & PORTFOLIO',
              labelColor: '#071629',
              title: 'Graduate with proof, not just promises.',
              desc: '6 KHDA certificates, a verified portfolio, and a national showcase where you present real work to industry judges.',
              tags: ['6 KHDA Certs', 'Digital Portfolio', 'Live Pitch Finals'],
              tagBg: 'rgba(7,22,41,0.06)',
              tagColor: '#071629',
              reverse: false,
            },
          ].map((row, idx) => (
            <div key={idx} className={`grid md:grid-cols-2 gap-12 items-center ${idx < 2 ? 'mb-20' : ''}`}>
              <ScrollFadeIn direction="left" delay={0.1} className={row.reverse ? 'md:order-2' : ''}>
                <div className="pub-img-card overflow-hidden rounded-2xl">
                  <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }}>
                    <Image
                      src={row.img}
                      alt={row.alt}
                      width={600}
                      height={400}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </motion.div>
                </div>
              </ScrollFadeIn>
              <ScrollFadeIn direction="right" delay={0.2} className={row.reverse ? 'md:order-1' : ''}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: row.labelColor, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>
                  {row.label}
                </span>
                <h3 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                  {row.title}
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
                  {row.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {row.tags.map((t, ti) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + ti * 0.08 }}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: row.tagBg, color: row.tagColor }}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </ScrollFadeIn>
            </div>
          ))}
        </div>
      </section>

      {/* ── ANIMATED COUNTER STATS ─────────────────────────────────── */}
      <section ref={statsRef} className="relative overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: statsBgY }}>
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80&auto=format"
            alt="Students"
            fill
            style={{ objectFit: 'cover' }}
          />
        </motion.div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,22,41,0.88)', zIndex: 1 }} />
        <FloatingParticles count={15} colors={['#3d9be9', '#ffcb5d', '#ffffff']} className="z-[2]" />
        <div className="pub-section relative z-10" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { target: 8, suffix: '', label: 'Months' },
              { target: 6, suffix: '', label: 'KHDA Certificates' },
              { target: 150, suffix: '+', label: 'Industry Mentors' },
              { target: 120, suffix: 'h', label: 'Program Hours' },
            ].map((stat) => (
              <div key={stat.label}>
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  className="pub-stat-number block"
                  style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: '#ffffff', marginBottom: 4 }}
                />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO PROGRAMS ──────────────────────────────────────────── */}
      <section className="relative" style={{ background: '#f5f5f7' }}>
        <PropellerSpinner size={180} className="absolute bottom-10 right-10 opacity-[0.03]" speed={30} />
        <div className="pub-section">
          <ScrollFadeIn direction="up" className="text-center mb-14">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#071629', marginBottom: 12 }}>
              Two tracks. One ecosystem.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 17, maxWidth: 460, margin: '0 auto' }}>
              Whether you&apos;re in high school or university — we built this for you.
            </p>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80&auto=format',
                alt: 'High school students',
                badge: 'Grades 8–12',
                badgeBg: '#ffcb5d',
                badgeColor: '#071629',
                name: 'Foundation K-12',
                desc: 'After-school career club. 6 KHDA certificates. Real industry exposure before graduation.',
                tags: ['120 hours', '8 months', 'AED 400/mo'],
                tagBg: 'rgba(255,203,93,0.12)',
                tagColor: '#a07800',
                border: 'rgba(255,203,93,0.3)',
                href: '/foundation',
                btnClass: 'pub-btn-navy pub-btn-sm',
                btnText: 'Explore Foundation →',
                dir: 'left' as const,
              },
              {
                img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80&auto=format',
                alt: 'University students',
                badge: 'University & Young Adults',
                badgeBg: '#3d9be9',
                badgeColor: '#ffffff',
                name: 'Impact University',
                desc: 'Advanced acceleration for the global workforce. Industry-led, campus-delivered.',
                tags: ['Work-ready skills', 'AED 999 flat', 'Startup track'],
                tagBg: 'rgba(61,155,233,0.08)',
                tagColor: '#1a6fad',
                border: 'rgba(61,155,233,0.3)',
                href: '/impact',
                btnClass: 'pub-btn-primary pub-btn-sm',
                btnText: 'Explore Impact →',
                dir: 'right' as const,
              },
            ].map((card) => (
              <ScrollFadeIn key={card.name} direction={card.dir} delay={0.1}>
                <motion.div
                  className="pub-card p-0 overflow-hidden"
                  style={{ border: `2px solid ${card.border}` }}
                  whileHover={{ y: -8, boxShadow: '0 16px 48px rgba(7,22,41,0.15)' }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                    <motion.div className="w-full h-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }}>
                      <Image src={card.img} alt={card.alt} fill style={{ objectFit: 'cover' }} />
                    </motion.div>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(7,22,41,0.7) 100%)' }} />
                    <span className="absolute bottom-4 left-6 px-3 py-1 rounded-full text-xs font-bold" style={{ background: card.badgeBg, color: card.badgeColor }}>
                      {card.badge}
                    </span>
                  </div>
                  <div className="p-8">
                    <h3 className="pub-heading" style={{ fontSize: 26, color: '#071629', marginBottom: 10 }}>{card.name}</h3>
                    <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>{card.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {card.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: card.tagBg, color: card.tagColor }}>{tag}</span>
                      ))}
                    </div>
                    <Link href={card.href} className={card.btnClass}>{card.btnText}</Link>
                  </div>
                </motion.div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPASS TEASER ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#071629' }}>
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&auto=format"
          alt="Abstract technology"
          fill
          style={{ objectFit: 'cover', opacity: 0.15 }}
        />
        <FloatingParticles count={10} colors={['#3d9be9', '#ffcb5d']} className="z-[1]" />
        <div className="pub-section relative z-10">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <ScrollFadeIn direction="left">
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#ffcb5d', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 14 }}>COMPASS BY PROPLR</span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#ffffff', marginBottom: 16 }}>
                Not sure what you want?{' '}
                <span style={{ color: '#ffcb5d' }}>Start here.</span>
              </h2>
              <p style={{ color: '#8ca3be', fontSize: 16, lineHeight: 1.65, marginBottom: 32 }}>
                AI-powered career assessment. 30 minutes. Three career lenses. A personalized report with your top matches and clear next steps.
              </p>
              <MagneticButton>
                <Link href="/compass" className="pub-btn-primary">Try Compass →</Link>
              </MagneticButton>
            </ScrollFadeIn>
            <ScrollFadeIn direction="right" delay={0.2}>
              <div className="pub-glass p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="grid grid-cols-2 gap-6 text-center">
                  {[
                    { icon: '🤖', label: 'AI-Powered Report' },
                    { icon: '🧭', label: '3-Path Matching' },
                    { icon: '📊', label: 'Career Clusters' },
                    { icon: '⚡', label: 'Instant Results' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ scale: 1.08, y: -4 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="cursor-default"
                    >
                      <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>{item.icon}</span>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, color: '#ffffff' }}>{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE BANNER ────────────────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark relative" style={{ minHeight: 400, overflow: 'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80&auto=format"
          alt="Conference stage"
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="pub-section relative z-10 w-full text-center" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <ScrollFadeIn direction="scale">
            <motion.div
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: 'rgba(255,203,93,0.15)', color: '#ffcb5d', border: '1px solid rgba(255,203,93,0.25)' }}
              animate={{ boxShadow: ['0 0 0 0 rgba(255,203,93,0)', '0 0 20px 4px rgba(255,203,93,0.15)', '0 0 0 0 rgba(255,203,93,0)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🏆 Coming 2026
            </motion.div>
            <h2 className="pub-heading pub-text-shadow" style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: '#ffffff', marginBottom: 16 }}>
              Proplr National Showcase
            </h2>
            <p className="pub-text-shadow" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, maxWidth: 500, margin: '0 auto 32px' }}>
              Where the best student teams in the UAE compete on real industry challenges.
            </p>
            <MagneticButton>
              <Link href="/showcase" className="pub-btn-primary">Learn More →</Link>
            </MagneticButton>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ── PARENT TRUST ───────────────────────────────────────────── */}
      <section className="relative" style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <ScrollFadeIn direction="left">
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>FOR PARENTS</span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 14 }}>
                Backed by KHDA.<br />Built for Dubai students.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, marginBottom: 24 }}>
                Officially licensed (Permit #633441). Certificates are KHDA-attested. Standards set by the highest education authority in Dubai.
              </p>
              <div className="flex flex-wrap gap-3">
                {['KHDA Certified', 'Real Certificates', 'Industry Mentors'].map((b, i) => (
                  <motion.span
                    key={b}
                    className="pub-glass px-4 py-2 rounded-full text-sm font-bold"
                    style={{ color: '#071629' }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {b}
                  </motion.span>
                ))}
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn direction="right" delay={0.15}>
              <div className="pub-img-card overflow-hidden rounded-2xl">
                <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }}>
                  <Image
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80&auto=format"
                    alt="Students learning together"
                    width={600}
                    height={400}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </motion.div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ─────────────────────────────────────────── */}
      <section className="pub-pattern-grid" style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <ScrollFadeIn direction="up" className="text-center mb-12">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 8 }}>
              Straightforward pricing.
            </h2>
          </ScrollFadeIn>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            {[
              { name: 'Foundation', price: 'AED 400', unit: '/mo', note: '× 8 months = AED 3,200/year', color: '#ffcb5d', bg: 'rgba(255,203,93,0.08)', border: 'rgba(255,203,93,0.3)' },
              { name: 'Impact', price: 'AED 999', unit: '/year', note: 'University students — flat rate', color: '#3d9be9', bg: 'rgba(61,155,233,0.08)', border: 'rgba(61,155,233,0.25)' },
            ].map((plan, i) => (
              <ScrollFadeIn key={plan.name} direction="up" delay={i * 0.15}>
                <motion.div
                  className="pub-card pub-glow-border p-8 text-center"
                  style={{ background: plan.bg, border: `1.5px solid ${plan.border}` }}
                  whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(7,22,41,0.12)' }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#071629', marginBottom: 8 }}>{plan.name}</h3>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 36, color: plan.color, marginBottom: 4 }}>
                    {plan.price}<span style={{ fontSize: 18, opacity: 0.7 }}>{plan.unit}</span>
                  </p>
                  <p style={{ color: '#6e6e73', fontSize: 13 }}>{plan.note}</p>
                </motion.div>
              </ScrollFadeIn>
            ))}
          </div>
          <ScrollFadeIn direction="up" delay={0.3} className="text-center">
            <Link href="/pricing" className="pub-btn-ghost">See Full Pricing →</Link>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark relative" style={{ minHeight: 420, overflow: 'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80&auto=format"
          alt="Students working together"
          fill
          style={{ objectFit: 'cover' }}
        />
        <FloatingParticles count={8} colors={['#ffffff', '#3d9be9', '#ffcb5d']} className="z-[1]" />
        <div className="pub-section relative z-10 w-full text-center" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <ScrollFadeIn direction="up">
            <h2 className="pub-heading pub-text-shadow" style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: '#ffffff', marginBottom: 16 }}>
              Ready to future-proof your path?
            </h2>
            <p className="pub-text-shadow" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 36 }}>
              Clubs are forming now. September 2026 cohort enrolling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Link href="/register" className="pub-btn-primary" style={{ fontSize: 18, padding: '16px 40px' }}>
                  Get Started →
                </Link>
              </MagneticButton>
              <Link href="/start-a-club" style={{ color: '#3d9be9', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
                Or bring Proplr to your school →
              </Link>
            </div>
          </ScrollFadeIn>
        </div>
      </section>
    </div>
  );
}
