import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About Proplr - Founded for UAE Students' };

export default function AboutPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff', paddingTop: 80 }}>
        <div className="pub-orb-blue" style={{ width: 500, height: 500, top: -150, right: -80 }} />
        <div className="pub-section relative z-10">
          <div className="max-w-3xl">
            <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#071629', marginBottom: 20 }}>
              We set out to build a better way<br />
              <span className="pub-gradient-text">to guide students.</span>
            </h1>
            <p className="reveal reveal-delay-1" style={{ fontSize: 18, color: '#6e6e73', lineHeight: 1.65, maxWidth: 560 }}>
              Together with students, educators, and industry partners - we&apos;re reinventing how young people discover careers, gain real-world experience, and find clarity before they graduate.
            </p>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="pub-card reveal p-8" style={{ border: '1px solid rgba(61,155,233,0.2)' }}>
              <h2 className="pub-heading" style={{ fontSize: 22, color: '#071629', marginBottom: 10 }}>Our Mission</h2>
              <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.7 }}>
                To equip students to lead, invent, and adapt in a changing world. By creating supportive environments for exploration, hands-on experiences, and linking learners with mentors, we instil the confidence to pursue their future with curiosity and purpose.
              </p>
            </div>
            <div className="pub-card reveal reveal-delay-1 p-8" style={{ border: '1px solid rgba(255,203,93,0.25)' }}>
              <h2 className="pub-heading" style={{ fontSize: 22, color: '#071629', marginBottom: 10 }}>Our Vision</h2>
              <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.7 }}>
                A future in which every student feels capable and confident, gains career clarity early, develops real-world skills in school, and benefits from ongoing mentorship and direct industry engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM WE'RE SOLVING ────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#071629', marginBottom: 10 }}>
              The path from school to career is broken.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: 'The Challenge',
                body: 'Students as young as 14 are expected to make career-shaping decisions but often lack the tools, exposure, and confidence to do so. Academic achievement alone no longer guarantees success.',
                bg: 'rgba(255,203,93,0.08)',
                border: 'rgba(255,203,93,0.25)',
              },
              {
                title: 'The Skills Gap',
                body: 'Employers and universities report that graduates lack essential skills - teamwork, communication, adaptability - despite strong academic results. In the UAE, where the economy demands entrepreneurial, tech-savvy thinkers, traditional curricula rarely provide real-world exposure.',
                bg: 'rgba(61,155,233,0.06)',
                border: 'rgba(61,155,233,0.18)',
              },
              {
                title: 'The Emotional Reality',
                body: '61% of students feel intense academic pressure but see little real-world relevance in their studies. Many graduate without confidence, professional behavior, or a clear sense of purpose.',
                bg: 'rgba(61,155,233,0.06)',
                border: 'rgba(61,155,233,0.18)',
              },
              {
                title: 'The Opportunity',
                body: 'Proplr exists to close this gap - linking career discovery with the skills, mentorship, and exposure needed to thrive in the modern economy.',
                bg: 'rgba(39,174,96,0.06)',
                border: 'rgba(39,174,96,0.18)',
              },
            ].map((card, i) => (
              <div key={card.title} className={`pub-card reveal reveal-delay-${(i % 2) + 1} p-8`} style={{ background: card.bg, border: `1.5px solid ${card.border}` }}>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 17, color: '#071629', marginBottom: 10 }}>{card.title}</h3>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.7 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDERS ─────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="text-center mb-14 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#071629', marginBottom: 10 }}>Built by people who lived this problem.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Alina Satheesh',
                uni: 'University of Birmingham, UK - Business Management',
                bio: 'Alina holds a Business Management degree from the University of Birmingham (UK) and has spent her career in student development across the UK and UAE. She understands firsthand what it feels like to graduate without the connections, clarity, or career direction that school never provided. Her work in student leadership and development has been nationally recognized.',
              },
              {
                name: 'Faris',
                uni: 'Carleton University, Canada - Engineering',
                bio: "Faris holds an Engineering degree from Carleton University (Canada) and served as President of the Carleton University Students' Association, managing a $6M budget and representing 27,000 students. He has presented to Canadian Prime Ministers and received national media coverage for his student leadership work. He now calls Dubai home and brings that experience back to the students who need it most.",
              },
            ].map((founder, i) => (
              <div key={founder.name} className={`pub-card reveal reveal-delay-${i + 1} p-8`} style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4" style={{ background: '#071629', fontFamily: 'Montserrat, sans-serif' }}>
                  {founder.name[0]}
                </div>
                <h3 className="pub-heading" style={{ fontSize: 20, color: '#071629', marginBottom: 4 }}>{founder.name}</h3>
                <p style={{ color: '#3d9be9', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{founder.uni}</p>
                <p style={{ color: '#6e6e73', fontSize: 14, lineHeight: 1.7 }}>{founder.bio}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <p style={{ color: '#6e6e73', fontSize: 15, fontStyle: 'italic', maxWidth: 600, margin: '0 auto' }}>
              Together, Alina and Faris built Proplr because no one built it for them.
            </p>
          </div>
        </div>
      </section>

      {/* ── BY THE NUMBERS ───────────────────────────────── */}
      <section style={{ background: '#ffffff' }}>
        <div className="pub-section">
          <div className="text-center mb-12 reveal">
            <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629' }}>By the Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '10+', label: 'Schools across Dubai' },
              { value: '500+', label: 'Students enrolled' },
              { value: '150+', label: 'Industry mentors' },
              { value: '#633441', label: 'KHDA Permit' },
            ].map((stat, i) => (
              <div key={stat.label} className={`reveal reveal-delay-${i + 1} text-center p-6 rounded-2xl`} style={{ background: '#f5f5f7' }}>
                <p className="pub-heading" style={{ fontSize: 24, color: '#071629', marginBottom: 4 }}>{stat.value}</p>
                <p style={{ color: '#6e6e73', fontSize: 13, fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KHDA ─────────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7', padding: '64px 24px' }}>
        <div className="max-w-2xl mx-auto text-center reveal">
          <div className="inline-block px-5 py-3 rounded-2xl mb-6 text-sm font-bold" style={{ background: '#3d9be9', color: '#ffffff' }}>
            KHDA Permit #633441
          </div>
          <h2 className="pub-heading" style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: '#071629', marginBottom: 12 }}>
            Certified by Dubai&apos;s Knowledge Authority.
          </h2>
          <p style={{ color: '#6e6e73', fontSize: 15, lineHeight: 1.7 }}>
            Every certificate we issue carries official UAE recognition - and it means every hour a student spends in our program counts toward something real.
          </p>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section style={{ background: '#071629', padding: '64px 24px' }}>
        <div className="max-w-[1200px] mx-auto text-center reveal">
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(22px, 3vw, 34px)', marginBottom: 16 }}>Say hello.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 flex-wrap">
            <a href="mailto:hello@proplr.ae" style={{ color: '#3d9be9', fontSize: 16, fontWeight: 600 }} className="hover:text-white transition-colors">hello@proplr.ae</a>
            <span style={{ color: '#1e2f45' }}>·</span>
            <a href="https://instagram.com/proplrae" target="_blank" rel="noreferrer" style={{ color: '#8ca3be', fontSize: 16 }} className="hover:text-white transition-colors">@proplrae</a>
            <span style={{ color: '#1e2f45' }}>·</span>
            <a href="https://linkedin.com/company/proplrae" target="_blank" rel="noreferrer" style={{ color: '#8ca3be', fontSize: 16 }} className="hover:text-white transition-colors">LinkedIn</a>
            <span style={{ color: '#1e2f45' }}>·</span>
            <Link href="/partners" style={{ color: '#8ca3be', fontSize: 16 }} className="hover:text-white transition-colors">Partner with us →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
