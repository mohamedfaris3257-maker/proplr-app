'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, Circle, Clock, BookOpen, HelpCircle } from 'lucide-react';
import { PILLAR_TAGS_BG, PILLAR_COLORS, type PillarName, PILLARS } from '@/lib/types';

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

interface CourseDetailPageProps {
  course: Course;
  modules: CourseModule[];
  moduleProgressMap: Record<string, string>;
  quizModuleIds: string[];
  completedCount: number;
  totalCount: number;
  overallPercent: number;
}

function isPillarName(tag: string): tag is PillarName {
  return (PILLARS as readonly string[]).includes(tag);
}

function ModuleStatusIcon({ status }: { status: string }) {
  if (status === 'completed') {
    return <CheckCircle className="w-5 h-5 text-green flex-shrink-0" />;
  }
  if (status === 'in_progress') {
    return <Clock className="w-5 h-5 text-gold flex-shrink-0" />;
  }
  return <Circle className="w-5 h-5 text-text-muted flex-shrink-0" />;
}

export function CourseDetailPage({
  course,
  modules,
  moduleProgressMap,
  quizModuleIds,
  completedCount,
  totalCount,
  overallPercent,
}: CourseDetailPageProps) {
  const pillarBg = isPillarName(course.pillar_tag)
    ? PILLAR_TAGS_BG[course.pillar_tag as PillarName]
    : 'bg-border/10 text-text-muted';
  const pillarColor = isPillarName(course.pillar_tag)
    ? PILLAR_COLORS[course.pillar_tag as PillarName]
    : '#4a6785';
  const quizSet = new Set(quizModuleIds);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        All Courses
      </Link>

      {/* Course header */}
      <div className="card overflow-hidden mb-6">
        {/* Cover / banner */}
        <div className="relative h-40">
          {course.cover_url ? (
            <img
              src={course.cover_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${pillarColor}30, ${pillarColor}08)` }}
            >
              <BookOpen className="w-16 h-16 opacity-30" style={{ color: pillarColor }} />
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-text-primary">{course.title}</h1>
              <p className="text-text-muted text-sm mt-1 leading-relaxed">{course.description}</p>
            </div>
            <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-sm flex-shrink-0 ${pillarBg}`}>
              {course.pillar_tag}
            </span>
          </div>

          {/* Overall progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{completedCount} of {totalCount} modules completed</span>
              <span className={`font-medium ${overallPercent === 100 ? 'text-green' : 'text-gold'}`}>
                {overallPercent}%
              </span>
            </div>
            <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${overallPercent}%`,
                  backgroundColor: overallPercent === 100 ? '#27AE60' : '#E8A838',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide px-1">
          Modules ({totalCount})
        </h2>

        {modules.length === 0 ? (
          <div className="card p-8 text-center">
            <BookOpen className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-text-muted text-sm">No modules have been added yet.</p>
          </div>
        ) : (
          modules.map((mod, index) => {
            const status = moduleProgressMap[mod.id] || 'not_started';
            const hasQuiz = quizSet.has(mod.id);

            return (
              <Link
                key={mod.id}
                href={`/dashboard/courses/${course.id}/${mod.id}`}
                className="card flex items-center gap-4 p-4 hover:border-blue/40 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {/* Module number */}
                <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center flex-shrink-0 text-xs font-bold text-text-muted group-hover:bg-blue/10 group-hover:text-blue transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Status icon */}
                <ModuleStatusIcon status={status} />

                {/* Title and badges */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary group-hover:text-blue transition-colors truncate">
                    {mod.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs ${
                      status === 'completed' ? 'text-green' :
                      status === 'in_progress' ? 'text-gold' :
                      'text-text-muted'
                    }`}>
                      {status === 'completed' ? 'Completed' :
                       status === 'in_progress' ? 'In Progress' :
                       'Not Started'}
                    </span>
                    {hasQuiz && (
                      <span className="inline-flex items-center gap-1 text-xs text-purple bg-purple/10 px-1.5 py-0.5 rounded-sm">
                        <HelpCircle className="w-3 h-3" />
                        Quiz
                      </span>
                    )}
                  </div>
                </div>

                <ArrowLeft className="w-4 h-4 text-text-muted rotate-180 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
