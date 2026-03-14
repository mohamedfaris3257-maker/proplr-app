'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Loader2,
  BookOpen,
  Video,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuizOption {
  id: string;
  option_text: string;
  is_correct: boolean;
  sort_order: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  sort_order: number;
  options: QuizOption[];
}

interface QuizData {
  id: string;
  pass_score: number;
  questions: QuizQuestion[];
}

interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  content: string;
  video_url: string | null;
  sort_order: number;
  created_at: string;
}

interface ModuleViewerPageProps {
  courseId: string;
  module: CourseModule;
  quizData: QuizData | null;
  currentStatus: string;
  bestSubmission: { score: number; passed: boolean } | null;
  prevModule: { id: string; title: string } | null;
  nextModule: { id: string; title: string } | null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // youtube.com/watch?v=...
    if (parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`;
    }
    // youtu.be/...
    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    // youtube.com/embed/...
    if (parsed.hostname.includes('youtube.com') && parsed.pathname.includes('/embed/')) {
      return url;
    }
  } catch {
    // ignore
  }
  return null;
}

export function ModuleViewerPage({
  courseId,
  module,
  quizData,
  currentStatus,
  bestSubmission,
  prevModule,
  nextModule,
}: ModuleViewerPageProps) {
  const [status, setStatus] = useState(currentStatus);
  const [marking, setMarking] = useState(false);
  const [markError, setMarkError] = useState('');

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    score: number;
    passed: boolean;
    correct: number;
    total: number;
  } | null>(null);
  const [submitError, setSubmitError] = useState('');

  const alreadyPassed = bestSubmission?.passed === true || submitResult?.passed === true;
  const passedScore = submitResult?.passed ? submitResult.score : bestSubmission?.score;

  async function handleMarkComplete() {
    setMarking(true);
    setMarkError('');
    try {
      const res = await fetch('/api/courses/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          module_id: module.id,
          status: 'completed',
        }),
      });
      if (!res.ok) throw new Error('Failed to update progress');
      setStatus('completed');
    } catch {
      setMarkError('Could not save progress. Please try again.');
    } finally {
      setMarking(false);
    }
  }

  async function handleSubmitQuiz() {
    if (!quizData) return;
    const unanswered = quizData.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setSubmitError(`Please answer all ${quizData.questions.length} questions before submitting.`);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/courses/quiz-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quizData.id,
          answers,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();
      setSubmitResult(data);
      if (data.passed) {
        setStatus('completed');
      }
    } catch {
      setSubmitError('Could not submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setAnswers({});
    setSubmitResult(null);
    setSubmitError('');
  }

  const embedUrl = module.video_url ? getYouTubeEmbedUrl(module.video_url) : null;
  const isDirectVideo =
    module.video_url && !embedUrl
      ? module.video_url.match(/\.(mp4|webm|ogg)$/i) !== null
      : false;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back to course */}
      <Link
        href={`/dashboard/courses/${courseId}`}
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Course
      </Link>

      {/* ── SECTION 1: Content ── */}
      <div className="card overflow-hidden mb-6">
        {/* Video section */}
        {module.video_url && (
          <div className="border-b border-border">
            {embedUrl ? (
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={module.title}
                />
              </div>
            ) : isDirectVideo ? (
              <video
                src={module.video_url}
                controls
                className="w-full max-h-96"
                title={module.title}
              />
            ) : (
              <div className="p-4 flex items-center gap-2 text-sm text-text-muted">
                <Video className="w-4 h-4" />
                <a
                  href={module.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue hover:underline"
                >
                  Watch Video
                </a>
              </div>
            )}
          </div>
        )}

        {/* Module title and content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h1 className="text-xl font-bold text-text-primary">{module.title}</h1>
            {status === 'completed' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green bg-green/10 px-2.5 py-1 rounded-lg flex-shrink-0">
                <CheckCircle className="w-3.5 h-3.5" />
                Completed
              </span>
            )}
          </div>

          {/* Render HTML content */}
          <div
            className="prose prose-invert prose-sm max-w-none text-text-secondary leading-relaxed
              [&_h1]:text-text-primary [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-5 [&_h1]:mb-2
              [&_h2]:text-text-primary [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2
              [&_h3]:text-text-primary [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
              [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
              [&_li]:mb-1 [&_strong]:text-text-primary [&_em]:text-text-secondary
              [&_a]:text-blue [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-gold
              [&_blockquote]:pl-4 [&_blockquote]:text-text-muted [&_blockquote]:italic
              [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-teal [&_code]:text-xs
              [&_pre]:bg-surface-2 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: module.content }}
          />
        </div>
      </div>

      {/* ── SECTION 2: Mark as Complete ── */}
      {status !== 'completed' && (
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                {quizData && !alreadyPassed
                  ? 'Complete the Quiz to Finish This Module'
                  : 'Mark Module as Complete'}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {quizData && !alreadyPassed
                  ? 'Pass the quiz below to mark this module as completed.'
                  : "Once you've reviewed all the content, mark it as done."}
              </p>
            </div>
            {!(quizData && !alreadyPassed) && (
              <Button
                onClick={handleMarkComplete}
                loading={marking}
                className="flex-shrink-0"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </Button>
            )}
          </div>
          {markError && (
            <p className="text-xs text-red mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {markError}
            </p>
          )}
        </div>
      )}

      {status === 'completed' && (
        <div className="card p-5 mb-6 border-green/30 bg-green/5">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green">Module Completed!</p>
              <p className="text-xs text-text-muted mt-0.5">
                Great work. Continue to the next module or revisit content anytime.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 3: Quiz ── */}
      {quizData && quizData.questions.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <HelpCircle className="w-5 h-5 text-purple" />
            <h2 className="text-base font-bold text-text-primary">Module Quiz</h2>
            <span className="text-xs text-text-muted ml-auto">
              Pass score: {quizData.pass_score}%
            </span>
          </div>

          {/* Already passed banner */}
          {alreadyPassed ? (
            <div className="flex items-center gap-3 p-4 bg-green/10 border border-green/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green">
                  Quiz Passed! ({Math.round(passedScore ?? 0)}%)
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  You have already passed this quiz. Well done!
                </p>
              </div>
            </div>
          ) : submitResult ? (
            /* Result screen */
            <div className="space-y-4">
              <div className={`p-5 rounded-xl border ${
                submitResult.passed
                  ? 'bg-green/10 border-green/20'
                  : 'bg-red/10 border-red/20'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {submitResult.passed ? (
                    <CheckCircle className="w-6 h-6 text-green flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red flex-shrink-0" />
                  )}
                  <div>
                    <p className={`text-base font-bold ${submitResult.passed ? 'text-green' : 'text-red'}`}>
                      {submitResult.passed ? 'Passed!' : 'Not Passed'}
                    </p>
                    <p className="text-xs text-text-muted">
                      {submitResult.correct} / {submitResult.total} correct — {Math.round(submitResult.score)}%
                    </p>
                  </div>
                  <span className={`ml-auto text-2xl font-bold ${submitResult.passed ? 'text-green' : 'text-red'}`}>
                    {Math.round(submitResult.score)}%
                  </span>
                </div>
                {!submitResult.passed && (
                  <p className="text-xs text-text-muted">
                    You need {quizData.pass_score}% to pass. Review the module content and try again.
                  </p>
                )}
              </div>

              {!submitResult.passed && (
                <Button variant="secondary" onClick={handleRetry}>
                  <RefreshCw className="w-4 h-4" />
                  Retry Quiz
                </Button>
              )}
            </div>
          ) : (
            /* Questions */
            <div className="space-y-6">
              {quizData.questions.map((q, qi) => (
                <div key={q.id} className="space-y-3">
                  <p className="text-sm font-medium text-text-primary">
                    <span className="text-text-muted mr-2">{qi + 1}.</span>
                    {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const selected = answers[q.id] === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                            selected
                              ? 'border-blue/60 bg-blue/10'
                              : 'border-border hover:border-border/80 hover:bg-surface-2'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={opt.id}
                            checked={selected}
                            onChange={() =>
                              setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                              selected ? 'border-blue' : 'border-border'
                            }`}
                          >
                            {selected && (
                              <div className="w-2 h-2 rounded-full bg-blue" />
                            )}
                          </div>
                          <span className="text-sm text-text-secondary">{opt.option_text}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {submitError && (
                <p className="text-xs text-red flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {submitError}
                </p>
              )}

              <Button
                onClick={handleSubmitQuiz}
                loading={submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4" />
                    Submit Quiz
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 4: Navigation ── */}
      <div className="flex items-center justify-between gap-4">
        {prevModule ? (
          <Link
            href={`/dashboard/courses/${courseId}/${prevModule.id}`}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <div>
              <p className="text-xs text-text-muted">Previous</p>
              <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors truncate max-w-[180px]">
                {prevModule.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Link
            href={`/dashboard/courses/${courseId}/${nextModule.id}`}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors group text-right"
          >
            <div>
              <p className="text-xs text-text-muted">Next</p>
              <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors truncate max-w-[180px]">
                {nextModule.title}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors group text-right"
          >
            <div>
              <p className="text-xs text-text-muted">Finished!</p>
              <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                Back to Course
              </p>
            </div>
            <BookOpen className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
