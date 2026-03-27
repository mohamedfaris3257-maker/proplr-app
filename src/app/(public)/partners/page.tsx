import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { IndustryPartnerForm, InstitutionPartnerForm } from '@/components/public/PartnerForms';

export const metadata: Metadata = { title: 'Partner with Proplr — Shape the Next Generation' };

export default function PartnersPage() {
  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="pub-hero-image pub-overlay-left" style={{ minHeight: 520 }}>
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80&auto=format"
          alt="Business professionals in a collaborative meeting"
          fill
          className="pub-ken-burns"
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="pub-section relative z-10" style={{ paddingTop: 120, paddingBottom: 100 }}>
          <div className="max-w-2xl">
            <div className="pub-line-grow reveal mb-8" />
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6" style={{ background: 'rgba(255,203,93,0.2)', color: '#ffcb5d', border: '1px solid rgba(255,203,93,0.3)' }}>
              PARTNERSHIPS &middot; INDUSTRY &amp; INSTITUTIONS
            </span>

            <h1 className="pub-heading pub-text-shadow reveal" style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: '#ffffff', marginBottom: 20, lineHeight: 1.05 }}>
              Partner with Proplr.<br />
              <span style={{ color: '#ffcb5d' }}>Shape futures.</span>
            </h1>

            <p className="pub-text-shadow reveal reveal-delay-1" style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', maxWidth: 480, marginBottom: 40 }}>
              Connect your organisation with Dubai&apos;s most motivated young talent &mdash; and help them build the careers of tomorrow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 reveal reveal-delay-2">
              <a href="#industry-form" className="pub-btn-primary">Become an Industry Partner</a>
              <a href="#institution-form" className="pub-btn-ghost" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>Launch a Campus Chapter</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <section className="pub-bg-animated">
        <div className="pub-section-compact">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-6">
            {[
              { num: '20+', label: 'Schools' },
              { num: '150+', label: 'Industry Mentors' },
              { num: '6', label: 'KHDA Pillars' },
              { num: '#633441', label: 'KHDA Permit' },
            ].map((s) => (
              <div key={s.label} className="reveal">
                <span className="pub-stat-number" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#ffffff', fontFamily: 'Montserrat, sans-serif', fontWeight: 900, display: 'block' }}>
                  {s.num}
                </span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER ────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 10 }}>
              Why partner with <span className="pub-gradient-text">Proplr?</span>
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
              We&apos;re not a careers day. We&apos;re a year-round ecosystem connecting students, schools, and industry.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '◎', title: 'Access Top Talent', desc: 'Engage with ambitious students already building portfolios, pitching ideas, and running real projects.' },
              { icon: '▣', title: 'Brand Visibility', desc: 'Reach Dubai\'s next generation of professionals. Your brand in front of thousands of students and parents.' },
              { icon: '◆', title: 'CSR Alignment', desc: 'Align with UAE AI 2031, Dubai E33, and Rahhal Framework goals. Meaningful impact, not just optics.' },
              { icon: '▦', title: 'Compass Reports', desc: 'Receive data-driven insights on student skills, interests, and career readiness from our proprietary assessments.' },
              { icon: '★', title: 'Showcase Sponsorship', desc: 'Put your brand behind our national pitch competition — live finals, cash prizes, cross-school teams.' },
              { icon: '⟁', title: 'Pipeline Building', desc: 'Build your future workforce. Connect early with students who match your industry and culture.' },
            ].map((card, i) => (
              <div key={card.title} className={`pub-card pub-glow-border reveal reveal-delay-${(i % 3) + 1} p-7`}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{card.icon}</span>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 16, color: '#071629', marginBottom: 8 }}>
                  {card.title}
                </h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.65 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRY PARTNERS — IMAGE + TEXT ────────────────── */}
      <section id="industry-form" style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal-left">
              <div className="pub-img-card">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80&auto=format"
                  alt="Mentorship session with professionals and students"
                  width={800}
                  height={530}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto', borderRadius: 16 }}
                />
              </div>
            </div>
            <div className="reveal-right">
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#3d9be9', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>
                INDUSTRY PARTNERS
              </span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', color: '#071629', marginBottom: 14 }}>
                Work with students who are already doing the work.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                Proplr students aren&apos;t passive learners. They&apos;re pitching business ideas, running innovation sprints, presenting to judges, and building portfolios. When you partner with Proplr, you get access to some of Dubai&apos;s most motivated young people.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {['Mentorship', 'Company Challenges', 'Internships', 'Career Panels', 'Sponsorship'].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(61,155,233,0.1)', color: '#3d9be9', border: '1px solid rgba(61,155,233,0.2)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY PARTNER FORM SECTION ──────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <h3 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                What industry partners do
              </h3>
              <ul className="space-y-4">
                {[
                  { arrow: '→', text: 'Offer mentorship office hours to students across Dubai' },
                  { arrow: '→', text: 'Provide real company challenge briefs for innovation sprints' },
                  { arrow: '→', text: 'Host internship and job shadow days at your office' },
                  { arrow: '→', text: 'Sit on career discovery panels and share industry insight' },
                  { arrow: '→', text: 'Sponsor Proplr Showcase awards and prizes' },
                  { arrow: '→', text: 'Speak at workshops and live events' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-sm" style={{ color: '#4b5563' }}>
                    <span style={{ color: '#3d9be9', fontWeight: 700, fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.arrow}</span>
                    <span style={{ lineHeight: 1.6 }}>{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-5 rounded-2xl" style={{ background: 'rgba(255,203,93,0.08)', border: '1.5px solid rgba(255,203,93,0.25)' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#071629', marginBottom: 8 }}>What you get</p>
                <ul className="space-y-2">
                  {['Brand visibility to Dubai\'s next generation', 'Pipeline of motivated young talent', 'UAE AI 2031 and E33 CSR alignment', 'Platform recognition and co-branding', 'Compass data insights on student engagement'].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#6e6e73' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 700 }}>&#10003;</span> {item}
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

      {/* ── FULL-WIDTH DIVIDER IMAGE ──────────────────────── */}
      <section className="pub-hero-image pub-overlay-dark" style={{ minHeight: 340 }}>
        <Image
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80&auto=format"
          alt="University campus with students"
          fill
          className="pub-ken-burns"
          style={{ objectFit: 'cover' }}
        />
        <div className="pub-section relative z-10" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="max-w-2xl mx-auto text-center reveal">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6 pub-pulse-glow" style={{ background: 'rgba(61,155,233,0.15)', color: '#3d9be9', border: '1px solid rgba(61,155,233,0.25)' }}>
              UNIVERSITY &amp; SCHOOL PARTNERS
            </span>
            <h2 className="pub-heading pub-text-shadow" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#ffffff', marginBottom: 14 }}>
              Bring Proplr to <span style={{ color: '#ffcb5d' }}>your campus.</span>
            </h2>
            <p className="pub-text-shadow" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
              Launch an Impact Chapter, integrate Compass assessments, or build a full co-curricular partnership with inspection-ready frameworks.
            </p>
          </div>
        </div>
      </section>

      {/* ── INSTITUTION PARTNERS — IMAGE + TEXT ─────────────── */}
      <section id="institution-form" style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal-right order-2 md:order-1">
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: '#071629', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>
                CAMPUS PARTNERSHIPS
              </span>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', color: '#071629', marginBottom: 14 }}>
                Launch a Proplr Impact Chapter at your campus.
              </h2>
              <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                Proplr Impact operates through student chapters inside universities, entrepreneurship centres, and accelerators. Whether you&apos;re a school looking to enhance your co-curricular offering or a university wanting to give students a head start &mdash; we&apos;ll build it with you.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Impact Chapters', 'Compass Pilot', 'KHDA-Aligned', 'Inspection Ready'].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(7,22,41,0.06)', color: '#071629', border: '1px solid rgba(7,22,41,0.12)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="reveal-left order-1 md:order-2">
              <div className="pub-img-card">
                <Image
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80&auto=format"
                  alt="University students on campus"
                  width={800}
                  height={530}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto', borderRadius: 16 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTITUTION BENEFITS + FORM ──────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
            <div className="pub-card reveal p-8" style={{ border: '1px solid rgba(7,22,41,0.12)' }}>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#071629', marginBottom: 20 }}>
                Launch a Chapter at Your Campus
              </h3>
              <InstitutionPartnerForm />
            </div>
            <div className="reveal reveal-delay-1">
              <h3 className="pub-heading" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#071629', marginBottom: 14 }}>
                What your institution gets
              </h3>
              <div className="space-y-4">
                {[
                  { icon: '★', title: 'KHDA-Aligned Co-Curricular', desc: 'A ready-made program that meets Dubai\'s inspection and accreditation criteria.' },
                  { icon: '◎', title: 'Industry Engagement', desc: 'Infrastructure for mentorship, job shadowing, and internship pipelines - built in.' },
                  { icon: '▤', title: 'Inspection Evidence', desc: 'Term reports, student progress data, and pillar completion records for regulatory audits.' },
                  { icon: '●', title: 'Platform Access', desc: 'Featured on the Proplr platform with Compass reports, student dashboards, and analytics.' },
                  { icon: '◆', title: 'Launch Support', desc: 'On-campus info sessions, marketing materials, and dedicated onboarding for your team.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#071629', marginBottom: 4 }}>{item.title}</p>
                      <p style={{ color: '#6e6e73', fontSize: 13, lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNERSHIP MODELS ──────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#071629', marginBottom: 10 }}>
              Partnership <span className="pub-gradient-text-animated">models.</span>
            </h2>
            <p style={{ color: '#6e6e73', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
              Flexible frameworks designed around your goals and capacity.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                tier: 'Engage',
                color: '#3d9be9',
                bg: 'rgba(61,155,233,0.06)',
                border: 'rgba(61,155,233,0.18)',
                features: ['Mentorship office hours', 'Career panel speaker', 'Company profile on platform', 'Annual impact report'],
              },
              {
                tier: 'Collaborate',
                color: '#f59e0b',
                bg: 'rgba(245,158,11,0.06)',
                border: 'rgba(245,158,11,0.2)',
                features: ['Everything in Engage', 'Challenge brief sponsor', 'Job shadowing host', 'Compass data access', 'Co-branded content'],
              },
              {
                tier: 'Strategic',
                color: '#071629',
                bg: 'rgba(7,22,41,0.04)',
                border: 'rgba(7,22,41,0.14)',
                features: ['Everything in Collaborate', 'Showcase title sponsor', 'Internship pipeline', 'Exclusive recruiter events', 'Board advisory seat'],
              },
            ].map((model, i) => (
              <div key={model.tier} className={`pub-card pub-glow-border reveal reveal-delay-${i + 1} p-7`} style={{ background: model.bg, border: `1.5px solid ${model.border}` }}>
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-5" style={{ background: model.color, color: '#ffffff' }}>
                  {model.tier}
                </span>
                <ul className="space-y-3">
                  {model.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: '#4b5563' }}>
                      <span style={{ color: model.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                      <span style={{ lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KHDA BADGE BAR ──────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section-compact">
          <div className="max-w-3xl mx-auto text-center reveal py-10">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['KHDA Permit #633441', 'Dubai E33 Aligned', 'UAE AI 2031', 'Rahhal Framework'].map((badge) => (
                <span key={badge} className="pub-glass px-5 py-2 rounded-full text-sm font-bold" style={{ color: '#071629' }}>
                  {badge}
                </span>
              ))}
            </div>
            <p style={{ color: '#6e6e73', fontSize: 15 }}>
              Built for the UAE&apos;s education priorities. Inspection-ready from day one.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section className="pub-pattern-grid" style={{ background: '#071629' }}>
        <div className="pub-section text-center reveal" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <h2 className="pub-heading" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#ffffff', marginBottom: 14 }}>
            Ready to make an <span style={{ color: '#ffcb5d' }}>impact?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, maxWidth: 520, margin: '0 auto 36px' }}>
            Whether you&apos;re a Fortune 500 or a local startup, a top university or a neighbourhood school &mdash; there&apos;s a way to work together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#industry-form" className="pub-btn-primary">Partner as Industry</a>
            <a href="#institution-form" className="pub-btn-ghost" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>Partner as Institution</a>
          </div>
          <div className="mt-8">
            <a href="mailto:hello@proplr.ae" style={{ color: '#3d9be9', fontSize: 15, fontWeight: 600 }} className="hover:text-white transition-colors">
              Or reach out directly &mdash; hello@proplr.ae
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
