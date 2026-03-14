import type { Metadata } from 'next';
import { IndustryPartnerForm, InstitutionPartnerForm } from '@/components/public/PartnerForms';

export const metadata: Metadata = { title: 'Partners — Proplr' };

export default function PartnersPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="pub-orb-blue" style={{ width: 500, height: 500, top: -150, right: -80 }} />
        <div className="pub-section relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(61,155,233,0.1)', color: '#1a6fad', border: '1px solid rgba(61,155,233,0.2)' }}>PARTNERSHIPS</span>
            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#071629', marginBottom: 20 }}>
              Partner with Proplr.<br />
              <span className="pub-gradient-text">Shape the next generation.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 18, color: '#6e6e73', lineHeight: 1.65, maxWidth: 540, margin: '0 auto' }}>
              We connect companies, institutions, and organizations with ambitious, motivated students across Dubai. If you believe in developing young talent — and doing it in a way that actually prepares them for the world — let&apos;s talk.
            </p>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY PARTNERS ────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: '#3d9be9', color: '#ffffff' }}>Industry Partners</span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                Work with students who are already doing the work.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                Proplr students aren&apos;t passive learners. They&apos;re pitching business ideas, running innovation sprints, presenting to judges, and building portfolios. When you partner with Proplr, you get access to some of Dubai&apos;s most motivated young people — and they get access to you.
              </p>
              <div className="mb-5">
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#071629', marginBottom: 8 }}>What industry partners do:</p>
                <ul className="space-y-2">
                  {['Offer mentorship office hours', 'Provide real company challenge briefs', 'Host internship and job shadow days', 'Sit on career discovery panels', 'Sponsor Showcase awards', 'Speak at events and workshops'].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#6e6e73' }}>
                      <span style={{ color: '#3d9be9' }}>→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#071629', marginBottom: 8 }}>What partners get:</p>
                <ul className="space-y-2">
                  {['Brand visibility to Dubai\'s next generation', 'Pipeline of motivated young talent', 'UAE AI 2031 and E33 CSR alignment', 'Platform recognition and co-branding'].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#6e6e73' }}>
                      <span style={{ color: '#ffcb5d' }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pub-card reveal reveal-delay-1 p-8" style={{ border: '1px solid rgba(61,155,233,0.2)' }}>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#071629', marginBottom: 20 }}>
                Become an Industry Partner
              </h3>
              <IndustryPartnerForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTITUTION PARTNERS ─────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="pub-card reveal p-8" style={{ border: '1px solid rgba(7,22,41,0.12)' }}>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#071629', marginBottom: 20 }}>
                Launch a Chapter at Your Campus
              </h3>
              <InstitutionPartnerForm />
            </div>
            <div className="reveal reveal-delay-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: '#071629', color: '#ffffff' }}>University / School Partners</span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                Launch a Proplr Impact Chapter at your campus.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                Proplr Impact operates through student chapters inside universities, entrepreneurship centers, and accelerators.
              </p>
              <ul className="space-y-3">
                {['KHDA-aligned co-curricular offering', 'Industry engagement infrastructure', 'Inspection and accreditation evidence', 'Featured on Proplr platform and Compass reports', 'On-campus info session to kick off enrollment'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#6e6e73' }}>
                    <span style={{ color: '#071629', fontWeight: 700 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
