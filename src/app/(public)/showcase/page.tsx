import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ShowcaseRegisterForm } from '@/components/public/ShowcaseRegisterForm';

export const metadata: Metadata = { title: 'Proplr National Showcase 2026' };

export default function ShowcasePage() {
  return (
    <div>
      {/* ── HERO - FULL SCREEN EVENT INTRO ── */}
      <section className="pub-hero-image" style={{ minHeight: '100vh' }}>
        <Image
          src="https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Conference stage with audience"
          fill
          priority
          className="pub-ken-burns"
          style={{ objectFit: 'cover', opacity: 0.4 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #071629 0%, rgba(7,22,41,0.85) 50%, #071629 100%)', zIndex: 1 }} />
        <div className="pub-section relative z-10 text-center" style={{ paddingTop: 120, paddingBottom: 80 }}>
          <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,203,93,0.12)', border: '1px solid rgba(255,203,93,0.3)', borderRadius: 100, padding: '8px 20px', marginBottom: 28 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffcb5d', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#ffcb5d', letterSpacing: 2, textTransform: 'uppercase' as const }}>Registration Open</span>
          </div>
          <h1 className="pub-heading pub-text-shadow text-white reveal" style={{ fontSize: 'clamp(40px, 7vw, 80px)', marginBottom: 20, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            The National<br />
            <span className="pub-gradient-text-animated">Showcase 2026</span>
          </h1>
          <p className="reveal reveal-delay-1 pub-text-shadow" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.8)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            The biggest student competition in the UAE. Present real work.
            Compete in live challenges. Get judged by industry leaders.
          </p>

          {/* Event details pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 reveal reveal-delay-2" style={{ marginBottom: 40 }}>
            {[
              { icon: '📅', text: 'June 2026' },
              { icon: '📍', text: 'Dubai, UAE' },
              { icon: '🏆', text: '6 Competition Categories' },
              { icon: '👥', text: 'Open to All Schools' },
            ].map((pill) => (
              <span key={pill.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, padding: '10px 20px', color: '#fff', fontSize: 14, fontWeight: 500 }}>
                <span>{pill.icon}</span> {pill.text}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 reveal reveal-delay-2">
            <a href="#register-showcase" style={{ background: '#ffcb5d', color: '#071629', borderRadius: 100, padding: '16px 40px', fontSize: 16, fontWeight: 700, textDecoration: 'none', fontFamily: 'inherit', display: 'inline-block', transition: 'all 0.2s' }}>
              Register Now
            </a>
            <a href="#what-happens" style={{ background: 'transparent', color: '#fff', borderRadius: 100, padding: '16px 40px', fontSize: 16, fontWeight: 600, textDecoration: 'none', fontFamily: 'inherit', display: 'inline-block', border: '2px solid rgba(255,255,255,0.25)', transition: 'all 0.2s' }}>
              Learn More
            </a>
          </div>

          {/* Scroll indicator */}
          <div style={{ marginTop: 60, opacity: 0.5 }}>
            <div style={{ width: 24, height: 40, border: '2px solid rgba(255,255,255,0.4)', borderRadius: 100, margin: '0 auto', position: 'relative' }}>
              <div style={{ width: 4, height: 8, background: '#ffcb5d', borderRadius: 100, position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', animation: 'scrollDown 2s infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN / STATS STRIP ── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section-compact">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: '6', label: 'Competition Pillars', color: '#ffcb5d' },
              { value: '150+', label: 'Industry Mentors', color: '#3d9be9' },
              { value: '10+', label: 'Schools Expected', color: '#ffcb5d' },
              { value: '1', label: 'National Stage', color: '#3d9be9' },
            ].map((stat) => (
              <div key={stat.label} className="reveal">
                <p style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontFamily: 'Montserrat, sans-serif', fontWeight: 900, color: stat.color, lineHeight: 1, marginBottom: 6 }}>{stat.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1.5 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCROLLYTELLING: WHAT HAPPENS ── */}
      <section id="what-happens" style={{ background: '#ffffff' }}>
        <div className="pub-section" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="text-center reveal" style={{ marginBottom: 64 }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#3d9be9', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 12 }}>THE EXPERIENCE</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#071629', letterSpacing: '-0.02em' }}>
              Not just an event. An experience.
            </h2>
          </div>

          {/* Alternating image+text blocks */}
          {[
            {
              title: 'Present Real Work',
              desc: 'Students don\'t just show slides. They present real projects they\'ve built over 8 months - business plans, marketing campaigns, app prototypes, and social impact initiatives. This is their portfolio, live on stage.',
              image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              alt: 'Students presenting on stage',
              tags: ['Live Pitch', 'Real Projects', 'Portfolio Defense'],
              reverse: false,
            },
            {
              title: 'Compete in Live Challenges',
              desc: 'Teams go head-to-head on real company briefs. Think hackathon meets Dragons\' Den. Industry judges score on creativity, feasibility, and presentation. No textbook answers - just real thinking under pressure.',
              image: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              alt: 'Students competing in teams',
              tags: ['Live Briefs', 'Team Competition', 'Industry Judging'],
              reverse: true,
            },
            {
              title: 'Get Judged by Professionals',
              desc: 'Not teachers. Not parents. Real industry professionals from 40+ sectors across the UAE. They\'ve built companies, led teams, and hired graduates. Their feedback is what matters.',
              image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              alt: 'Industry judges evaluating',
              tags: ['150+ Mentors', '40+ Industries', 'Real Feedback'],
              reverse: false,
            },
            {
              title: 'Win Awards and Recognition',
              desc: 'Leadership. Innovation. Impact. Community. The best student teams walk away with trophies, certificates, and something even better - proof. Proof that they can compete, create, and deliver at a professional level.',
              image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              alt: 'Award ceremony celebration',
              tags: ['4 Award Categories', 'KHDA Certificates', 'National Recognition'],
              reverse: true,
            },
          ].map((block, i) => (
            <div
              key={block.title}
              className="reveal"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
                gap: 48,
                alignItems: 'center',
                marginBottom: i < 3 ? 80 : 0,
                direction: block.reverse ? 'rtl' : 'ltr',
              }}
            >
              <div style={{ direction: 'ltr' }}>
                <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '4/3' }}>
                  <Image
                    src={block.image}
                    alt={block.alt}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(7,22,41,0.15) 0%, rgba(61,155,233,0.1) 100%)' }} />
                </div>
              </div>
              <div style={{ direction: 'ltr' }}>
                <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#ffcb5d', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 12 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {block.title}
                </h3>
                <p style={{ color: '#6e7591', fontSize: 16, lineHeight: 1.75, marginBottom: 20 }}>
                  {block.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {block.tags.map((tag) => (
                    <span key={tag} style={{ background: '#f0f2f8', color: '#071629', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 100 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPETITION CATEGORIES ── */}
      <section style={{ background: '#f8f9fc' }}>
        <div className="pub-section" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="text-center reveal" style={{ marginBottom: 48 }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#3d9be9', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 12 }}>COMPETITION PILLARS</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629', letterSpacing: '-0.02em', marginBottom: 12 }}>
              6 pillars. 6 chances to win.
            </h2>
            <p style={{ color: '#6e7591', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Each pillar has its own competition track. Students compete in the categories they&apos;ve mastered.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🎯', title: 'Leadership', desc: 'Lead a team through a live crisis simulation. Judges assess decision-making, communication, and composure.', color: '#071629' },
              { icon: '🚀', title: 'Entrepreneurship', desc: 'Pitch a startup idea with a business model. 5 minutes. 3 judges. One winner.', color: '#3d9be9' },
              { icon: '💻', title: 'Digital Literacy', desc: 'Build a digital solution to a real problem. Could be a website, app prototype, or automation.', color: '#071629' },
              { icon: '🎤', title: 'Communication', desc: 'Deliver a keynote on a topic you care about. TED-talk style. Scored on clarity, structure, and impact.', color: '#3d9be9' },
              { icon: '✨', title: 'Personal Branding', desc: 'Present your personal brand portfolio. LinkedIn, website, content strategy - the whole package.', color: '#071629' },
              { icon: '📋', title: 'Project Management', desc: 'Run a live project sprint. Plan, delegate, execute, and deliver in a timed challenge.', color: '#3d9be9' },
            ].map((cat, i) => (
              <div key={cat.title} className={`reveal reveal-delay-${(i % 3) + 1}`} style={{
                background: '#fff',
                borderRadius: 20,
                padding: 28,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease',
              }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${cat.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 17, color: '#071629', marginBottom: 8 }}>{cat.title}</h3>
                <p style={{ color: '#6e7591', fontSize: 14, lineHeight: 1.65 }}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL BLEED IMAGE BREAK ── */}
      <section className="pub-hero-image" style={{ minHeight: 400 }}>
        <Image
          src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Students celebrating on stage"
          fill
          style={{ objectFit: 'cover', opacity: 0.5 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #071629 0%, rgba(61,155,233,0.4) 100%)', zIndex: 1 }} />
        <div className="pub-section relative z-10 text-center reveal" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <h2 className="pub-heading pub-text-shadow text-white" style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 16 }}>
            &ldquo;The moment my daughter walked off that stage,<br />I knew this was different.&rdquo;
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 500 }}>- Parent, Dubai Cohort 2025</p>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="text-center reveal" style={{ marginBottom: 48 }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#ffcb5d', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 12 }}>WHO IT&apos;S FOR</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629', letterSpacing: '-0.02em' }}>
              Everyone has a reason to be there.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: 'Students',
                color: '#3d9be9',
                image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600',
                points: ['Public proof of what you built', 'Industry recognition for your portfolio', 'Network with professionals and peers', 'CV anchor for future applications'],
              },
              {
                label: 'Schools',
                color: '#ffcb5d',
                image: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600',
                points: ['External validation of outcomes', 'Parent satisfaction and pride', 'KHDA inspection evidence', 'Recruitment for next cohort'],
              },
              {
                label: 'Parents',
                color: '#071629',
                image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600',
                points: ['See exactly what the program produced', 'Industry-judged, not school-graded', 'Tangible outcomes before committing further', 'Your child on stage - literally'],
              },
            ].map((section, i) => (
              <div key={section.label} className={`reveal reveal-delay-${i + 1}`} style={{
                background: '#fff',
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}>
                <div style={{ position: 'relative', height: 180 }}>
                  <Image
                    src={section.image}
                    alt={section.label}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${section.color}cc 100%)` }} />
                  <div style={{ position: 'absolute', bottom: 16, left: 20 }}>
                    <span style={{ background: '#fff', color: '#071629', fontSize: 13, fontWeight: 700, padding: '6px 16px', borderRadius: 100 }}>
                      {section.label}
                    </span>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {section.points.map((p) => (
                      <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#3a3f54', lineHeight: 1.5 }}>
                        <span style={{ color: section.color, flexShrink: 0, fontWeight: 700, fontSize: 16 }}>&#10003;</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section" style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="text-center reveal" style={{ marginBottom: 48 }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#ffcb5d', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 12 }}>THE JOURNEY</span>
            <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(26px, 4vw, 42px)', letterSpacing: '-0.02em' }}>
              From enrollment to the stage.
            </h2>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'rgba(255,203,93,0.2)' }} />

            {[
              { month: 'Sep 2025', title: 'Enrollment Opens', desc: 'Schools sign up students for Foundation or Impact.' },
              { month: 'Oct-Dec', title: 'Term 1: Explore', desc: 'Discover all 6 pillars. Find your strengths. Build your foundation.' },
              { month: 'Jan-Mar', title: 'Term 2: Apply', desc: 'Tackle real industry challenges with your mentor. Build your portfolio.' },
              { month: 'Apr-May', title: 'Term 3: Present', desc: 'Ship your final project. Prepare your pitch. Get stage-ready.' },
              { month: 'Jun 2026', title: 'National Showcase', desc: 'Take the stage. Compete. Win. Graduate with proof.' },
            ].map((step, i) => (
              <div key={step.month} className={`reveal reveal-delay-${Math.min(i + 1, 3)}`} style={{
                display: 'flex', gap: 24, marginBottom: i < 4 ? 40 : 0, position: 'relative',
              }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: i === 4 ? '#ffcb5d' : 'rgba(255,203,93,0.15)', border: `2px solid ${i === 4 ? '#ffcb5d' : 'rgba(255,203,93,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: i === 4 ? '#071629' : '#ffcb5d' }}>{i + 1}</span>
                </div>
                <div style={{ paddingTop: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#3d9be9', letterSpacing: 1, textTransform: 'uppercase' as const }}>{step.month}</span>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 4, marginTop: 4 }}>{step.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER WITH IMAGE ── */}
      <section className="pub-hero-image" style={{ minHeight: 420 }}>
        <Image
          src="https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Students celebrating"
          fill
          style={{ objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #071629 0%, rgba(7,22,41,0.9) 100%)', zIndex: 1 }} />
        <div className="pub-section relative z-10 text-center reveal" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <h2 className="pub-heading text-white pub-text-shadow" style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 16, letterSpacing: '-0.02em' }}>
            Don&apos;t let your students<br />miss their moment.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Get your students in by September 2025 and they&apos;ll be on stage by June 2026.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="#register-showcase" style={{ background: '#ffcb5d', color: '#071629', borderRadius: 100, padding: '16px 40px', fontSize: 16, fontWeight: 700, textDecoration: 'none', fontFamily: 'inherit', display: 'inline-block' }}>
              Register Your School
            </a>
            <Link href="/enroll" target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: '#fff', borderRadius: 100, padding: '16px 40px', fontSize: 16, fontWeight: 600, textDecoration: 'none', fontFamily: 'inherit', display: 'inline-block', border: '2px solid rgba(255,255,255,0.25)' }}>
              Enroll a Student
            </Link>
          </div>
        </div>
      </section>

      {/* ── REGISTRATION FORM ── */}
      <section id="register-showcase" style={{ background: '#f8f9fc' }}>
        <div className="pub-section" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 48, alignItems: 'start' }}>
            {/* Left: Info */}
            <div className="reveal">
              <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#3d9be9', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 12 }}>REGISTER</span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 3vw, 38px)', color: '#071629', marginBottom: 16, letterSpacing: '-0.02em' }}>
                Secure your spot.
              </h2>
              <p style={{ color: '#6e7591', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
                Register your school or students and we&apos;ll follow up with full details, timelines, and onboarding.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '✓', text: 'No commitment yet - just register interest' },
                  { icon: '✓', text: 'We contact you within 48 hours' },
                  { icon: '✓', text: 'Early bird pricing for first 10 schools' },
                  { icon: '✓', text: 'Flexible group packages available' },
                ].map((item) => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(61,155,233,0.1)', color: '#3d9be9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ color: '#3a3f54', fontSize: 14, fontWeight: 500 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="reveal reveal-delay-1" style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <ShowcaseRegisterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Scroll animation keyframe */}
      <style>{`
        @keyframes scrollDown {
          0%, 100% { opacity: 0; transform: translateX(-50%) translateY(0); }
          50% { opacity: 1; transform: translateX(-50%) translateY(12px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
