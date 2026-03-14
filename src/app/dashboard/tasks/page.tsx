import { createClient } from '@/lib/supabase/server';
import { TasksPage } from '@/components/tasks/TasksPage';
import type { Profile } from '@/lib/types';

export const revalidate = 60;

export default async function TasksRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .or(`target_type.eq.all,and(target_type.eq.individual,target_id.eq.${user.id})`)
    .order('created_at', { ascending: false });

  const { data: completions } = await supabase
    .from('task_completions')
    .select('*')
    .eq('user_id', user.id);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <TasksPage
        currentUserId={user.id}
        profile={profile as unknown as Profile}
        tasks={(tasks || []) as unknown as Parameters<typeof TasksPage>[0]['tasks']}
        completions={(completions || []) as unknown as Parameters<typeof TasksPage>[0]['completions']}
      />
    </div>
  );
}
