import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pricing — Proplr', description: 'Simple pricing. Real returns.' };

const FOUNDATION_FEATURES = [
  '6 KHDA-certified pillar completions',
  'All weekly program sessions',
  'Industry mentorship and career panels',
  'Internship and job shadow opportunities',
  'Portfolio building support and reviews',
  'Compass Career Assessment (included)',
  'Full Proplr platform access',
  'National Showcase 2026 eligibility',
  'Student Welcome Package',
  'Compass Career Reassessment at graduation',
];

const IMPACT_FEATURES = [
  '6 KHDA-certified pillar completions',
  'Club and chapter access',
  'Industry innovation challenges with real company briefs',
  'Demo days and public presentations',
  'Mini accelerator and incubator access',
  'Full Proplr platform access',
  'National Showcase 2026 eligibility',
  'Interview and job search readiness support',
  'Startup funding pathway opportunities',
];

const FAQS = [
  {
    q: 'Can I pay monthly for Foundation?',
    a: 'Yes. Foundation is structured as AED 400/month across the 8-month program year (September to April). You can pay monthly or upfront — your choice.',
  },
  {
    q: "What if my school doesn't have a Proplr club yet?",
    a: "You can still register. Reach out to us at hello@proplr.ae and we'll help you either find the nearest program or work with your school to start one. You can also submit a request at our Start a Club page.",
  },
  {
    q: 'Are the KHDA certificates recognized across the UAE?',
    a: 'Yes. Our certificates are formally attested by KHDA (Permit #633441) and recognized across UAE educational institutions and employers.',
  },
  {
    q: 'Is Compass included in my enrollment?',
    a: 'Yes — both Foundation and Impact include a Compass Career Assessment at the start of the year and a reassessment at graduation to show your progress.',
  },
  {
    q: "What's the refund policy?",
    a: 'Contact hello@proplr.ae within 14 days of your enrollment date for a full refund if the program hasn\'t started. Once the program begins, refunds are assessed case by case.',
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '80px 24px 60px' }}>
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#071629', marginBottom: 16 }}>
            Simple pricing. Real returns.
          </h1>
          <p className="reveal reveal-delay-1" style={{ color: '#6e6e73', fontSize: 18, maxWidth: 540, margin: '0 auto' }}>
            One year with Proplr. Six KHDA certificates. A career direction. A portfolio. And a professional network you&apos;ll actually use.
          </p>
        </div>
      </section>

      {/* ── PLAN CARDS ───────────────────────────────────── */}
      <section style={{ background: '#f5f5f7', padding: '0 24px 80px' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">

            {/* Foundation */}
            <div className="pub-card reveal p-10" style={{ border: '2px solid rgba(255,203,93,0.35)', background: '#ffffff' }}>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#ffcb5d', color: '#071629' }}>
                  School Students · Grades 8–12
                </span>
                <h2 className="pub-heading" style={{ fontSize: 28, color: '#071629', marginBottom: 6 }}>Foundation</h2>
                <p style={{ color: '#6e6e73', fontSize: 14 }}>The full-year co-curricular program for K-12</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="pub-heading" style={{ fontSize: 42, color: '#071629' }}>AED 400</span>
                  <span style={{ color: '#6e6e73', fontSize: 15 }}>/month</span>
                </div>
                <p style={{ color: '#ffcb5d', fontSize: 13, fontWeight: 700 }}>× 8 months = AED 3,200/year</p>
              </div>

              <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '20px 0' }} />

              <ul className="space-y-3 mb-8">
                {FOUNDATION_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: '#1d1d1f' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="8" cy="8" r="8" fill="rgba(255,203,93,0.2)" />
                      <path d="M5 8l2 2 4-4" stroke="#a07800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/enroll?plan=foundation" className="pub-btn-navy w-full text-center block">
                Register for Foundation →
              </Link>
            </div>

            {/* Impact */}
            <div className="pub-card reveal reveal-delay-1 p-10" style={{ border: '2px solid rgba(61,155,233,0.35)', background: '#ffffff', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#3d9be9', color: '#fff', borderRadius: 100, padding: '4px 16px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                University Students
              </div>

              <div className="mb-6" style={{ paddingTop: 8 }}>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: 'rgba(61,155,233,0.12)', color: '#1a6fad', border: '1px solid rgba(61,155,233,0.2)' }}>
                  Post-Secondary · All Universities
                </span>
                <h2 className="pub-heading" style={{ fontSize: 28, color: '#071629', marginBottom: 6 }}>Impact</h2>
                <p style={{ color: '#6e6e73', fontSize: 14 }}>Industry-driven program for university students</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="pub-heading" style={{ fontSize: 42, color: '#071629' }}>AED 999</span>
                </div>
                <p style={{ color: '#3d9be9', fontSize: 13, fontWeight: 700 }}>Flat rate · Full academic year</p>
              </div>

              <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '20px 0' }} />

              <ul className="space-y-3 mb-8">
                {IMPACT_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: '#1d1d1f' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="8" cy="8" r="8" fill="rgba(61,155,233,0.15)" />
                      <path d="M5 8l2 2 4-4" stroke="#1a6fad" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/enroll?plan=impact" className="pub-btn-primary w-full text-center block">
                Join Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── REFERRAL + COMPASS NOTES ─────────────────────── */}
      <section style={{ background: '#ffffff', padding: '48px 24px' }}>
        <div className="max-w-3xl mx-auto text-center reveal">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl" style={{ background: '#f5f5f7', border: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: 24, display: 'block', marginBottom: 10 }}>🎁</span>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 6 }}>Have a referral code?</h3>
              <p style={{ color: '#6e6e73', fontSize: 14 }}>Enter it during registration for a discount. Codes from friends, teachers, or Proplr ambassadors all count.</p>
            </div>
            <div className="p-6 rounded-2xl" style={{ background: '#f5f5f7', border: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: 24, display: 'block', marginBottom: 10 }}>🧭</span>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 6 }}>Just want Compass?</h3>
              <p style={{ color: '#6e6e73', fontSize: 14 }}>The Compass career assessment is also available as a standalone tool. <Link href="/compass" style={{ color: '#3d9be9', fontWeight: 600 }}>See Compass pricing →</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7', padding: '64px 24px' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="pub-heading text-center reveal" style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: '#071629', marginBottom: 32 }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={faq.q} className={`pub-card reveal reveal-delay-${(i % 3) + 1} p-6`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#1d1d1f', marginBottom: 8 }}>{faq.q}</p>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ background: '#071629', padding: '64px 24px' }}>
        <div className="max-w-[1200px] mx-auto text-center reveal">
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(24px, 4vw, 38px)', marginBottom: 14 }}>
            Ready to invest in your future?
          </h2>
          <p style={{ color: '#8ca3be', fontSize: 17, marginBottom: 32 }}>Clubs are forming now. Program starts September 2026.</p>
          <Link href="/enroll" className="pub-btn-primary">Get Started →</Link>
          <p style={{ color: '#4a6785', fontSize: 13, marginTop: 16 }}>Questions? <a href="mailto:hello@proplr.ae" style={{ color: '#3d9be9' }}>hello@proplr.ae</a></p>
        </div>
      </section>
    </div>
  );
}
