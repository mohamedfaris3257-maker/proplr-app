import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ClubInterestForm } from '@/components/public/ClubInterestForm';

export const metadata: Metadata = {
  title: 'Start a Proplr Club | Bring Career Development to Your School',
  description: 'Launch a Proplr Foundation club at your school in the UAE. KHDA-certified program, fully supported by Proplr.',
};

export default function StartAClubPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #071629 0%, #1a3a5c 100%)', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(61,155,233,0.15) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,203,93,0.15)', border: '1px solid rgba(255,203,93,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffcb5d', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ffcb5d', letterSpacing: 1.5 }}>FOR SCHOOLS IN THE UAE</span>
          </div>
          <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#ffffff', marginBottom: 20, lineHeight: 1.15 }}>
            Bring Proplr to<br />Your School
          </h1>
          <p className="reveal reveal-delay-1" style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Launch a KHDA-certified after-school career club. We handle the curriculum, mentors, and certification. You just open the door.
          </p>
          <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#apply" className="pub-btn-primary" style={{ background: '#ffcb5d', color: '#071629' }}>
              Get Started
            </a>
            <a href="#how-it-works" className="pub-btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section style={{ background: '#f0f2f8', padding: '24px', display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        {['KHDA Permit #633441', 'Fully Supported Setup', 'No Cost to Schools', 'Inspection-Ready'].map(badge => (
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
            From interest to club in 4 steps
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {[
            { step: '01', title: 'Submit Interest', desc: 'Fill out the form below. We\'ll reach out within 48 hours to schedule a call.' },
            { step: '02', title: 'School Briefing', desc: 'We meet with your admin team and walk through the program, KHDA compliance, and logistics.' },
            { step: '03', title: 'Club Setup', desc: 'We handle student enrollment, parent consent, scheduling, and all KHDA documentation.' },
            { step: '04', title: 'Program Runs', desc: 'Students attend weekly sessions. Proplr delivers everything. Your school gets the credit.' },
          ].map((item, i) => (
            <div key={item.step} className={`reveal reveal-delay-${(i % 4) + 1}`} style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid rgba(7,22,41,0.08)' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 32, fontWeight: 900, color: 'rgba(61,155,233,0.2)', marginBottom: 12 }}>{item.step}</div>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 700, color: '#071629', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13.5, color: '#6e7591', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT SCHOOLS GET ── */}
      <section style={{ background: '#071629', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="reveal" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#ffcb5d', marginBottom: 12 }}>WHAT YOUR SCHOOL GETS</div>
            <h2 className="pub-heading reveal" style={{ fontSize: 36, color: '#fff' }}>
              Everything. We handle it all.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { title: 'KHDA Compliance', desc: 'Full documentation, permits, and inspection-ready reports handled by Proplr.' },
              { title: 'Curriculum Delivered', desc: '6 pillars, 120 hours, assessments, and all session materials provided.' },
              { title: '150+ Mentors', desc: 'Industry professionals from 40+ sectors come to your students.' },
              { title: 'Student Certificates', desc: 'Every student earns KHDA-attested certificates upon completion.' },
              { title: 'Parent Reporting', desc: 'Monthly progress reports sent automatically to parents.' },
              { title: 'Zero School Cost', desc: 'Proplr is funded through student enrollment, not school budgets.' },
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
              <div className="reveal" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#3d9be9', marginBottom: 12 }}>GET STARTED</div>
              <h2 className="pub-heading reveal" style={{ fontSize: 36, color: '#071629', marginBottom: 12 }}>
                Bring Proplr to your school
              </h2>
              <p className="reveal reveal-delay-1" style={{ fontSize: 15, color: '#6e7591' }}>
                Fill this out and we&apos;ll be in touch within 48 hours.
              </p>
            </div>
            <div className="pub-card p-8 reveal reveal-delay-2" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <ClubInterestForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
