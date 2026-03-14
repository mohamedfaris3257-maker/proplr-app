import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('type')
      .eq('user_id', user.id)
      .single();

    if (!profile || profile.type !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { module_id, module_content } = body as {
      module_id: string;
      module_content: string;
    };

    if (!module_id || !module_content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure quiz exists for module (creates if not)
    let { data: quiz } = await supabase
      .from('quizzes')
      .select('id')
      .eq('module_id', module_id)
      .maybeSingle();

    if (!quiz) {
      const { data: newQuiz, error: quizCreateError } = await supabase
        .from('quizzes')
        .insert({ module_id, pass_score: 80 })
        .select()
        .single();

      if (quizCreateError || !newQuiz) {
        return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
      }
      quiz = newQuiz;
    }

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found after creation' }, { status: 500 });
    }

    const confirmedQuiz = quiz;

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Based on this educational module content, generate exactly 5 multiple choice quiz questions. Each question must have 4 options with exactly one correct answer.

Module content:
${module_content.slice(0, 3000)}

Respond with ONLY valid JSON in this exact format:
[
  {
    "question": "Question text here?",
    "options": [
      { "text": "Option A", "is_correct": false },
      { "text": "Option B", "is_correct": true },
      { "text": "Option C", "is_correct": false },
      { "text": "Option D", "is_correct": false }
    ]
  }
]`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Anthropic API error:', errBody);
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.content[0].text as string;

    // Parse the JSON array from the response
    let questions: { question: string; options: { text: string; is_correct: boolean }[] }[];
    try {
      // Strip markdown code fences if present
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      questions = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse AI response:', content, parseErr);
      return NextResponse.json({ error: 'Failed to parse AI-generated questions' }, { status: 500 });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'AI returned no questions' }, { status: 500 });
    }

    // Get current question count for sort_order offset
    const { count: existingCount } = await supabase
      .from('quiz_questions')
      .select('id', { count: 'exact', head: true })
      .eq('quiz_id', confirmedQuiz.id);

    const sortOffset = existingCount ?? 0;

    // Insert each question and its options
    let inserted = 0;
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !Array.isArray(q.options)) continue;

      const { data: insertedQ, error: qError } = await supabase
        .from('quiz_questions')
        .insert({
          quiz_id: confirmedQuiz.id,
          question: q.question,
          sort_order: sortOffset + i,
        })
        .select()
        .single();

      if (qError || !insertedQ) continue;

      const optionRows = q.options.map((opt, oi) => ({
        question_id: insertedQ.id,
        option_text: opt.text,
        is_correct: opt.is_correct === true,
        sort_order: oi,
      }));

      await supabase.from('quiz_options').insert(optionRows);
      inserted += 1;
    }

    return NextResponse.json({ success: true, count: inserted });
  } catch (err) {
    console.error('Generate quiz route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
