'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  HelpCircle,
  Loader2,
  CheckCircle,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';
import { PILLARS, type PillarName, PILLAR_TAGS_BG } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Course {
  id: string;
  title: string;
  description: string;
  pillar_tag: string;
  audience: 'school' | 'uni' | 'both';
  cover_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  moduleCount?: number;
}

interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  content: string;
  video_url: string | null;
  sort_order: number;
  created_at: string;
  hasQuiz?: boolean;
}

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  sort_order: number;
  options: {
    id: string;
    option_text: string;
    is_correct: boolean;
    sort_order: number;
  }[];
}

// ─── Course Form ──────────────────────────────────────────────────────────────

interface CourseFormData {
  title: string;
  description: string;
  pillar_tag: string;
  audience: 'school' | 'uni' | 'both';
  cover_url: string;
  is_active: boolean;
  sort_order: string;
}

const defaultCourseForm: CourseFormData = {
  title: '',
  description: '',
  pillar_tag: PILLARS[0],
  audience: 'both',
  cover_url: '',
  is_active: true,
  sort_order: '0',
};

// ─── Module Form ──────────────────────────────────────────────────────────────

interface ModuleFormData {
  title: string;
  content: string;
  video_url: string;
  sort_order: string;
}

const defaultModuleForm: ModuleFormData = {
  title: '',
  content: '',
  video_url: '',
  sort_order: '0',
};

// ─── Question Form ────────────────────────────────────────────────────────────

interface QuestionFormData {
  question: string;
  options: { text: string; is_correct: boolean }[];
}

const defaultQuestionForm: QuestionFormData = {
  question: '',
  options: [
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
  ],
};

// ─── Level 1: Course List ─────────────────────────────────────────────────────

function CourseList({
  onSelectCourse,
}: {
  onSelectCourse: (course: Course) => void;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<CourseFormData>(defaultCourseForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order', { ascending: true });

    const courseList: Course[] = data || [];

    // Fetch module counts
    if (courseList.length > 0) {
      const { data: modules } = await supabase
        .from('course_modules')
        .select('id, course_id')
        .in('course_id', courseList.map((c) => c.id));

      const counts: Record<string, number> = {};
      for (const m of modules || []) {
        counts[m.course_id] = (counts[m.course_id] || 0) + 1;
      }
      courseList.forEach((c) => {
        c.moduleCount = counts[c.id] || 0;
      });
    }

    setCourses(courseList);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  function openCreate() {
    setForm(defaultCourseForm);
    setEditCourse(null);
    setCreateOpen(true);
  }

  function openEdit(course: Course) {
    setForm({
      title: course.title,
      description: course.description,
      pillar_tag: course.pillar_tag,
      audience: course.audience,
      cover_url: course.cover_url || '',
      is_active: course.is_active,
      sort_order: String(course.sort_order),
    });
    setEditCourse(course);
    setCreateOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    const supabase = createClient();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      pillar_tag: form.pillar_tag,
      audience: form.audience,
      cover_url: form.cover_url.trim() || null,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0,
    };

    if (editCourse) {
      await supabase.from('courses').update(payload).eq('id', editCourse.id);
    } else {
      await supabase.from('courses').insert(payload);
    }

    setSaving(false);
    setCreateOpen(false);
    fetchCourses();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this course? All modules and quiz data will be removed.')) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from('courses').delete().eq('id', id);
    setDeleting(null);
    fetchCourses();
  }

  async function handleToggleActive(course: Course) {
    const supabase = createClient();
    await supabase
      .from('courses')
      .update({ is_active: !course.is_active })
      .eq('id', course.id);
    fetchCourses();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text-primary">All Courses</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Create Course
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        </div>
      ) : courses.length === 0 ? (
        <div className="card p-10 text-center">
          <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">No courses yet. Create the first one!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="divide-y divide-border">
            {courses.map((course) => {
              const pillarBg = (PILLARS as readonly string[]).includes(course.pillar_tag)
                ? PILLAR_TAGS_BG[course.pillar_tag as PillarName]
                : 'bg-border/10 text-text-muted';

              return (
                <div
                  key={course.id}
                  className="flex items-center gap-3 p-4 hover:bg-surface-2 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {course.title}
                      </p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-sm ${pillarBg}`}>
                        {course.pillar_tag}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-border/20 text-text-muted">
                        {course.audience}
                      </span>
                      {!course.is_active && (
                        <span className="text-xs px-1.5 py-0.5 rounded-sm bg-red/10 text-red">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted">
                      {course.moduleCount ?? 0} modules · sort #{course.sort_order}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(course)}
                      className="p-2 rounded-lg text-text-muted hover:bg-surface-2 transition-colors"
                      title={course.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {course.is_active ? (
                        <Eye className="w-4 h-4 text-green" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEdit(course)}
                      className="p-2 rounded-lg text-text-muted hover:bg-surface-2 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      disabled={deleting === course.id}
                      className="p-2 rounded-lg text-text-muted hover:bg-red/10 hover:text-red transition-colors"
                    >
                      {deleting === course.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="flex items-center gap-1 text-xs text-blue hover:text-blue/80 transition-colors px-2 py-1 rounded-lg hover:bg-blue/10"
                    >
                      Modules
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={editCourse ? 'Edit Course' : 'Create Course'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Title *</label>
            <input
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
              placeholder="Course title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Description</label>
            <textarea
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors resize-none"
              placeholder="Short description of the course"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Pillar Tag</label>
              <select
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
                value={form.pillar_tag}
                onChange={(e) => setForm((p) => ({ ...p, pillar_tag: e.target.value }))}
              >
                {PILLARS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Audience</label>
              <select
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
                value={form.audience}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    audience: e.target.value as 'school' | 'uni' | 'both',
                  }))
                }
              >
                <option value="both">Both</option>
                <option value="school">School</option>
                <option value="uni">University</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Cover URL</label>
              <input
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
                placeholder="https://..."
                value={form.cover_url}
                onChange={(e) => setForm((p) => ({ ...p, cover_url: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Sort Order</label>
              <input
                type="number"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
                value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is-active"
              checked={form.is_active}
              onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
              className="w-4 h-4 accent-gold"
            />
            <label htmlFor="is-active" className="text-sm text-text-secondary cursor-pointer">
              Active (visible to students)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" loading={saving} onClick={handleSave}>
              {editCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Level 2: Module Management ───────────────────────────────────────────────

function ModuleManager({
  course,
  onBack,
  onSelectModule,
}: {
  course: Course;
  onBack: () => void;
  onSelectModule: (module: CourseModule) => void;
}) {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editModule, setEditModule] = useState<CourseModule | null>(null);
  const [form, setForm] = useState<ModuleFormData>(defaultModuleForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', course.id)
      .order('sort_order', { ascending: true });

    const moduleList: CourseModule[] = data || [];

    // Check quiz existence
    if (moduleList.length > 0) {
      const { data: quizzes } = await supabase
        .from('quizzes')
        .select('module_id')
        .in('module_id', moduleList.map((m) => m.id));

      const quizSet = new Set((quizzes || []).map((q) => q.module_id));
      moduleList.forEach((m) => {
        m.hasQuiz = quizSet.has(m.id);
      });
    }

    setModules(moduleList);
    setLoading(false);
  }, [course.id]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  function openCreate() {
    setForm({ ...defaultModuleForm, sort_order: String(modules.length) });
    setEditModule(null);
    setCreateOpen(true);
  }

  function openEdit(mod: CourseModule) {
    setForm({
      title: mod.title,
      content: mod.content,
      video_url: mod.video_url || '',
      sort_order: String(mod.sort_order),
    });
    setEditModule(mod);
    setCreateOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    const supabase = createClient();

    const payload = {
      course_id: course.id,
      title: form.title.trim(),
      content: form.content.trim(),
      video_url: form.video_url.trim() || null,
      sort_order: parseInt(form.sort_order) || 0,
    };

    if (editModule) {
      await supabase.from('course_modules').update(payload).eq('id', editModule.id);
    } else {
      await supabase.from('course_modules').insert(payload);
    }

    setSaving(false);
    setCreateOpen(false);
    fetchModules();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this module? The quiz will also be removed.')) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from('course_modules').delete().eq('id', id);
    setDeleting(null);
    fetchModules();
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Courses
        </button>
        <span className="text-text-muted">/</span>
        <span className="text-sm font-medium text-text-primary truncate">{course.title}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text-primary">Modules</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Module
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        </div>
      ) : modules.length === 0 ? (
        <div className="card p-10 text-center">
          <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">No modules yet. Add the first one!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="divide-y divide-border">
            {modules.map((mod, index) => (
              <div key={mod.id} className="flex items-center gap-3 p-4 hover:bg-surface-2 transition-colors">
                <div className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-xs font-bold text-text-muted flex-shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-text-primary truncate">{mod.title}</p>
                    {mod.hasQuiz && (
                      <span className="text-xs text-purple bg-purple/10 px-1.5 py-0.5 rounded-sm flex-shrink-0">
                        Quiz
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">sort #{mod.sort_order}</p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(mod)}
                    className="p-2 rounded-lg text-text-muted hover:bg-surface-2 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(mod.id)}
                    disabled={deleting === mod.id}
                    className="p-2 rounded-lg text-text-muted hover:bg-red/10 hover:text-red transition-colors"
                  >
                    {deleting === mod.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onSelectModule(mod)}
                    className="flex items-center gap-1 text-xs text-purple hover:text-purple/80 transition-colors px-2 py-1 rounded-lg hover:bg-purple/10"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Quiz
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={editModule ? 'Edit Module' : 'Add Module'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Title *</label>
            <input
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
              placeholder="Module title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Content (HTML or plain text)
            </label>
            <textarea
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors resize-y font-mono"
              placeholder="<p>Module content here...</p>"
              rows={12}
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Video URL (optional)
              </label>
              <input
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
                placeholder="https://youtube.com/watch?v=..."
                value={form.video_url}
                onChange={(e) => setForm((p) => ({ ...p, video_url: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Sort Order</label>
              <input
                type="number"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
                value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" loading={saving} onClick={handleSave}>
              {editModule ? 'Save Changes' : 'Add Module'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Level 3: Quiz Management ─────────────────────────────────────────────────

function QuizManager({
  module,
  course,
  onBack,
}: {
  module: CourseModule;
  course: Course;
  onBack: () => void;
}) {
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState<QuestionFormData>(defaultQuestionForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateMessage, setGenerateMessage] = useState('');

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    // Ensure quiz exists
    let { data: quiz } = await supabase
      .from('quizzes')
      .select('*')
      .eq('module_id', module.id)
      .maybeSingle();

    if (!quiz) {
      const { data: newQuiz } = await supabase
        .from('quizzes')
        .insert({ module_id: module.id, pass_score: 80 })
        .select()
        .single();
      quiz = newQuiz;
    }

    if (!quiz) {
      setLoading(false);
      return;
    }

    setQuizId(quiz.id);

    // Fetch questions
    const { data: qs } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('sort_order', { ascending: true });

    const questionList = qs || [];

    // Fetch options for each question
    const questionsWithOptions: QuizQuestion[] = await Promise.all(
      questionList.map(async (q) => {
        const { data: opts } = await supabase
          .from('quiz_options')
          .select('*')
          .eq('question_id', q.id)
          .order('sort_order', { ascending: true });
        return { ...q, options: opts || [] };
      })
    );

    setQuestions(questionsWithOptions);
    setLoading(false);
  }, [module.id]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  function openAddQuestion() {
    setQuestionForm({
      question: '',
      options: [
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ],
    });
    setAddQuestionOpen(true);
  }

  function setCorrectOption(index: number) {
    setQuestionForm((prev) => ({
      ...prev,
      options: prev.options.map((o, i) => ({ ...o, is_correct: i === index })),
    }));
  }

  async function handleAddQuestion() {
    if (!quizId || !questionForm.question.trim()) return;
    const hasCorrect = questionForm.options.some((o) => o.is_correct);
    if (!hasCorrect) {
      alert('Please select the correct answer.');
      return;
    }
    const emptyOptions = questionForm.options.filter((o) => !o.text.trim());
    if (emptyOptions.length > 0) {
      alert('Please fill in all 4 options.');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const { data: q } = await supabase
      .from('quiz_questions')
      .insert({
        quiz_id: quizId,
        question: questionForm.question.trim(),
        sort_order: questions.length,
      })
      .select()
      .single();

    if (q) {
      await supabase.from('quiz_options').insert(
        questionForm.options.map((o, i) => ({
          question_id: q.id,
          option_text: o.text.trim(),
          is_correct: o.is_correct,
          sort_order: i,
        }))
      );
    }

    setSaving(false);
    setAddQuestionOpen(false);
    fetchQuiz();
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!confirm('Delete this question?')) return;
    setDeleting(questionId);
    const supabase = createClient();
    await supabase.from('quiz_questions').delete().eq('id', questionId);
    setDeleting(null);
    fetchQuiz();
  }

  async function handleGenerateQuiz() {
    if (!quizId) return;
    if (!confirm('This will generate 5 new questions and add them to this quiz. Continue?')) return;

    setGenerating(true);
    setGenerateMessage('');

    try {
      const res = await fetch('/api/admin/courses/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module_id: module.id,
          module_content: module.content,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setGenerateMessage(err.error || 'Failed to generate quiz.');
      } else {
        const data = await res.json();
        setGenerateMessage(`Successfully generated ${data.count} questions!`);
        fetchQuiz();
      }
    } catch {
      setGenerateMessage('Failed to generate quiz. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {course.title}
        </button>
        <span className="text-text-muted">/</span>
        <span className="text-sm text-text-muted truncate">{module.title}</span>
        <span className="text-text-muted">/</span>
        <span className="text-sm font-medium text-text-primary">Quiz</span>
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-base font-semibold text-text-primary">Quiz Questions</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            loading={generating}
            onClick={handleGenerateQuiz}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-gold" />
                AI Generate Quiz
              </>
            )}
          </Button>
          <Button size="sm" onClick={openAddQuestion}>
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>
      </div>

      {generateMessage && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-sm ${
            generateMessage.includes('Successfully')
              ? 'bg-green/10 text-green'
              : 'bg-red/10 text-red'
          }`}
        >
          {generateMessage.includes('Successfully') ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          {generateMessage}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        </div>
      ) : questions.length === 0 ? (
        <div className="card p-10 text-center">
          <HelpCircle className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">No questions yet. Add some or use AI to generate them!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div key={q.id} className="card p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-sm font-medium text-text-primary">
                  <span className="text-text-muted mr-2">{qi + 1}.</span>
                  {q.question}
                </p>
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  disabled={deleting === q.id}
                  className="p-1.5 rounded-lg text-text-muted hover:bg-red/10 hover:text-red transition-colors flex-shrink-0"
                >
                  {deleting === q.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="space-y-1.5">
                {q.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      opt.is_correct
                        ? 'bg-green/10 text-green border border-green/20'
                        : 'bg-surface-2 text-text-secondary'
                    }`}
                  >
                    {opt.is_correct ? (
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-border flex-shrink-0" />
                    )}
                    {opt.option_text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Question Modal */}
      <Modal
        open={addQuestionOpen}
        onClose={() => setAddQuestionOpen(false)}
        title="Add Question"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Question *</label>
            <textarea
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors resize-none"
              placeholder="Enter the question text..."
              rows={3}
              value={questionForm.question}
              onChange={(e) =>
                setQuestionForm((p) => ({ ...p, question: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">
              Options — select the correct answer:
            </p>
            {questionForm.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correct-answer"
                  checked={opt.is_correct}
                  onChange={() => setCorrectOption(i)}
                  className="w-4 h-4 accent-green flex-shrink-0"
                />
                <input
                  className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  value={opt.text}
                  onChange={(e) =>
                    setQuestionForm((p) => ({
                      ...p,
                      options: p.options.map((o, j) =>
                        j === i ? { ...o, text: e.target.value } : o
                      ),
                    }))
                  }
                />
              </div>
            ))}
            <p className="text-xs text-text-muted">
              The radio button marks which option is correct (shown in green).
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setAddQuestionOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" loading={saving} onClick={handleAddQuestion}>
              Add Question
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export function CoursesManager() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);

  if (selectedCourse && selectedModule) {
    return (
      <QuizManager
        module={selectedModule}
        course={selectedCourse}
        onBack={() => setSelectedModule(null)}
      />
    );
  }

  if (selectedCourse) {
    return (
      <ModuleManager
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onSelectModule={(mod) => setSelectedModule(mod)}
      />
    );
  }

  return <CourseList onSelectCourse={(course) => setSelectedCourse(course)} />;
}
