'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckSquare, Users, User, Globe, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';

type TargetType = 'all' | 'cohort' | 'community' | 'individual';

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  points: number | null;
  target_type: TargetType;
  target_id: string | null;
  created_by: string;
  created_at: string;
  completionCount?: number;
}

interface Community {
  id: string;
  name: string;
  type: string;
}

interface CreateForm {
  title: string;
  description: string;
  due_date: string;
  points: string;
  target_type: TargetType;
  target_id: string;
  individual_email: string;
}

interface TaskCompletionRecord {
  id: string;
  completed_at: string;
  notes: string | null;
  profiles: {
    name: string;
    email: string;
  } | null;
}

const defaultForm: CreateForm = {
  title: '',
  description: '',
  due_date: '',
  points: '',
  target_type: 'all',
  target_id: '',
  individual_email: '',
};

const TARGET_LABELS: Record<TargetType, string> = {
  all: 'All Students',
  cohort: 'Cohort',
  community: 'Community',
  individual: 'Individual',
};

const TARGET_ICONS: Record<TargetType, React.ElementType> = {
  all: Globe,
  cohort: Users,
  community: Users,
  individual: User,
};

export function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [taskCompletions, setTaskCompletions] = useState<Record<string, TaskCompletionRecord[]>>({});
  const [loadingCompletions, setLoadingCompletions] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchCommunities();
  }, []);

  async function fetchTasks() {
    const supabase = createClient();
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!tasksData) {
      setLoading(false);
      return;
    }

    // Fetch completion counts
    const ids = (tasksData as unknown as Task[]).map((t) => t.id);
    const counts: Record<string, number> = {};
    if (ids.length > 0) {
      const { data: compData } = await supabase
        .from('task_completions')
        .select('task_id')
        .in('task_id', ids);
      (compData as unknown as { task_id: string }[] || []).forEach((row) => {
        counts[row.task_id] = (counts[row.task_id] || 0) + 1;
      });
    }

    setTasks(
      (tasksData as unknown as Task[]).map((t) => ({ ...t, completionCount: counts[t.id] || 0 }))
    );
    setLoading(false);
  }

  async function fetchCommunities() {
    const supabase = createClient();
    const { data } = await supabase
      .from('communities')
      .select('id, name, type')
      .eq('is_active', true)
      .order('name');
    setCommunities((data || []) as Community[]);
  }

  async function handleCreate() {
    if (!form.title.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let target_id: string | null = null;

    if (form.target_type === 'community' && form.target_id) {
      target_id = form.target_id;
    } else if (form.target_type === 'individual' && form.individual_email.trim()) {
      // Look up user by email
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', form.individual_email.trim())
        .single();
      if (profileData) {
        target_id = (profileData as { user_id: string }).user_id;
      }
    }

    const { error } = await supabase.from('tasks').insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      due_date: form.due_date || null,
      points: form.points ? parseInt(form.points, 10) : null,
      target_type: form.target_type,
      target_id,
      created_by: user!.id,
    });

    if (!error) {
      setCreateOpen(false);
      setForm(defaultForm);
      await fetchTasks();
    }
    setSaving(false);
  }

  async function toggleCompletions(taskId: string) {
    if (expandedTask === taskId) {
      setExpandedTask(null);
      return;
    }
    setExpandedTask(taskId);
    if (taskCompletions[taskId]) return;

    setLoadingCompletions(taskId);
    const supabase = createClient();
    const { data } = await supabase
      .from('task_completions')
      .select('id, completed_at, notes, profiles(name, email)')
      .eq('task_id', taskId)
      .order('completed_at', { ascending: false });
    setTaskCompletions((prev) => ({ ...prev, [taskId]: (data || []) as unknown as TaskCompletionRecord[] }));
    setLoadingCompletions(null);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Tasks</h3>
          <p className="text-xs text-text-muted mt-0.5">{tasks.length} total</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-text-muted text-sm">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="p-10 text-center">
            <CheckSquare className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary text-sm">No tasks yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tasks.map((task) => {
              const TargetIcon = TARGET_ICONS[task.target_type];
              const isExpanded = expandedTask === task.id;
              return (
                <div key={task.id}>
                  <div className="flex items-start gap-3 p-4 hover:bg-surface-2 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-medium text-text-primary">{task.title}</p>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-surface-2 text-text-muted flex items-center gap-0.5 border border-border">
                          <TargetIcon className="w-2.5 h-2.5" />
                          {TARGET_LABELS[task.target_type]}
                        </span>
                        {task.points && task.points > 0 && (
                          <span className="text-[10px] font-semibold text-gold bg-gold/10 px-1.5 py-0.5 rounded-full">
                            ⭐ {task.points} pts
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-xs text-text-muted line-clamp-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                        {task.due_date && <span>Due: {formatDate(task.due_date)}</span>}
                        <span>Created: {formatDate(task.created_at)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCompletions(task.id)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface-2 text-text-secondary hover:text-text-primary border border-border hover:border-border/60 transition-colors flex-shrink-0"
                    >
                      {loadingCompletions === task.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <CheckSquare className="w-3.5 h-3.5 text-green" />
                          {task.completionCount ?? 0}
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </>
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="bg-surface-2 border-t border-border px-4 py-3">
                      {(taskCompletions[task.id] || []).length === 0 ? (
                        <p className="text-xs text-text-muted">No completions yet.</p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Completions ({(taskCompletions[task.id] || []).length})
                          </p>
                          {(taskCompletions[task.id] || []).map((c) => (
                            <div key={c.id} className="flex items-start gap-2 text-xs">
                              <span className="text-text-primary font-medium">
                                {c.profiles?.name ?? 'Unknown'}
                              </span>
                              <span className="text-text-muted">{c.profiles?.email}</span>
                              <span className="text-text-muted ml-auto flex-shrink-0">
                                {formatDate(c.completed_at)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setForm(defaultForm); }}
        title="Create Task"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Title <span className="text-red">*</span>
            </label>
            <input
              type="text"
              className="input-field w-full"
              placeholder="Task title..."
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Description
            </label>
            <textarea
              className="input-field w-full resize-none"
              rows={3}
              placeholder="Describe what students need to do..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="input-field w-full"
                value={form.due_date}
                onChange={(e) => setForm((p) => ({ ...p, due_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Points
              </label>
              <input
                type="number"
                className="input-field w-full"
                placeholder="0"
                min="0"
                value={form.points}
                onChange={(e) => setForm((p) => ({ ...p, points: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Assign To <span className="text-red">*</span>
            </label>
            <select
              className="input-field w-full"
              value={form.target_type}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  target_type: e.target.value as TargetType,
                  target_id: '',
                  individual_email: '',
                }))
              }
            >
              <option value="all">All Students</option>
              <option value="community">Specific Community</option>
              <option value="individual">Individual Student</option>
            </select>
          </div>

          {form.target_type === 'community' && (
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Select Community <span className="text-red">*</span>
              </label>
              <select
                className="input-field w-full"
                value={form.target_id}
                onChange={(e) => setForm((p) => ({ ...p, target_id: e.target.value }))}
              >
                <option value="">-- Select a community --</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.target_type === 'individual' && (
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Student Email <span className="text-red">*</span>
              </label>
              <input
                type="email"
                className="input-field w-full"
                placeholder="student@email.com"
                value={form.individual_email}
                onChange={(e) => setForm((p) => ({ ...p, individual_email: e.target.value }))}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setCreateOpen(false); setForm(defaultForm); }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              loading={saving}
              onClick={handleCreate}
              disabled={!form.title.trim()}
            >
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
