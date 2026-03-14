import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { ModuleViewerPage } from '@/components/courses/ModuleViewerPage';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string; moduleId: string }>;
}

export default async function ModuleViewerRoute({ params }: PageProps) {
  const { id: courseId, moduleId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch module
  const { data: mod } = await supabase
    .from('course_modules')
    .select('*')
    .eq('id', moduleId)
    .eq('course_id', courseId)
    .single();

  if (!mod) notFound();

  // Fetch all modules for this course (for prev/next navigation), ordered by sort_order
  const { data: allModules } = await supabase
    .from('course_modules')
    .select('id, title, sort_order')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true });

  const modules = allModules || [];
  const currentIndex = modules.findIndex((m) => m.id === moduleId);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  // Fetch quiz + questions + options for this module
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*')
    .eq('module_id', moduleId)
    .maybeSingle();

  let quizData: null | {
    id: string;
    pass_score: number;
    questions: {
      id: string;
      question: string;
      sort_order: number;
      options: { id: string; option_text: string; is_correct: boolean; sort_order: number }[];
    }[];
  } = null;

  if (quiz) {
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('sort_order', { ascending: true });

    const questionList = questions || [];
    const questionsWithOptions = await Promise.all(
      questionList.map(async (q) => {
        const { data: options } = await supabase
          .from('quiz_options')
          .select('*')
          .eq('question_id', q.id)
          .order('sort_order', { ascending: true });
        return { ...q, options: options || [] };
      })
    );

    quizData = {
      id: quiz.id,
      pass_score: quiz.pass_score ?? 80,
      questions: questionsWithOptions,
    };
  }

  // Fetch current user progress for this module
  const { data: progressRow } = await supabase
    .from('student_course_progress')
    .select('*')
    .eq('user_id', user!.id)
    .eq('course_id', courseId)
    .eq('module_id', moduleId)
    .maybeSingle();

  const currentStatus = progressRow?.status || 'not_started';

  // Fetch best quiz submission if quiz exists
  let bestSubmission: { score: number; passed: boolean } | null = null;
  if (quiz) {
    const { data: submissions } = await supabase
      .from('quiz_submissions')
      .select('score, passed')
      .eq('user_id', user!.id)
      .eq('quiz_id', quiz.id)
      .order('score', { ascending: false })
      .limit(1);

    if (submissions && submissions.length > 0) {
      bestSubmission = submissions[0];
    }
  }

  // Mark as in_progress if not already completed (server-side upsert)
  if (currentStatus === 'not_started') {
    await supabase.from('student_course_progress').upsert(
      {
        user_id: user!.id,
        course_id: courseId,
        module_id: moduleId,
        status: 'in_progress',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,course_id,module_id' }
    );
  }

  const effectiveStatus = currentStatus === 'not_started' ? 'in_progress' : currentStatus;

  return (
    <AppShell>
      <ModuleViewerPage
        courseId={courseId}
        module={mod}
        quizData={quizData}
        currentStatus={effectiveStatus}
        bestSubmission={bestSubmission}
        prevModule={prevModule ? { id: prevModule.id, title: prevModule.title } : null}
        nextModule={nextModule ? { id: nextModule.id, title: nextModule.title } : null}
      />
    </AppShell>
  );
}
