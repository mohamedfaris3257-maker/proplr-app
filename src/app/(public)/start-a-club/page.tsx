import type { Metadata } from 'next';
import { ClubInterestForm } from '@/components/public/ClubInterestForm';

export const metadata: Metadata = { title: 'Start a Proplr Club — Bring Proplr to Your School' };

export default function StartAClubPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="pub-orb-blue" style={{ width: 500, height: 500, top: -150, right: -80 }} />
        <div className="pub-section relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-5" style={{ background: 'rgba(61,155,233,0.1)', color: '#1a6fad', border: '1px solid rgba(61,155,233,0.2)' }}>
              For Schools & Institutions
            </span>
            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#071629', marginBottom: 20 }}>
              Bring Proplr<br />
              <span className="pub-gradient-text">to Your School.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 18, color: '#6e6e73', lineHeight: 1.65, maxWidth: 540, marginBottom: 36 }}>
              Starting a Proplr club is easier than you think. We handle the facilitators, mentors, industry representatives, and all the reporting. You provide the students and the space. That&apos;s the whole deal.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS FOR SCHOOLS ─────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>THE PROCESS</span>
            <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 38px)', color: '#071629', marginBottom: 10 }}>
              Three steps from interest to launch.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Submit Your Interest', desc: 'Fill out the short form below. Tell us about your school, your students, and when you\'re thinking of starting. Takes 3 minutes.' },
              { step: '2', title: 'We Run a Free Intro Session', desc: 'Alina or Faris will come to your school (or hop on a call) for a free information session — with your students, your parents, or your leadership team.' },
              { step: '3', title: 'Your Club Launches in September', desc: 'We finalise the implementation details, set up your school\'s community on the platform, and your Proplr club begins in September 2026.' },
            ].map((s, i) => (
              <div key={s.step} className={`reveal reveal-delay-${i + 1} text-center`}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-4" style={{ background: '#3d9be9', fontFamily: 'Montserrat, sans-serif' }}>
                  {s.step}
                </div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 17, color: '#071629', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT SCHOOLS GET ─────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="grid md:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
            <div className="reveal">
              <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 16 }}>
                Everything you need. None of the operational headache.
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: '📋', text: 'KHDA-Aligned Content — our program is built to KHDA standards, certified, documented, and reportable' },
                  { icon: '📁', text: 'Inspection-Ready Reporting — attendance records, rubric assessments, mentor notes, portfolio submissions, and certificates automatically documented' },
                  { icon: '🏭', text: 'Industry Access for Your Students — internships, job shadow days, company challenges, and career panels' },
                  { icon: '🧑‍🏫', text: 'No Disruption to Teaching — Proplr runs as an after-school club or co-curricular module, no crossover with your staff' },
                  { icon: '🤝', text: 'Facilitators and Mentors Provided — we source, brief, and manage all facilitators and industry mentors' },
                  { icon: '🎓', text: 'Real Certification for Students — 6 KHDA-attested certificates per student' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ color: '#1d1d1f', fontSize: 15, lineHeight: 1.6 }}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Free Compass Pilot highlight */}
            <div className="reveal reveal-delay-1">
              <div className="p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)', border: '2px solid rgba(61,155,233,0.25)' }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 14 }}>🧭</span>
                <h3 className="pub-heading" style={{ fontSize: 20, color: '#071629', marginBottom: 10 }}>
                  Start with a Free Compass Pilot
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                  Before committing to the full program, run a free Compass Career Assessment for a sample cohort of Grades 8–10 students. No commitment. No cost. Just clarity.
                </p>
                <ul className="space-y-2 mb-6">
                  {['AI-powered career reports for every student', 'Group analytics for the school', 'Parent-ready report format', 'No subscription required'].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#6e6e73' }}>
                      <span style={{ color: '#3d9be9' }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <p style={{ color: '#3d9be9', fontSize: 13, fontWeight: 600 }}>Submit the form below to book your free pilot →</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section style={{ background: '#071629' }}>
        <div className="pub-section" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 10 }}>Common questions from schools.</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: 'Does Proplr replace any existing school activities?', a: 'No. Proplr runs as an after-school club or co-curricular enrichment module. It does not interfere with core academic time or existing extracurriculars.' },
                { q: 'What does Proplr cost the school?', a: 'Proplr is funded by parent enrollment fees (AED 400/month per student). There is no cost to the school for hosting a club \u2014 we provide everything.' },
                { q: 'Who facilitates the sessions?', a: 'Proplr provides trained facilitators, industry mentors, and guest speakers. School staff are welcome to observe but are not required to run sessions.' },
                { q: 'Is Proplr KHDA approved?', a: 'Yes. Proplr is a KHDA-permitted training institute (Permit #633441). All programs, assessments, and certificates are aligned with KHDA requirements.' },
                { q: 'Can we start mid-year?', a: 'We recommend starting in September with a full cohort, but we can accommodate mid-year starts for schools that want to begin sooner. Contact us to discuss.' },
              ].map((faq, i) => (
                <div key={faq.q} className={`reveal reveal-delay-${(i % 3) + 1} p-6 rounded-2xl`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#ffffff', marginBottom: 8 }}>{faq.q}</h4>
                  <p style={{ color: '#8ca3be', fontSize: 14, lineHeight: 1.65 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEREST FORM ────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10 reveal">
              <h2 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 10 }}>
                Submit your interest.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 16 }}>
                Alina or Faris will be in touch within 48 hours.
              </p>
            </div>
            <div className="pub-card p-8 reveal reveal-delay-1" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <ClubInterestForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
