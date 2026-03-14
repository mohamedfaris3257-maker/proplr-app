import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/feed');

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff', minHeight: 600 }}>
        {/* Ambient orbs */}
        <div className="pub-orb-blue" style={{ width: 600, height: 600, top: -200, left: -100 }} />
        <div className="pub-orb-yellow" style={{ width: 500, height: 500, top: -100, right: -80 }} />

        <div className="pub-section relative z-10" style={{ paddingTop: 96, paddingBottom: 80 }}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(61,155,233,0.08)', color: '#3d9be9', border: '1px solid rgba(61,155,233,0.15)' }}>
              <span>KHDA Certified · Permit #633441 · Starting September 2026</span>
            </div>
            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(40px, 7vw, 72px)', color: '#071629', marginBottom: 24 }}>
              Your future doesn&apos;t have to be<br />
              <span className="pub-gradient-text">a guessing game.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 18, color: '#6e6e73', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.65 }}>
              Proplr is the program that gets you career-ready before you graduate — through real experiences, real mentors, and real industry connections. Not more homework.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal reveal-delay-2">
              <Link href="/register" className="pub-btn-primary">
                Get Started
              </Link>
              <a href="#how-it-works" className="pub-btn-ghost">
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ──────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '24px 24px' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              '6 KHDA Certificates',
              '4 Program Tracks',
              'Grades 8–12 + University',
              'Starting September 2026',
              'National Showcase 2026',
            ].map((pill) => (
              <span key={pill} className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: '#ffffff', color: '#1d1d1f', border: '1px solid rgba(0,0,0,0.08)' }}>
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>WHAT WE DO</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 16 }}>
              It&apos;s not a class. It&apos;s a club<br />that changes what&apos;s possible.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 17, lineHeight: 1.65 }}>
              Most programs give you a certificate for sitting still. Proplr is different. We run a co-curricular club inside your school or university — three trimesters, six pillars, real industry mentors, actual challenges from real companies, and a portfolio you can actually show someone. By the time you graduate, you&apos;ll have 6 KHDA-certified completions, a career direction, and proof that you&apos;ve done the work.
            </p>
          </div>

          {/* 4 Program Tracks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📅', title: 'Weekly Sessions', desc: 'Structured weekly experiences covering all 6 pillars through career panels, challenges, hackathons, and leadership activities. Every session counts toward your portfolio.' },
              { icon: '🏭', title: 'Industry', desc: 'Real access to real companies. Job shadow days, internship opportunities, industry innovation challenges, and career discovery panels with professionals doing the work you\'re curious about.' },
              { icon: '🎯', title: 'Mentorship & Leadership', desc: 'One-on-one mentor office hours, a Student Leadership Council, alumni networking, and parent engagement events. You\'re not alone in figuring this out.' },
              { icon: '🔬', title: 'Skills Building & Assessment', desc: 'Hackathons, case competitions, industry challenges, and portfolio submissions. Your growth is tracked and recognized — not with a grade, but with outcomes.' },
            ].map((track, i) => (
              <div key={track.title} className={`pub-card reveal reveal-delay-${i + 1} p-6`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 32, marginBottom: 16, display: 'block' }}>{track.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 8 }}>{track.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO PROGRAMS ──────────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>OUR PROGRAMS</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 12 }}>
              One platform. Two tracks.<br />Built for where you are right now.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Foundation */}
            <div className="reveal pub-card p-10" style={{ border: '2px solid rgba(255,203,93,0.3)', background: 'linear-gradient(135deg, #fffdf5 0%, #ffffff 100%)' }}>
              <div className="flex items-center gap-3 mb-5">
                <span style={{ fontSize: 36 }}>🏫</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ffcb5d', color: '#071629' }}>School Students</span>
              </div>
              <h3 className="pub-heading" style={{ fontSize: 26, color: '#071629', marginBottom: 10 }}>Proplr Foundation</h3>
              <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, marginBottom: 24 }}>
                For School Students — Grades 8 to 12. Six KHDA-certified pillars delivered through an after-school club. Build your skills, meet industry mentors, and graduate with a portfolio and career direction before you even apply to university.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['6 KHDA Certificates', 'AED 400/mo', 'KHDA Aligned', 'Grades 8–12'].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,203,93,0.15)', color: '#a07800', border: '1px solid rgba(255,203,93,0.3)' }}>{tag}</span>
                ))}
              </div>
              <Link href="/foundation" className="pub-btn-navy pub-btn-sm">
                Learn More →
              </Link>
            </div>

            {/* Impact */}
            <div className="reveal reveal-delay-1 pub-card p-10" style={{ border: '2px solid rgba(61,155,233,0.3)', background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)' }}>
              <div className="flex items-center gap-3 mb-5">
                <span style={{ fontSize: 36 }}>🎓</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#3d9be9', color: '#ffffff' }}>University Students</span>
              </div>
              <h3 className="pub-heading" style={{ fontSize: 26, color: '#071629', marginBottom: 10 }}>Proplr Impact</h3>
              <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, marginBottom: 24 }}>
                For University Students. The same six pillars, raised to industry level. Real startup challenges, microplacements, demo days, and a professional network — all while you&apos;re still studying.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['6 KHDA Certificates', 'AED 999 flat', 'Industry Mentors', 'Demo Days'].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(61,155,233,0.1)', color: '#1a6fad', border: '1px solid rgba(61,155,233,0.2)' }}>{tag}</span>
                ))}
              </div>
              <Link href="/impact" className="pub-btn-primary pub-btn-sm">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STUDENT JOURNEY ───────────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>THE JOURNEY</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 12 }}>
              Here&apos;s what your year with Proplr looks like.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 17 }}>From your first session to standing on a stage — this is the path.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01', title: 'Awareness', color: '#ffcb5d',
                points: ['Compass career assessment', 'Intro assembly at your school', 'Meet the mentors', 'Pick your program track'],
              },
              {
                step: '02', title: 'Program', color: '#3d9be9',
                points: ['Weekly pillar sessions', 'Industry challenge briefs', 'Mentor office hours', 'Portfolio starts building'],
              },
              {
                step: '03', title: 'Showcase', color: '#071629',
                points: ['Present your work publicly', 'Industry judge panel', 'National competition', 'Annual awards'],
              },
              {
                step: '04', title: 'Graduation', color: '#27AE60',
                points: ['6 KHDA certificates', 'Verified portfolio', 'Job/uni readiness report', 'Alumni network access'],
              },
            ].map((stage, i) => (
              <div key={stage.title} className={`reveal reveal-delay-${i + 1}`}>
                <div className="pub-card p-6 h-full" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: stage.color }}>
                      {stage.step}
                    </span>
                    <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#071629' }}>{stage.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {stage.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm" style={{ color: '#6e6e73' }}>
                        <span style={{ color: stage.color, flexShrink: 0 }}>✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 reveal">
            <Link href="/register" className="pub-btn-primary">Start Your Journey</Link>
          </div>
        </div>
      </section>

      {/* ── COMPASS TEASER ────────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-3xl mx-auto">
            <div className="pub-card p-10 text-center reveal" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#a07800', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>COMPASS BY PROPLR</span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 16 }}>
                Not sure what you want to do? Start here.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, maxWidth: 520, margin: '0 auto 12px' }}>
                Compass is our AI-powered career assessment. In 30–45 minutes, it takes your interests, work style, and personal inputs and turns them into a personalized career report — with your top career clusters, adjacent paths you might not have considered, and actionable next steps.
              </p>
              <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 28 }}>No pressure. No commitment. Just clarity.</p>
              <Link href="/compass" className="pub-btn-navy">
                Try Compass →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE BANNER ───────────────────────────────────────── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section text-center reveal" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(255,203,93,0.15)', color: '#ffcb5d', border: '1px solid rgba(255,203,93,0.25)' }}>
            🏆 Coming 2026
          </div>
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(26px, 4vw, 42px)', marginBottom: 16 }}>
            Proplr National Showcase 2026
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 17, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.65 }}>
            Dubai&apos;s first national showcase for student entrepreneurs and career builders. Get in the program by September — and you&apos;ll be on stage in 2026.
          </p>
          <Link href="/showcase" className="pub-btn-primary">
            Learn More →
          </Link>
        </div>
      </section>

      {/* ── PARENT TRUST ──────────────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>FOR PARENTS</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: '#071629', marginBottom: 12 }}>
              Built for Dubai students. Backed by KHDA.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 17 }}>We know you have questions. Here&apos;s what matters most.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🏛️', title: 'Officially Certified',
                body: 'Proplr is a KHDA-licensed education provider operating in Dubai (Permit #633441). Our programs are approved, our certificates are attested, and our standards are held to the highest regulatory benchmark in UAE education.',
              },
              {
                icon: '📜', title: 'Real Certificates, Not Participation Trophies',
                body: 'Students complete 6 KHDA-certified pillars over the academic year. Each certificate is formally attested — recognized by universities, employers, and institutions across the UAE and beyond.',
              },
              {
                icon: '🌍', title: "Founded by People Who've Been There",
                body: "Alina and Faris both graduated and faced the gap between academic qualifications and what the real world actually needed. They built Proplr because no one built it for them. Their work in student development has been nationally recognized across the UK, Canada, and UAE.",
              },
            ].map((card, i) => (
              <div key={card.title} className={`pub-card reveal reveal-delay-${i + 1} p-8`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 16 }}>{card.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#071629', marginBottom: 10 }}>{card.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.7 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ────────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>PRICING</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#071629', marginBottom: 12 }}>
              Straightforward pricing. Real returns.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            {[
              { name: 'Foundation', price: 'AED 400/mo', note: '× 8 months = AED 3,200/year', color: '#ffcb5d', bg: 'rgba(255,203,93,0.08)', border: 'rgba(255,203,93,0.3)' },
              { name: 'Impact', price: 'AED 999', note: 'flat/year — university students', color: '#3d9be9', bg: 'rgba(61,155,233,0.08)', border: 'rgba(61,155,233,0.25)' },
            ].map((plan, i) => (
              <div key={plan.name} className={`pub-card reveal reveal-delay-${i + 1} p-8 text-center`} style={{ background: plan.bg, border: `1.5px solid ${plan.border}` }}>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#071629', marginBottom: 8 }}>{plan.name}</h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 30, color: plan.color, marginBottom: 4 }}>{plan.price}</p>
                <p style={{ color: '#6e6e73', fontSize: 13 }}>{plan.note}</p>
              </div>
            ))}
          </div>
          <div className="text-center reveal">
            <Link href="/pricing" className="pub-btn-ghost">See Full Pricing →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA BANNER ─────────────────────────────────────── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section text-center reveal" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(26px, 4vw, 42px)', marginBottom: 16 }}>
            Ready to future-proof your path before graduation?
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 17, marginBottom: 36 }}>Clubs are forming now. Program starts September 2026.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="pub-btn-primary">
              Get Started
            </Link>
            <Link href="/start-a-club" style={{ color: '#3d9be9', fontSize: 15, fontWeight: 600 }} className="hover:text-white transition-colors">
              Or bring Proplr to your school →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
