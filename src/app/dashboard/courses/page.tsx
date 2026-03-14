import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { CoursesPage } from '@/components/courses/CoursesPage';

export const revalidate = 60;

export default async function CoursesRoute() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all active courses ordered by sort_order
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const activeCourses = courses || [];

  // Fetch module counts per course
  const moduleCounts: Record<string, number> = {};
  if (activeCourses.length > 0) {
    const courseIds = activeCourses.map((c) => c.id);
    const { data: modules } = await supabase
      .from('course_modules')
      .select('id, course_id')
      .in('course_id', courseIds);

    for (const mod of modules || []) {
      moduleCounts[mod.course_id] = (moduleCounts[mod.course_id] || 0) + 1;
    }
  }

  // Fetch student progress for current user across all courses
  const { data: progressRows } = await supabase
    .from('student_course_progress')
    .select('*')
    .eq('user_id', user!.id);

  const progress = progressRows || [];

  // Calculate progress per course
  const courseProgressMap: Record<string, { completed: number; total: number; percent: number }> = {};
  for (const course of activeCourses) {
    const total = moduleCounts[course.id] || 0;
    const completed = progress.filter(
      (p) => p.course_id === course.id && p.status === 'completed'
    ).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    courseProgressMap[course.id] = { completed, total, percent };
  }

  return (
    <AppShell>
      <CoursesPage
        courses={activeCourses}
        courseProgressMap={courseProgressMap}
        moduleCounts={moduleCounts}
      />
    </AppShell>
  );
}
