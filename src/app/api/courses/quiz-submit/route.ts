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

    const body = await req.json();
    const { quiz_id, answers } = body as {
      quiz_id: string;
      answers: Record<string, string>; // { question_id: option_id }
    };

    if (!quiz_id || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch quiz to get pass_score and module_id
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('id, pass_score, module_id')
      .eq('id', quiz_id)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Fetch all questions with their options
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('id, quiz_id')
      .eq('quiz_id', quiz_id);

    if (questionsError || !questions) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }

    const total = questions.length;
    if (total === 0) {
      return NextResponse.json({ error: 'Quiz has no questions' }, { status: 400 });
    }

    // For each question, check if the selected option is correct
    let correct = 0;
    for (const question of questions) {
      const selectedOptionId = answers[question.id];
      if (!selectedOptionId) continue;

      const { data: option } = await supabase
        .from('quiz_options')
        .select('is_correct')
        .eq('id', selectedOptionId)
        .eq('question_id', question.id)
        .maybeSingle();

      if (option?.is_correct) {
        correct += 1;
      }
    }

    const score = Math.round((correct / total) * 100);
    const passScore = quiz.pass_score ?? 80;
    const passed = score >= passScore;

    // Insert quiz submission
    const { error: submissionError } = await supabase.from('quiz_submissions').insert({
      user_id: user.id,
      quiz_id,
      score,
      passed,
      answers,
      submitted_at: new Date().toISOString(),
    });

    if (submissionError) {
      console.error('Quiz submission insert error:', submissionError);
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }

    // If passed, also mark the module as completed
    if (passed && quiz.module_id) {
      // First get the course_id from the module
      const { data: mod } = await supabase
        .from('course_modules')
        .select('course_id')
        .eq('id', quiz.module_id)
        .maybeSingle();

      if (mod?.course_id) {
        await supabase.from('student_course_progress').upsert(
          {
            user_id: user.id,
            course_id: mod.course_id,
            module_id: quiz.module_id,
            status: 'completed',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,course_id,module_id' }
        );
      }
    }

    return NextResponse.json({ score, passed, correct, total });
  } catch (err) {
    console.error('Quiz submit route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
