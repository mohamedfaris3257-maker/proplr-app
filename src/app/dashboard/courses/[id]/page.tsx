import { createClient } from '@/lib/supabase/server';
import { CourseDetailPage } from '@/components/courses/CourseDetailPage';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailRoute({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the course
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (!course) notFound();

  // Fetch modules ordered by sort_order
  const { data: modules } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', id)
    .order('sort_order', { ascending: true });

  const courseModules = modules || [];

  // Fetch student progress for this course
  const { data: progressRows } = await supabase
    .from('student_course_progress')
    .select('*')
    .eq('user_id', user!.id)
    .eq('course_id', id);

  const progress = progressRows || [];

  // Fetch quiz existence per module
  const moduleIds = courseModules.map((m) => m.id);
  const quizModuleIds = new Set<string>();
  if (moduleIds.length > 0) {
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('module_id')
      .in('module_id', moduleIds);
    for (const q of quizzes || []) {
      quizModuleIds.add(q.module_id);
    }
  }

  // Calculate overall progress
  const completedCount = progress.filter((p) => p.status === 'completed').length;
  const totalCount = courseModules.length;
  const overallPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Build module progress map
  const moduleProgressMap: Record<string, string> = {};
  for (const p of progress) {
    moduleProgressMap[p.module_id] = p.status;
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <CourseDetailPage
        course={course}
        modules={courseModules}
        moduleProgressMap={moduleProgressMap}
        quizModuleIds={Array.from(quizModuleIds)}
        completedCount={completedCount}
        totalCount={totalCount}
        overallPercent={overallPercent}
      />
    </div>
  );
}
