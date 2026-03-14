import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Profile, PillarHour, Badge, Certificate, PillarName } from '@/lib/types';
import { PILLARS } from '@/lib/types';

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all relevant data in parallel
  const [
    { data: profile },
    { data: pillarHours },
    { data: badges },
    { data: certificates },
    { data: taskCompletions },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('pillar_hours').select('*').eq('user_id', user.id).eq('status', 'approved'),
    supabase.from('badges').select('*').eq('user_id', user.id),
    supabase.from('certificates').select('*').eq('user_id', user.id),
    supabase.from('task_completions').select('*').eq('user_id', user.id),
  ]);

  const p = profile as Profile | null;

  // Aggregate approved hours by pillar
  const hoursMap = new Map<PillarName, number>();
  PILLARS.forEach((pillar) => hoursMap.set(pillar, 0));
  (pillarHours || []).forEach((ph: PillarHour) => {
    hoursMap.set(ph.pillar_name, (hoursMap.get(ph.pillar_name) || 0) + ph.hours);
  });

  const totalHours = Array.from(hoursMap.values()).reduce((a, b) => a + b, 0);
  const pillarBreakdown = PILLARS.map(
    (pillar) => `${pillar}: ${hoursMap.get(pillar) || 0} hours`
  ).join(', ');

  const badgeList = (badges as Badge[] || []).map((b) => b.badge_type).join(', ') || 'None yet';
  const certList =
    (certificates as Certificate[] || []).map((c) => c.pillar_name).join(', ') || 'None yet';
  const tasksCompleted = (taskCompletions || []).length;

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      summary:
        `${p?.name || 'This student'} is an active participant on the Proplr platform with ${totalHours} total approved pillar hours across various competency areas. ` +
        `They have earned ${(certificates || []).length} certificate(s) and ${(badges || []).length} badge(s), demonstrating consistent engagement and growth. ` +
        `Their career interests include ${(p?.career_interests || []).join(', ') || 'various fields'}, ` +
        `and they continue to build skills in leadership, entrepreneurship, and professional development.`,
    });
  }

  // Build the prompt
  const prompt = `You are a professional career advisor writing a portfolio summary for a student on Proplr, an educational platform focused on professional development through six pillars: Leadership, Entrepreneurship, Digital Literacy, Personal Branding, Communication, and Project Management.

Write a 2-3 paragraph professional portfolio summary for this student based on the following data:

Student Name: ${p?.name || 'Student'}
School: ${p?.school_name || 'Not specified'}
Grade: ${p?.grade || 'Not specified'}
Career Interests: ${(p?.career_interests || []).join(', ') || 'Not specified'}
Student Type: ${p?.type === 'school_student' ? 'School Student (Foundation Track)' : p?.type === 'uni_student' ? 'University Student (Impact Track)' : 'Student'}

Total Approved Pillar Hours: ${totalHours}
Hours Breakdown: ${pillarBreakdown}

Badges Earned: ${badgeList}
Certificates Earned: ${certList}
Tasks Completed: ${tasksCompleted}

Write a compelling, professional summary that highlights their strengths, dedication, and potential. Focus on concrete achievements and make it suitable for inclusion in a professional portfolio or university application. Do not make up achievements that are not reflected in the data. Be encouraging but accurate.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate summary' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const summary =
      data.content?.[0]?.text || 'Unable to generate summary at this time.';

    return NextResponse.json({ summary });
  } catch (err) {
    console.error('AI portfolio generation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
