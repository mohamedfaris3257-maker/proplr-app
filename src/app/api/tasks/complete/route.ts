import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { task_id?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { task_id, notes } = body;
  if (!task_id) {
    return NextResponse.json({ error: 'task_id is required' }, { status: 400 });
  }

  // Check not already completed
  const { data: existing } = await supabase
    .from('task_completions')
    .select('id')
    .eq('task_id', task_id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'Task already completed' }, { status: 409 });
  }

  // Fetch task to get points
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('id, points')
    .eq('id', task_id)
    .single();

  if (taskError || !task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  // Insert completion
  const { data: completion, error: insertError } = await supabase
    .from('task_completions')
    .insert({
      task_id,
      user_id: user.id,
      completed_at: new Date().toISOString(),
      notes: notes ?? null,
    })
    .select()
    .single();

  if (insertError || !completion) {
    console.error('task_completions insert error:', insertError);
    return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 });
  }

  // Award points if task has points
  const points = task.points ?? 0;
  if (points > 0) {
    // Fetch current points
    const { data: profileData } = await supabase
      .from('profiles')
      .select('points')
      .eq('user_id', user.id)
      .single();

    const currentPoints = (profileData as Record<string, unknown>)?.points as number ?? 0;

    await supabase
      .from('profiles')
      .update({ points: currentPoints + points })
      .eq('user_id', user.id);
  }

  return NextResponse.json({ success: true, completion });
}
