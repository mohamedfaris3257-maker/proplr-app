import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const revalidate = 300;
export const metadata: Metadata = { title: 'FAQ - Proplr', description: 'Everything you need to know about Proplr.' };

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

export default async function FaqPage() {
  const supabase = await createClient();
  const { data: faqs } = await supabase
    .from('faqs')
    .select('id, question, answer, category')
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  const items = (faqs ?? []) as Faq[];

  // Group by category
  const groups = new Map<string, Faq[]>();
  for (const faq of items) {
    const cat = faq.category ?? 'General';
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(faq);
  }

  // Static fallback FAQs shown when DB is empty
  const STATIC_FAQS: { category: string; items: { q: string; a: string }[] }[] = [
    {
      category: 'About the Program',
      items: [
        { q: 'What is Proplr?', a: "Proplr is a KHDA-certified student development platform running co-curricular programs inside schools (Proplr Foundation, Grades 8-12) and universities (Proplr Impact). It's not an online course platform -it's an experiential club-based program with real mentors, real industry challenges, and KHDA-certified certificates." },
        { q: 'What are the 6 pillars?', a: 'Leadership, Entrepreneurship, Digital Literacy, Personal Branding, Communication, and Project Management. Every student completes all 6 across the academic year.' },
        { q: 'How long is the program?', a: 'Foundation runs for one academic year -approximately 8 months (September to April), organized into three trimesters. Impact follows a similar structure.' },
        { q: 'Is this a school subject or an after-school club?', a: "It's a co-curricular program -typically delivered as an after-school club or integrated co-curricular module. It runs alongside your regular academics without disrupting them." },
        { q: 'When does the program start?', a: 'The 2025-2026 program begins September 2026. Registration is open now.' },
      ],
    },
    {
      category: 'Enrollment & Pricing',
      items: [
        { q: 'How much does it cost?', a: 'Visit our pricing page at /pricing for the latest Foundation and Impact pricing. Compass is a separate standalone product - see the Compass page for details.' },
        { q: 'Can I pay monthly?', a: 'Yes. Foundation can be paid monthly or as an upfront annual payment. See /pricing for details.' },
        { q: 'Do you offer discounts?', a: 'We have a referral program -if someone referred you, enter their code during registration. We also run promotional pricing periodically. Follow @proplrae for announcements.' },
        { q: "What if my school doesn't run a Proplr club?", a: "You can still register. Contact us at hello@proplr.ae and we'll help connect you with the nearest available program, or we can work with your school to start a club." },
        { q: "What's the refund policy?", a: 'Contact hello@proplr.ae within 14 days of enrollment for a full refund before the program begins. Once sessions have started, refunds are handled case by case.' },
      ],
    },
    {
      category: 'KHDA & Certification',
      items: [
        { q: 'Is Proplr KHDA certified?', a: 'Yes. Proplr is a licensed education provider in Dubai under KHDA Permit #633441.' },
        { q: 'What certificates do students receive?', a: 'Students receive 6 Proplr Certificates of Completion -one per pillar -endorsed by Proplr and attested by KHDA. These are recognized by UAE universities and employers.' },
        { q: 'Are the certificates useful for university applications?', a: 'Yes. KHDA-attested certificates demonstrate verified co-curricular achievement and are recognized across the UAE. They\'re a meaningful addition to any university application or CV.' },
        { q: 'Does Proplr align with UAE national education priorities?', a: "Yes -our program is designed around Dubai's E33 goals, UAE AI Strategy 2031, and the Rahhal framework for recognized real-world learning." },
      ],
    },
    {
      category: 'Schools & Clubs',
      items: [
        { q: 'How does a school start a Proplr club?', a: 'Submit your interest at /start-a-club. We\'ll reach out within 48 hours to discuss implementation. We handle the facilitators, mentors, industry connections, and reporting -schools provide the space and students.' },
        { q: 'What does Proplr provide to schools?', a: "Facilitators, industry mentors, program content, KHDA-aligned reporting, attendance and portfolio tracking, and National Showcase access. Schools don't need to hire or source anything." },
        { q: 'Is there a free trial for schools?', a: 'Yes -we offer a free Compass Career Assessment pilot for a sample cohort of Grades 8-10. No commitment required.' },
        { q: 'Can parents attend any program events?', a: 'Yes. Parent Engagement Events are a core part of the program. The National Showcase is also open to parents.' },
      ],
    },
    {
      category: 'Compass',
      items: [
        { q: 'What is Compass?', a: 'Compass is an AI-powered Career Indicator Assessment -a standalone paid product that helps students discover their career direction in 30-45 minutes. It uses a 3-Path Match Model to generate a personalized career report.' },
        { q: 'Is Compass included with my enrollment?', a: 'Yes -both Foundation and Impact enrollments include a Compass assessment at the start of the year and a reassessment at graduation.' },
        { q: 'Can I buy Compass without enrolling in Foundation or Impact?', a: 'Yes. Compass is available as a standalone product. See /compass for details and pricing.' },
        { q: 'Who is Compass for?', a: 'Students from Grade 8 upward, parents who want to support their child\'s career exploration, and schools wanting cohort-level career insights.' },
      ],
    },
    {
      category: 'Summer Camp',
      items: [
        { q: 'What is the Proplr Summer Camp?', a: "An intensive pre-program summer experience for students in Grades 8-12. It includes career discovery sessions, industry speakers, hands-on challenges, and a full Compass assessment. It's a great way to try Proplr before committing to the full Foundation year." },
        { q: 'Do I need to be enrolled in Foundation to attend Summer Camp?', a: "No. Summer Camp is open to any student in Grades 8-12, regardless of whether their school has a Proplr club." },
        { q: 'When is Summer Camp 2026?', a: 'Dates to be confirmed. Register your interest at /summer-camp and we\'ll notify you as soon as dates are announced.' },
      ],
    },
  ];

  const hasData = items.length > 0;

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', padding: '152px 24px 56px' }}>
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="pub-heading reveal" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#071629', marginBottom: 12 }}>
            Questions? We&apos;ve got answers.
          </h1>
          <p className="reveal reveal-delay-1" style={{ color: '#6e6e73', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
            If you don&apos;t find what you&apos;re looking for, email <a href="mailto:hello@proplr.ae" style={{ color: '#3d9be9' }}>hello@proplr.ae</a>
          </p>
        </div>
      </section>

      {/* ── FAQS ─────────────────────────────────────────── */}
      <section style={{ background: '#f5f5f7', padding: '48px 24px 80px' }}>
        <div className="max-w-[760px] mx-auto space-y-12">
          {hasData ? (
            Array.from(groups.entries()).map(([category, categoryFaqs]) => (
              <div key={category} className="reveal">
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#3d9be9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                  {category}
                </h2>
                <div className="space-y-3">
                  {categoryFaqs.map((faq) => (
                    <details key={faq.id} className="pub-card" style={{ border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                      <summary style={{ padding: '18px 24px', cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#1d1d1f' }}>
                        <span style={{ paddingRight: 16 }}>{faq.question}</span>
                        <span style={{ color: '#3d9be9', flexShrink: 0, fontSize: 18 }}>+</span>
                      </summary>
                      <p style={{ padding: '0 24px 18px', color: '#6e6e73', fontSize: 14, lineHeight: 1.75 }}>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))
          ) : (
            STATIC_FAQS.map((group, gi) => (
              <div key={group.category} className={`reveal reveal-delay-${gi % 3}`}>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#3d9be9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                  {group.category}
                </h2>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <details key={item.q} className="pub-card" style={{ border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                      <summary style={{ padding: '18px 24px', cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#1d1d1f' }}>
                        <span style={{ paddingRight: 16 }}>{item.q}</span>
                        <span style={{ color: '#3d9be9', flexShrink: 0, fontSize: 18 }}>+</span>
                      </summary>
                      <p style={{ padding: '0 24px 18px', color: '#6e6e73', fontSize: 14, lineHeight: 1.75 }}>{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── STILL HAVE QUESTIONS ─────────────────────────── */}
      <section style={{ background: '#071629', padding: '64px 24px' }}>
        <div className="max-w-[1200px] mx-auto text-center reveal">
          <h2 className="pub-heading text-white" style={{ fontSize: 'clamp(22px, 3vw, 34px)', marginBottom: 12 }}>Still have questions?</h2>
          <p style={{ color: '#8ca3be', fontSize: 16, marginBottom: 28 }}>We&apos;re happy to help -reach out directly.</p>
          <a href="mailto:hello@proplr.ae" className="pub-btn-primary">Email us →</a>
        </div>
      </section>
    </div>
  );
}
