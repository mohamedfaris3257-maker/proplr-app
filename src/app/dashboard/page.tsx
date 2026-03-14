import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import type { Profile } from '@/lib/types';

export const revalidate = 60;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth is handled by layout, but we still need the user for queries
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) return null;

  // Fetch all dashboard data in parallel
  const [
    { data: pillarHours },
    { data: badges },
    { data: certificates },
    { data: rsvps },
    { data: courses },
    { data: tasks },
    { data: taskCompletions },
    { data: events },
    { data: notifications },
  ] = await Promise.all([
    supabase
      .from('pillar_hours')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'approved'),
    supabase.from('badges').select('*').eq('user_id', user.id),
    supabase.from('certificates').select('*').eq('user_id', user.id),
    supabase.from('rsvps').select('*').eq('user_id', user.id),
    supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tasks')
      .select('*')
      .or(
        `target_type.eq.all,and(target_type.eq.individual,target_id.eq.${user.id})`
      )
      .order('created_at', { ascending: false }),
    supabase.from('task_completions').select('*').eq('user_id', user.id),
    supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(5),
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  // Fetch course-related data
  const activeCourses = courses || [];
  const courseIds = activeCourses.map((c: any) => c.id);

  let moduleCounts: Record<string, number> = {};
  let progressRows: any[] = [];
  let studentCounts: Record<string, number> = {};

  if (courseIds.length > 0) {
    const [{ data: modules }, { data: progress }, { data: enrollments }] =
      await Promise.all([
        supabase
          .from('course_modules')
          .select('id, course_id')
          .in('course_id', courseIds),
        supabase
          .from('student_course_progress')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('student_course_progress')
          .select('course_id, user_id')
          .in('course_id', courseIds),
      ]);

    for (const mod of modules || []) {
      moduleCounts[mod.course_id] = (moduleCounts[mod.course_id] || 0) + 1;
    }

    progressRows = progress || [];

    const usersByCourse: Record<string, Set<string>> = {};
    for (const e of enrollments || []) {
      if (!usersByCourse[e.course_id]) usersByCourse[e.course_id] = new Set();
      usersByCourse[e.course_id].add(e.user_id);
    }
    for (const [courseId, users] of Object.entries(usersByCourse)) {
      studentCounts[courseId] = users.size;
    }
  }

  const courseProgressMap: Record<string, number> = {};
  for (const course of activeCourses) {
    const total = moduleCounts[course.id] || 0;
    const completed = progressRows.filter(
      (p: any) => p.course_id === course.id && p.status === 'completed'
    ).length;
    courseProgressMap[course.id] = total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  const totalHours = (pillarHours || []).reduce(
    (sum: number, h: any) => sum + (h.hours || 0),
    0
  );
  const completedPillars = (certificates || []).length;

  const completionIds = new Set(
    (taskCompletions || []).map((c: any) => c.task_id)
  );
  const pendingTasks = (tasks || []).filter(
    (t: any) => !completionIds.has(t.id)
  );

  return (
    <DashboardClient
      profile={profile as Profile}
      totalHours={totalHours}
      badgeCount={(badges || []).length}
      completedPillars={completedPillars}
      eventsAttended={(rsvps || []).length}
      courses={activeCourses}
      courseProgressMap={courseProgressMap}
      moduleCounts={moduleCounts}
      studentCounts={studentCounts}
      pendingTasks={pendingTasks}
      upcomingEvents={(events || []) as any[]}
      notifications={(notifications || []) as any[]}
    />
  );
}
