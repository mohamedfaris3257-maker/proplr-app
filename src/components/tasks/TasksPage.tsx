'use client';

import { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  ListTodo,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Profile } from '@/lib/types';

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  points: number | null;
  target_type: 'all' | 'cohort' | 'community' | 'individual';
  target_id: string | null;
  created_by: string;
  created_at: string;
}

interface TaskCompletion {
  id: string;
  task_id: string;
  user_id: string;
  completed_at: string;
  notes: string | null;
}

interface TasksPageProps {
  currentUserId: string;
  profile: Profile;
  tasks: Task[];
  completions: TaskCompletion[];
}

type Tab = 'pending' | 'completed';

function dueDateStatus(dateStr: string | null): 'overdue' | 'soon' | 'normal' | null {
  if (!dateStr) return null;
  const due = new Date(dateStr);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return 'overdue';
  if (diffDays < 3) return 'soon';
  return 'normal';
}

function DueDateLabel({ dateStr }: { dateStr: string | null }) {
  if (!dateStr) return null;
  const status = dueDateStatus(dateStr);
  const colorMap = {
    overdue: 'text-red',
    soon: 'text-gold',
    normal: 'text-text-muted',
  };
  const color = colorMap[status!] ?? 'text-text-muted';
  const label = status === 'overdue' ? 'Overdue' : status === 'soon' ? 'Due soon' : '';
  return (
    <span className={`text-xs flex items-center gap-1 ${color}`}>
      <Clock className="w-3 h-3" />
      {label ? `${label} · ` : ''}Due {formatDate(dateStr)}
    </span>
  );
}

interface TaskCardProps {
  task: Task;
  completion?: TaskCompletion;
  onComplete: (taskId: string, notes: string) => Promise<void>;
}

function TaskCard({ task, completion, onComplete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isCompleted = !!completion;

  async function handleMarkComplete() {
    setSubmitting(true);
    await onComplete(task.id, notes);
    setSubmitting(false);
    setExpanded(false);
  }

  return (
    <div className={`card p-4 flex flex-col gap-3 transition-all duration-200 ${isCompleted ? 'opacity-80' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-border" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm font-semibold text-text-primary ${isCompleted ? 'line-through text-text-muted' : ''}`}>
              {task.title}
            </h3>
            {task.points && task.points > 0 && (
              <span className="flex-shrink-0 text-xs font-semibold text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                {task.points} pts
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-text-secondary mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <DueDateLabel dateStr={task.due_date} />
            {isCompleted && completion && (
              <span className="text-xs text-green flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Completed {formatDate(completion.completed_at)}
              </span>
            )}
          </div>
        </div>
      </div>

      {!isCompleted && (
        <div className="border-t border-border pt-3">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? 'Cancel' : 'Mark as Complete'}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Notes (optional)
                </label>
                <textarea
                  className="input-field w-full resize-none text-xs"
                  rows={3}
                  placeholder="Add any notes about how you completed this task..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <button
                onClick={handleMarkComplete}
                disabled={submitting}
                className="btn-primary text-sm px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <CheckCircle2 className="w-4 h-4" />
                Mark Complete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TasksPage({
  tasks: initialTasks,
  completions: initialCompletions,
}: TasksPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [completions, setCompletions] = useState<TaskCompletion[]>(initialCompletions);

  const completedTaskIds = new Set(completions.map((c) => c.task_id));
  const pendingTasks = initialTasks.filter((t) => !completedTaskIds.has(t.id));
  const completedTasks = initialTasks.filter((t) => completedTaskIds.has(t.id));

  async function handleComplete(taskId: string, notes: string) {
    try {
      const res = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, notes: notes || undefined }),
      });
      const data = await res.json();
      if (data.success && data.completion) {
        setCompletions((prev) => [...prev, data.completion as TaskCompletion]);
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-green/20 flex items-center justify-center">
          <CheckSquare className="w-5 h-5 text-green" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tasks</h1>
          <p className="text-text-muted text-sm">
            {pendingTasks.length} pending · {completedTasks.length} completed
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-2 rounded-xl mb-6 w-fit">
        {([
          { id: 'pending' as Tab, label: 'Pending', count: pendingTasks.length },
          { id: 'completed' as Tab, label: 'Completed', count: completedTasks.length },
        ] as const).map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? 'bg-surface text-text-primary shadow-card'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {label}
            {count > 0 && (
              <span className={`text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                activeTab === id ? 'bg-gold/20 text-gold' : 'bg-surface text-text-muted'
              }`}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pending */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingTasks.length === 0 ? (
            <div className="card p-10 text-center">
              <CheckCircle2 className="w-8 h-8 text-green mx-auto mb-3" />
              <p className="text-text-secondary text-sm font-medium">All caught up!</p>
              <p className="text-text-muted text-xs mt-1">No pending tasks. Great work!</p>
            </div>
          ) : (
            pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
              />
            ))
          )}
        </div>
      )}

      {/* Completed */}
      {activeTab === 'completed' && (
        <div className="space-y-3">
          {completedTasks.length === 0 ? (
            <div className="card p-10 text-center">
              <ListTodo className="w-8 h-8 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary text-sm">No completed tasks yet.</p>
              <p className="text-text-muted text-xs mt-1">Complete tasks to see them here.</p>
            </div>
          ) : (
            completedTasks.map((task) => {
              const completion = completions.find((c) => c.task_id === task.id);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  completion={completion}
                  onComplete={handleComplete}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
