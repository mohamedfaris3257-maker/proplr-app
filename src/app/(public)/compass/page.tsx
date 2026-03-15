import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Compass — AI Career Assessment by Proplr' };

export default function CompassPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#071629', minHeight: 520 }}>
        <div style={{ position: 'absolute', width: 600, height: 600, top: -200, right: -100, background: '#3d9be9', opacity: 0.06, filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, bottom: -150, left: -100, background: '#ffcb5d', opacity: 0.06, filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="pub-section relative z-10 text-center" style={{ paddingTop: 96, paddingBottom: 80 }}>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.08)', color: '#8ca3be', border: '1px solid rgba(255,255,255,0.1)' }}>
            A Proplr Product · Available Now
          </div>
          <h1 className="pub-heading text-white reveal" style={{ fontSize: 'clamp(36px, 6vw, 68px)', marginBottom: 20 }}>
            Know your direction.<br />
            <span style={{ background: 'linear-gradient(135deg, #3d9be9 0%, #ffcb5d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Before you have to choose.
            </span>
          </h1>
          <p className="reveal reveal-delay-1" style={{ fontSize: 18, color: '#8ca3be', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Compass is an AI-powered career assessment that turns your interests, work style, and personal inputs into a personalized career report in 30–45 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal reveal-delay-2">
            <a href="https://compass.proplr.ae" target="_blank" rel="noreferrer" className="pub-btn-primary">
              Take the Assessment →
            </a>
            <a href="#what-you-get" className="pub-btn-ghost" style={{ color: '#8ca3be', borderColor: 'rgba(255,255,255,0.2)' }}>
              See What You Get
            </a>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: '#071629', marginBottom: 10 }}>
              Compass is for anyone who wants clarity.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '🎒', label: 'Students', sub: 'Grade 8 and up', desc: "You're being asked to make decisions about your future before you've had a chance to explore it. Compass gives you a map — not someone else's, yours." },
              { icon: '👨‍👩‍👧', label: 'Parents', sub: 'Support your child', desc: "Want to support your child's career exploration with something more than a guess? Compass gives you a shared language and a concrete starting point." },
              { icon: '🏫', label: 'Schools', sub: 'Bulk cohort pilots', desc: 'Run Compass with a whole cohort and get group-level insights. Free pilot available for Grades 8–10. See how your students are thinking about their futures.' },
            ].map((card, i) => (
              <div key={card.label} className={`pub-card reveal reveal-delay-${i + 1} p-8 text-center`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 40, display: 'block', marginBottom: 14 }}>{card.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#071629', marginBottom: 4 }}>{card.label}</h3>
                <p style={{ color: '#3d9be9', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{card.sub}</p>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-PATH MODEL ─────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>HOW IT WORKS</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: '#071629', marginBottom: 10 }}>
              Three lenses. One complete picture.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>Most career tests give you one answer based on one method. Compass uses three — and shows you how they compare.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { num: '01', title: 'Pure Interests (Data-Backed)', color: '#ffcb5d', desc: 'Based on your responses to a structured interest inventory, mapped against real career data. What are you genuinely drawn to? The data shows patterns you might not see yourself.' },
              { num: '02', title: 'Work-Style & Inputs (Data-Backed)', color: '#3d9be9', desc: 'How do you prefer to work? Alone or in teams? Structured or open-ended? Your work style shapes which careers will actually suit you — not just interest you.' },
              { num: '03', title: 'Blended (AI-Powered)', color: '#071629', desc: 'Our AI engine takes both datasets, adds your personal inputs (hobbies, projects, preferences, grades), and generates a blended result that reflects your whole picture.' },
            ].map((path, i) => (
              <div key={path.title} className={`pub-card reveal reveal-delay-${i + 1} p-8`} style={{ border: `2px solid ${path.color}30` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mb-4" style={{ background: path.color }}>
                  {path.num}
                </div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17, color: '#071629', marginBottom: 10 }}>{path.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{path.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ─────────────────────────────────── */}
      <section id="what-you-get" style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: '#071629', marginBottom: 10 }}>
              Everything in your Compass report.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🧭', title: '3-Path Match Results', desc: 'Three distinct career paths based on three different methodologies — so you can see where they align and where they diverge.' },
              { icon: '🤖', title: 'AI-Powered Insights', desc: 'Your results are converted into personalized insights by our AI engine, supported by research and safety guardrails unique to each student.' },
              { icon: '🔗', title: 'Career Cluster View', desc: 'Your results are grouped into meaningful skill clusters so your choices feel coherent — not random.' },
              { icon: '🔀', title: 'Adjacent & Alternative Paths', desc: 'Compass shows you nearby roles you can reach from where you are — widening your options based on your grades, finances, and personal factors.' },
              { icon: '✏️', title: 'Your Personal Inputs Matter', desc: 'Compass factors in your hobbies, projects, and preferences so the results reflect your actual reality — not a generic student profile.' },
              { icon: '📊', title: 'Instant Report + Group Analytics', desc: 'A detailed, readable report with prompts for the student, parent, and educator. Schools get aggregated cohort insights.' },
            ].map((item, i) => (
              <div key={item.title} className={`pub-card reveal reveal-delay-${(i % 3) + 1} p-7`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 14 }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT COMPARES ──────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: '#071629', marginBottom: 10 }}>
              Why Compass is different.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>Most career assessments give you a list. Compass gives you a map.</p>
          </div>
          <div className="overflow-x-auto reveal">
            <table className="w-full text-sm max-w-3xl mx-auto" style={{ borderCollapse: 'separate', borderSpacing: 0, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#071629' }}>
                  <th className="px-6 py-4 text-left text-white font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Generic Tests</th>
                  <th className="px-6 py-4 text-center font-semibold" style={{ color: '#ffcb5d' }}>Compass</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Multiple methodologies', '\u2715', '\u2713'],
                  ['AI-powered blending', '\u2715', '\u2713'],
                  ['Personal inputs (hobbies, grades)', '\u2715', '\u2713'],
                  ['Adjacent career paths', '\u2715', '\u2713'],
                  ['Group analytics for schools', '\u2715', '\u2713'],
                  ['UAE context-aware', '\u2715', '\u2713'],
                  ['Takes under 45 minutes', '~', '\u2713'],
                ].map(([feature, generic, compass], i) => (
                  <tr key={feature} style={{ background: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                    <td className="px-6 py-3.5 font-medium" style={{ color: '#071629', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{feature}</td>
                    <td className="px-6 py-3.5 text-center" style={{ color: generic === '\u2715' ? '#d1d5db' : '#6e6e73', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 18 }}>{generic}</td>
                    <td className="px-6 py-3.5 text-center" style={{ color: '#3d9be9', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 18, fontWeight: 700 }}>{compass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── COMPASS FOR SCHOOLS ──────────────────────────── */}
      <section style={{ background: 'rgba(61,155,233,0.04)', borderTop: '1px solid rgba(61,155,233,0.1)', borderBottom: '1px solid rgba(61,155,233,0.1)' }}>
        <div className="pub-section">
          <div className="max-w-3xl mx-auto text-center reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#a07800', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>FREE PILOT FOR SCHOOLS</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629', marginBottom: 14 }}>
              See what your students are thinking about their futures.
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, lineHeight: 1.65, marginBottom: 24, maxWidth: 560, margin: '0 auto 24px' }}>
              We offer a free Compass pilot for a sample cohort of Grades 8, 9, and 10 — no commitment, no contract. Run the assessment with a group of students, receive their individual reports, and get school-level insights you can actually use.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8 text-left">
              {[
                'Compass assessments for a sample cohort',
                'Individual student reports',
                'Group analytics for your counselling team',
                'A debrief session with the Proplr team',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm" style={{ color: '#6e6e73' }}>
                  <span style={{ color: '#3d9be9', flexShrink: 0 }}>✓</span> {item}
                </div>
              ))}
            </div>
            <a href="mailto:hello@proplr.ae?subject=Free%20Compass%20Pilot%20Request" className="pub-btn-primary">
              Book Your Free School Pilot →
            </a>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: '#071629', marginBottom: 10 }}>
              Compass Pricing
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Individual Student', price: 'Price TBD', note: 'Single report, instant delivery', cta: 'Coming Soon', href: '#', primary: false },
              { label: 'Free School Pilot', price: 'Free', note: 'Grades 8–10 sample cohort, no commitment', cta: 'Book a Free Pilot', href: '/start-a-club', primary: true },
              { label: 'Bulk School Pricing', price: 'Contact Us', note: 'Whole school or year group pricing', cta: 'Get in Touch', href: 'mailto:hello@proplr.ae', primary: false },
            ].map((tier, i) => (
              <div key={tier.label} className={`pub-card reveal reveal-delay-${i + 1} p-8 text-center`} style={{ border: tier.primary ? '2px solid #3d9be9' : '1px solid rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 17, color: '#071629', marginBottom: 8 }}>{tier.label}</h3>
                <p className="pub-heading" style={{ fontSize: 28, color: tier.primary ? '#3d9be9' : '#071629', marginBottom: 4 }}>{tier.price}</p>
                <p style={{ color: '#6e6e73', fontSize: 13, marginBottom: 20 }}>{tier.note}</p>
                {tier.href.startsWith('/') ? (
                  <Link href={tier.href} className={tier.primary ? 'pub-btn-primary pub-btn-sm' : 'pub-btn-ghost pub-btn-sm'}>
                    {tier.cta}
                  </Link>
                ) : (
                  <a href={tier.href} className={tier.primary ? 'pub-btn-primary pub-btn-sm' : 'pub-btn-ghost pub-btn-sm'}>
                    {tier.cta}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────── */}
      <section style={{ background: '#071629', padding: '64px 24px' }}>
        <div className="max-w-[1200px] mx-auto text-center reveal">
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(22px, 3vw, 36px)', marginBottom: 14 }}>
            Already a Proplr member?
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 16, marginBottom: 28 }}>
            Your Compass assessment is included in the Foundation and Impact programs.
          </p>
          <Link href="/register" className="pub-btn-primary">Register Now →</Link>
        </div>
      </section>
    </div>
  );
}
