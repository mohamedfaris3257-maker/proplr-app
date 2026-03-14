import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST() {
  // Authenticate the requesting user
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('type')
    .eq('user_id', user.id)
    .single();

  if (profile?.type !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const results: Record<string, string> = {};

  // ─── A) Create products table ──────────────────────────────────────
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS products (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          name text NOT NULL,
          description text,
          price_aed numeric(10,2) NOT NULL,
          image_url text,
          category text DEFAULT 'merch',
          stock integer DEFAULT 0,
          is_active boolean DEFAULT true,
          created_at timestamptz DEFAULT now()
        );
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Anyone can read products') THEN
            CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);
          END IF;
        END $$;
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin full access products') THEN
            CREATE POLICY "Admin full access products" ON products FOR ALL USING (true);
          END IF;
        END $$;
      `,
    });
    if (error) {
      results.products = `Error: ${error.message}`;
    } else {
      results.products = 'Products table created/verified';
    }
  } catch (err: unknown) {
    results.products = `Exception: ${err instanceof Error ? err.message : String(err)}`;
  }

  // ─── B) Add external_url column to opportunities ──────────────────
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      query: `ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS external_url text;`,
    });
    if (error) {
      results.opportunities_external_url = `Error: ${error.message}`;
    } else {
      results.opportunities_external_url = 'external_url column added/verified';
    }
  } catch (err: unknown) {
    results.opportunities_external_url = `Exception: ${err instanceof Error ? err.message : String(err)}`;
  }

  // ─── C) Insert default communities ────────────────────────────────
  try {
    const { count } = await supabaseAdmin
      .from('communities')
      .select('*', { count: 'exact', head: true });

    if (count === 0) {
      const defaultCommunities = [
        { name: 'Foundation', type: 'cohort', description: 'All Foundation program students', is_active: true },
        { name: 'Impact', type: 'cohort', description: 'All Impact program students', is_active: true },
        { name: 'Foundation Ambassadors', type: 'interest', description: 'Student ambassadors for the Foundation program', is_active: true },
        { name: 'Impact Ambassadors', type: 'interest', description: 'Student ambassadors for the Impact program', is_active: true },
      ];

      const { data: insertedCommunities, error: commInsertErr } = await supabaseAdmin
        .from('communities')
        .insert(defaultCommunities)
        .select('id');

      if (commInsertErr) {
        results.communities = `Error inserting: ${commInsertErr.message}`;
      } else {
        results.communities = `Inserted ${insertedCommunities?.length ?? 0} communities`;

        // Fetch admin profiles
        const { data: adminProfiles } = await supabaseAdmin
          .from('profiles')
          .select('user_id')
          .or('type.eq.admin,role.eq.admin');

        if (adminProfiles && adminProfiles.length > 0 && insertedCommunities) {
          const memberships: {
            community_id: string;
            user_id: string;
            role: string;
            status: string;
          }[] = [];

          for (const community of insertedCommunities) {
            for (const admin of adminProfiles) {
              memberships.push({
                community_id: community.id,
                user_id: admin.user_id,
                role: 'admin',
                status: 'approved',
              });
            }
          }

          const { error: memberErr } = await supabaseAdmin
            .from('community_members')
            .insert(memberships);

          if (memberErr) {
            results.community_admins = `Error adding admins: ${memberErr.message}`;
          } else {
            results.community_admins = `Added ${adminProfiles.length} admin(s) to ${insertedCommunities.length} communities`;
          }
        } else {
          results.community_admins = 'No admin profiles found to add';
        }
      }
    } else {
      results.communities = `Skipped (${count} communities already exist)`;
    }
  } catch (err: unknown) {
    results.communities = `Exception: ${err instanceof Error ? err.message : String(err)}`;
  }

  // ─── D) Insert FAQs ──────────────────────────────────────────────
  try {
    const { count } = await supabaseAdmin
      .from('faqs')
      .select('*', { count: 'exact', head: true });

    if ((count ?? 0) < 5) {
      const faqs = [
        // About the Program
        { question: 'What is Proplr?', answer: 'Proplr is a KHDA-certified co-curricular career development program for students in Grades 8\u201312 and university. We build career-ready skills through six development pillars: Leadership, Entrepreneurship, Digital Literacy, Personal Branding, Communication, and Project Management.', category: 'About the Program', order_index: 1, is_published: true },
        { question: 'How is Proplr different from other programs?', answer: 'Unlike traditional tutoring or extracurriculars, Proplr connects students directly with industry professionals, real challenges from real companies, and a portfolio of verified experiences. Every pillar is KHDA-certified, meaning your progress is officially recognized.', category: 'About the Program', order_index: 2, is_published: true },
        { question: 'Who is Proplr for?', answer: 'We serve two tracks: Foundation (Grades 8\u201312) runs as an after-school club inside your school. Impact (University) is a semester-based industry immersion program.', category: 'About the Program', order_index: 3, is_published: true },
        { question: 'What are the six pillars?', answer: 'Leadership, Entrepreneurship, Digital Literacy, Personal Branding, Communication, and Project Management. Each pillar has its own certificate upon completion of 50 verified hours.', category: 'About the Program', order_index: 4, is_published: true },
        { question: 'Is Proplr accredited?', answer: 'Yes. Proplr is licensed by the Knowledge and Human Development Authority (KHDA) under Permit #633441. All six pillar certificates carry official KHDA attestation.', category: 'About the Program', order_index: 5, is_published: true },
        { question: 'Where does Proplr operate?', answer: 'Currently across schools and universities in the UAE, with plans to expand regionally.', category: 'About the Program', order_index: 6, is_published: true },

        // Enrollment & Pricing
        { question: 'How do I sign up?', answer: 'Visit proplr.ae and click Get Started. Create an account with your email, and your school coordinator or our team will guide you through onboarding.', category: 'Enrollment & Pricing', order_index: 7, is_published: true },
        { question: 'How much does Proplr cost?', answer: 'Foundation (K\u201312): AED 400/month. Impact (University): AED 999 flat fee per semester. Scholarships and referral discounts are available.', category: 'Enrollment & Pricing', order_index: 8, is_published: true },
        { question: 'Can I try before I commit?', answer: 'We offer school intro sessions and a free Compass career assessment. These give you a feel for the program before you enroll.', category: 'Enrollment & Pricing', order_index: 9, is_published: true },
        { question: 'Are there scholarships or discounts?', answer: 'Yes. We offer referral discounts, early-bird pricing, and need-based support. Ask your school coordinator or email us at hello@proplr.ae.', category: 'Enrollment & Pricing', order_index: 10, is_published: true },
        { question: 'What is the refund policy?', answer: 'Refunds are available within the first 14 days of enrollment. After that, your spot is secured for the full term.', category: 'Enrollment & Pricing', order_index: 11, is_published: true },

        // KHDA & Certification
        { question: 'What does KHDA certification mean?', answer: 'KHDA is the Dubai government authority overseeing education quality. Our certification means your Proplr certificates are officially recognized and carry weight with universities and employers.', category: 'KHDA & Certification', order_index: 12, is_published: true },
        { question: 'How do I earn a certificate?', answer: 'Complete 50 verified hours in any pillar through sessions, tasks, and industry activities. Once approved, your certificate is issued with KHDA attestation.', category: 'KHDA & Certification', order_index: 13, is_published: true },
        { question: 'Can I put Proplr certificates on my CV?', answer: 'Absolutely. Each certificate is KHDA-attested and designed to be shared on your CV, LinkedIn, and university applications.', category: 'KHDA & Certification', order_index: 14, is_published: true },
        { question: 'How many certificates can I earn?', answer: 'Up to six \u2014 one for each pillar. Students who complete all six earn a full Proplr Graduate credential.', category: 'KHDA & Certification', order_index: 15, is_published: true },

        // Schools & Clubs
        { question: 'How does a school start a Proplr club?', answer: 'Visit our Start a Club page and submit the interest form. Our team will contact you within 48 hours to schedule a free intro session.', category: 'Schools & Clubs', order_index: 16, is_published: true },
        { question: 'Does the school need to pay?', answer: 'The school hosts the club; students pay individually. Schools receive a free Compass pilot and ongoing support from our team.', category: 'Schools & Clubs', order_index: 17, is_published: true },
        { question: 'What does a typical club session look like?', answer: 'Sessions run 60\u201390 minutes after school, covering pillar activities like guest panels, hackathons, leadership workshops, and portfolio reviews.', category: 'Schools & Clubs', order_index: 18, is_published: true },
        { question: 'Can parents get involved?', answer: 'Yes! We host parent engagement events and provide regular progress updates. Parents can also track their child\u2019s pillar progress through the platform.', category: 'Schools & Clubs', order_index: 19, is_published: true },

        // Compass
        { question: 'What is Compass?', answer: 'Compass is our AI-powered career assessment tool. In 30\u201345 minutes, it maps your interests, strengths, and personality to career clusters and gives you a personalized report.', category: 'Compass', order_index: 20, is_published: true },
        { question: 'Is Compass free?', answer: 'It\u2019s free for Proplr members and schools doing a pilot. Individual assessments are available at a separate price.', category: 'Compass', order_index: 21, is_published: true },
        { question: 'What do I get from Compass?', answer: 'A detailed report with your top career clusters, recommended Proplr pathways, and actionable next steps \u2014 all personalized to you.', category: 'Compass', order_index: 22, is_published: true },
        { question: 'Can schools use Compass?', answer: 'Yes. We offer a free Compass pilot for any school considering a Proplr club. Contact us to set it up.', category: 'Compass', order_index: 23, is_published: true },

        // Summer Camp
        { question: 'What is the Proplr Summer Camp?', answer: 'A 1\u20132 week intensive experience covering all six pillars, designed to prepare students before the September program launch. Think of it as a taster of the full Foundation year.', category: 'Summer Camp', order_index: 24, is_published: true },
        { question: 'Who can attend the Summer Camp?', answer: 'Students entering Grades 8\u201312 in September. No prior Proplr membership needed.', category: 'Summer Camp', order_index: 25, is_published: true },
        { question: 'Does the Summer Camp count toward pillar hours?', answer: 'Yes. Hours earned during camp count toward your pillar progress and certificates.', category: 'Summer Camp', order_index: 26, is_published: true },

        // Platform & Account
        { question: 'How do I log in to the platform?', answer: 'Go to proplr.ae and click Sign In. Use the email and password you registered with.', category: 'Platform & Account', order_index: 27, is_published: true },
        { question: 'Can I reset my password?', answer: 'Yes. Click Forgot Password on the login page and follow the email instructions.', category: 'Platform & Account', order_index: 28, is_published: true },
        { question: 'How do I contact support?', answer: 'Email us at hello@proplr.ae or message us on Instagram @proplr.ae. We typically respond within 24 hours.', category: 'Platform & Account', order_index: 29, is_published: true },
        { question: 'Is my data safe?', answer: 'Yes. We use industry-standard encryption and comply with UAE data protection regulations. Your information is never shared with third parties without consent.', category: 'Platform & Account', order_index: 30, is_published: true },
      ];

      const { error: faqErr } = await supabaseAdmin.from('faqs').insert(faqs);
      if (faqErr) {
        results.faqs = `Error inserting: ${faqErr.message}`;
      } else {
        results.faqs = `Inserted ${faqs.length} FAQs`;
      }
    } else {
      results.faqs = `Skipped (${count} FAQs already exist)`;
    }
  } catch (err: unknown) {
    results.faqs = `Exception: ${err instanceof Error ? err.message : String(err)}`;
  }

  // ─── E) Create House Rules course ─────────────────────────────────
  try {
    const { data: existingCourse } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('title', 'House Rules & Community Guidelines')
      .maybeSingle();

    if (!existingCourse) {
      // Create the course
      const { data: course, error: courseErr } = await supabaseAdmin
        .from('courses')
        .insert({
          title: 'House Rules & Community Guidelines',
          slug: 'house-rules-community-guidelines',
          description: 'Learn the rules and expectations for being part of the Proplr community',
          pillar_tag: null,
          audience: 'both',
          is_active: true,
          sort_order: 0,
        })
        .select('id')
        .single();

      if (courseErr || !course) {
        results.course = `Error creating course: ${courseErr?.message}`;
      } else {
        // Create the module
        const moduleContent = `Welcome to Proplr! Here are the community guidelines every member must follow:

1. RESPECT EVERYONE - Treat all members, mentors, and staff with respect. Discrimination, bullying, or harassment of any kind will not be tolerated.

2. BE PROFESSIONAL - This is a career development platform. Keep all posts, comments, and interactions professional and constructive.

3. SHOW UP AND PARTICIPATE - Attend your scheduled sessions. If you can't make it, notify your coordinator in advance. Consistent no-shows may affect your standing.

4. PROTECT PRIVACY - Never share personal information about other members without their consent. What's shared in sessions stays in sessions.

5. NO PLAGIARISM - All portfolio submissions, projects, and task completions must be your own work. AI tools can assist, but the thinking must be yours.

6. BE HONEST WITH HOURS - Only log hours for activities you actually completed. Fraudulent hour logging will result in removal from the program.

7. USE THE PLATFORM RESPONSIBLY - Don't spam the community feed, misuse the messaging system, or create fake accounts.

8. REPRESENT PROPLR WELL - As a member, you represent the Proplr community. Be an ambassador for positive change in your school and community.

9. REPORT ISSUES - If you see something that violates these guidelines, report it to your coordinator or email conduct@proplr.ae.

10. HAVE FUN AND GROW - This program is about discovering your potential. Take risks, try new things, and support each other along the way.

Violation of these guidelines may result in warnings, suspension, or removal from the program depending on severity.`;

        const { data: mod, error: modErr } = await supabaseAdmin
          .from('course_modules')
          .insert({
            course_id: course.id,
            title: 'Proplr Community Guidelines',
            content: moduleContent,
            sort_order: 0,
          })
          .select('id')
          .single();

        if (modErr || !mod) {
          results.course = `Course created but module failed: ${modErr?.message}`;
        } else {
          // Create the quiz
          const { data: quiz, error: quizErr } = await supabaseAdmin
            .from('course_quizzes')
            .insert({
              course_id: course.id,
              module_id: mod.id,
              pass_score: 80,
            })
            .select('id')
            .single();

          if (quizErr || !quiz) {
            results.course = `Course + module created but quiz failed: ${quizErr?.message}`;
          } else {
            // Create quiz questions
            const questions = [
              {
                quiz_id: quiz.id,
                question_text: 'What should you do if you can\'t attend a scheduled session?',
                options: [
                  'Skip without telling anyone',
                  'Post about it on social media',
                  'Notify your coordinator in advance',
                  'Ask someone else to pretend to be you',
                ],
                correct_index: 2,
                sort_order: 0,
              },
              {
                quiz_id: quiz.id,
                question_text: 'Is it okay to use AI tools for portfolio submissions?',
                options: [
                  'No, AI is completely banned',
                  'Yes, AI can assist but the thinking must be yours',
                  'Yes, you can submit AI-generated work as your own',
                  'Only if your coordinator approves each submission',
                ],
                correct_index: 1,
                sort_order: 1,
              },
              {
                quiz_id: quiz.id,
                question_text: 'How many verified hours do you need to earn a pillar certificate?',
                options: [
                  '25 hours',
                  '50 hours',
                  '100 hours',
                  '10 hours',
                ],
                correct_index: 1,
                sort_order: 2,
              },
              {
                quiz_id: quiz.id,
                question_text: 'What should you do if you see someone violating community guidelines?',
                options: [
                  'Ignore it',
                  'Confront them publicly',
                  'Report it to your coordinator or email conduct@proplr.ae',
                  'Post about it on the community feed',
                ],
                correct_index: 2,
                sort_order: 3,
              },
              {
                quiz_id: quiz.id,
                question_text: 'Which of these is NOT one of Proplr\'s six pillars?',
                options: [
                  'Leadership',
                  'Marketing',
                  'Communication',
                  'Entrepreneurship',
                ],
                correct_index: 1,
                sort_order: 4,
              },
            ];

            const { error: qErr } = await supabaseAdmin
              .from('quiz_questions')
              .insert(questions);

            if (qErr) {
              results.course = `Course + module + quiz created but questions failed: ${qErr?.message}`;
            } else {
              results.course = 'Created course, module, quiz, and 5 questions';
            }
          }
        }
      }
    } else {
      results.course = 'Skipped (course already exists)';
    }
  } catch (err: unknown) {
    results.course = `Exception: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json({ success: true, results });
}
