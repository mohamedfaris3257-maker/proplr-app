import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { TasksPage } from '@/components/tasks/TasksPage';
import type { Profile } from '@/lib/types';

export const revalidate = 60;

export default async function TasksRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single();

  // Fetch tasks relevant to this user: all or individual
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .or(`target_type.eq.all,and(target_type.eq.individual,target_id.eq.${user!.id})`)
    .order('created_at', { ascending: false });

  // Fetch this user's completions
  const { data: completions } = await supabase
    .from('task_completions')
    .select('*')
    .eq('user_id', user!.id);

  return (
    <AppShell>
      <TasksPage
        currentUserId={user!.id}
        profile={profile as unknown as Profile}
        tasks={(tasks || []) as unknown as Parameters<typeof TasksPage>[0]['tasks']}
        completions={(completions || []) as unknown as Parameters<typeof TasksPage>[0]['completions']}
      />
    </AppShell>
  );
}
