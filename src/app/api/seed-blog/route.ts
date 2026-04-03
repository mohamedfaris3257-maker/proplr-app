import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const BLOG_POSTS = [
  {
    title: 'How to Get an Internship in Dubai at 16',
    slug: 'how-to-get-an-internship-in-dubai-at-16',
    excerpt:
      'Think you need to be 18 to start gaining real work experience? Think again. Here are practical steps students in Grades 8-12 can take right now to land meaningful industry exposure in Dubai.',
    content: `Getting an internship as a high school student in Dubai might seem impossible, but it's more accessible than you think. The key is knowing where to look and how to position yourself.

**Start with what you have.** You don't need a degree or years of experience. What matters is showing initiative, curiosity, and a willingness to learn. Build a simple portfolio of projects — even school projects count if you present them well.

**Leverage school connections.** Many schools in Dubai have career counseling departments and industry partnerships. Ask your teachers and counselors about co-curricular programs and industry exposure opportunities.

**Join structured programs.** Programs like Proplr Foundation give students direct access to industry mentors, real-world challenges, and structured work experience — all KHDA-certified and designed specifically for Grades 8-12.

**Use LinkedIn (yes, even at 16).** Create a professional LinkedIn profile. Follow companies you're interested in. Engage with content from professionals in your target industry. Many opportunities in Dubai come through networking, not job boards.

**Think beyond traditional internships.** Job shadowing, micro-placements, and volunteer projects all count as meaningful experience. The goal isn't a full-time position — it's exposure and learning.

**Build your digital presence.** A personal website or portfolio showcasing your work makes you stand out. It shows initiative and gives employers something tangible to evaluate.

The students who start building their careers at 16 have a massive advantage by the time they reach university. Don't wait for permission to start.`,
    published: true,
  },
  {
    title: 'What is KHDA Certification and Why It Matters',
    slug: 'what-is-khda-certification-and-why-it-matters',
    excerpt:
      'KHDA certification is the gold standard for education providers in Dubai. Here is what it actually means for students, parents, and the certificates you earn.',
    content: `If you're a parent or student in Dubai, you've probably seen "KHDA Certified" on various education providers. But what does it actually mean?

**KHDA stands for the Knowledge and Human Development Authority.** It's the regulatory body that oversees private education in Dubai — from schools and universities to training centers and co-curricular programs.

**What KHDA certification means.** When an education provider is KHDA-certified, it means they have been licensed and inspected by Dubai's education authority. Their programs meet quality standards set by the government. Their certificates carry official weight.

**Why it matters for students.** KHDA-attested certificates are recognized by UAE universities and employers. They demonstrate verified learning, not just participation. When you add a KHDA certificate to your CV or university application, admissions officers and hiring managers know it's legitimate.

**Why it matters for parents.** KHDA licensing gives parents confidence that their child is enrolled in a program that meets government standards. It means the provider has been vetted, their facilitators are qualified, and their curriculum has been reviewed.

**Not all certificates are equal.** A certificate from an unregulated online platform and a KHDA-attested certificate are fundamentally different. One is a PDF anyone can generate. The other is backed by Dubai's education authority.

**Proplr's KHDA status.** Proplr operates under KHDA Permit #633441. Every certificate issued through the Foundation and Impact programs is KHDA-attested, meaning it carries the same regulatory weight as certificates from licensed schools and universities.

When choosing an education provider for your child, always check their KHDA status. It's the simplest way to separate quality from noise.`,
    published: true,
  },
  {
    title: 'Proplr vs Traditional Tutoring: What Actually Prepares Students for the Future',
    slug: 'proplr-vs-traditional-tutoring',
    excerpt:
      'Traditional tutoring helps with exams. But exams alone do not prepare students for careers. Here is how experiential learning programs compare to conventional academic support.',
    content: `Every year, families in Dubai spend thousands of dirhams on private tutoring. And for what it's designed to do — improve exam scores — it works. But there's a growing gap between academic performance and career readiness.

**The tutoring model is reactive.** It helps students pass exams they're already struggling with. It doesn't teach them skills employers actually want: leadership, communication, project management, digital literacy, or how to work in a team under pressure.

**The experiential learning model is proactive.** Programs like Proplr don't replace school — they complement it. Instead of memorizing textbook content, students work on real industry challenges, present to professionals, and build portfolios of actual work.

**What employers actually look for.** Ask any hiring manager what they value most in a fresh graduate. It's rarely GPA. It's communication skills, initiative, teamwork, and evidence of real-world experience. These are exactly what co-curricular programs develop.

**Certificates that matter.** A tutoring center might give your child a completion certificate. A KHDA-certified co-curricular program gives them 6 attested certificates across leadership, entrepreneurship, digital literacy, communication, personal branding, and project management.

**The portfolio advantage.** When two university applicants have similar grades, the one with a verified portfolio of industry projects, mentorship experiences, and a National Showcase presentation wins every time.

**It's not either/or.** The smartest approach is combining academic support with career development. Keep your tutoring if your child needs it for specific subjects. But add experiential learning to give them the skills and evidence that actually set them apart.

The world has changed. Education needs to change with it. The students who only study for exams will be outcompeted by the ones who also build, create, and lead.`,
    published: true,
  },
];

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed route disabled in production' }, { status: 403 });
  }

  const supabase = await createClient();

  const results = [];
  for (const post of BLOG_POSTS) {
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(
        {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          published: post.published,
        },
        { onConflict: 'slug' }
      )
      .select();

    results.push({ slug: post.slug, data, error: error?.message });
  }

  return NextResponse.json({ results });
}
