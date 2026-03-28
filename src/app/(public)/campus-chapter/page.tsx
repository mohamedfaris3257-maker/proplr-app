import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Launch a Campus Chapter | Proplr Impact',
  description: 'Bring Proplr Impact to your university. Lead a chapter, earn leadership experience, and connect your peers to real industry.',
};

export default function CampusChapterPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #071629 0%, #1a3a5c 100%)', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(61,155,233,0.2) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(61,155,233,0.15)', border: '1px solid rgba(61,155,233,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3d9be9', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#3d9be9', letterSpacing: 1.5 }}>PROPLR IMPACT</span>
          </div>
          <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#ffffff', marginBottom: 20, lineHeight: 1.15 }}>
            Launch a Chapter<br />at Your University
          </h1>
          <p className="reveal reveal-delay-1" style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Run Proplr Impact as a student-led club on your campus. We give you the curriculum, mentors, and platform. You lead the chapter and earn real leadership experience.
          </p>
          <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#apply" className="pub-btn-primary">
              Apply to Lead
            </a>
            <a href="#how-it-works" className="pub-btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section style={{ background: '#f0f2f8', padding: '24px', display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        {['KHDA Certified', 'Full Curriculum Provided', 'Industry Mentors Included', 'Leadership Experience'].map(badge => (
          <div key={badge} className="reveal" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#071629' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#3d9be9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            {badge}
          </div>
        ))}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="reveal" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#3d9be9', marginBottom: 12 }}>THE PROCESS</div>
          <h2 className="pub-heading reveal" style={{ fontSize: 36, color: '#071629' }}>
            From application to chapter in 4 steps
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {[
            { step: '01', title: 'Apply to Lead', desc: 'Fill out the form below. Tell us about yourself and your university.' },
            { step: '02', title: 'Onboarding Call', desc: 'We walk you through the program, your role as chapter lead, and next steps.' },
            { step: '03', title: 'Chapter Setup', desc: 'We help you recruit members, set up your chapter page, and launch enrollment.' },
            { step: '04', title: 'Program Runs', desc: 'You lead weekly sessions with Proplr curriculum and mentors. We support you the whole way.' },
          ].map((item, i) => (
            <div key={item.step} className={`reveal reveal-delay-${(i % 4) + 1}`} style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid rgba(7,22,41,0.08)' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 32, fontWeight: 900, color: 'rgba(61,155,233,0.2)', marginBottom: 12 }}>{item.step}</div>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 700, color: '#071629', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13.5, color: '#6e7591', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT CHAPTER LEADS GET ── */}
      <section style={{ background: '#071629', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="reveal" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#ffcb5d', marginBottom: 12 }}>WHAT YOU GET</div>
            <h2 className="pub-heading reveal" style={{ fontSize: 36, color: '#fff' }}>
              Lead a chapter. Build your resume.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { title: 'Full Curriculum', desc: '6 pillars, 120 hours, assessments, and all session materials ready to deliver.' },
              { title: 'Industry Mentors', desc: '150+ professionals from 40+ sectors matched to your chapter\'s sessions.' },
              { title: 'Leadership Title', desc: 'Official Chapter Lead role with a KHDA-backed certificate of leadership.' },
              { title: 'Proplr Platform', desc: 'Full access to the Proplr dashboard, community, and Compass for your members.' },
              { title: 'Showcase Eligibility', desc: 'Your chapter competes in the National Showcase against campuses across the UAE.' },
              { title: 'Resume Builder', desc: 'Running a chapter is real leadership experience employers and grad schools value.' },
            ].map((item, i) => (
              <div key={item.title} className={`reveal reveal-delay-${(i % 3) + 1}`} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,203,93,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffcb5d" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLY FORM ── */}
      <section id="apply" style={{ background: '#f5f5f7' }}>
        <div className="pub-section">
          <div className="max-w-2xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div className="reveal" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#3d9be9', marginBottom: 12 }}>APPLY NOW</div>
              <h2 className="pub-heading reveal" style={{ fontSize: 36, color: '#071629', marginBottom: 12 }}>
                Lead a chapter at your university
              </h2>
              <p className="reveal reveal-delay-1" style={{ fontSize: 15, color: '#6e7591' }}>
                Fill this out and we&apos;ll be in touch within 48 hours.
              </p>
            </div>
            <div className="pub-card p-8 reveal reveal-delay-2" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <form className="space-y-5" action="mailto:hello@proplr.ae" method="GET">
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#071629', marginBottom: 6 }}>Your Name</label>
                  <input name="subject" className="pub-input" placeholder="Full name" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#071629', marginBottom: 6 }}>Email</label>
                  <input type="email" className="pub-input" placeholder="you@university.ac.ae" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#071629', marginBottom: 6 }}>University</label>
                  <input className="pub-input" placeholder="e.g. University of Dubai" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#071629', marginBottom: 6 }}>Year of Study</label>
                  <input className="pub-input" placeholder="e.g. Year 2" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#071629', marginBottom: 6 }}>Why do you want to lead a chapter?</label>
                  <textarea className="pub-input" rows={4} placeholder="Tell us about yourself and your motivation..." style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="pub-btn-primary w-full" style={{ marginTop: 8 }}>
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
