'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle, Play, ArrowRight } from 'lucide-react';
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

interface CourseProgress {
  completed: number;
  total: number;
  percent: number;
}

interface CoursesPageProps {
  courses: Course[];
  courseProgressMap: Record<string, CourseProgress>;
  moduleCounts: Record<string, number>;
}

const PILLAR_GRADIENTS: Record<string, string> = {
  'Leadership': 'from-gold/30 to-gold/5',
  'Entrepreneurship': 'from-blue/30 to-blue/5',
  'Digital Literacy': 'from-teal/30 to-teal/5',
  'Personal Branding': 'from-purple/30 to-purple/5',
  'Communication': 'from-green/30 to-green/5',
  'Project Management': 'from-red/30 to-red/5',
};

function isPillarName(tag: string): tag is PillarName {
  return (PILLARS as readonly string[]).includes(tag);
}

function CourseCard({ course, progress, moduleCount }: {
  course: Course;
  progress: CourseProgress;
  moduleCount: number;
}) {
  const isCompleted = moduleCount > 0 && progress.completed === moduleCount;
  const isInProgress = progress.completed > 0 && !isCompleted;
  const gradient = PILLAR_GRADIENTS[course.pillar_tag] || 'from-border/30 to-border/5';
  const pillarBg = isPillarName(course.pillar_tag)
    ? PILLAR_TAGS_BG[course.pillar_tag as PillarName]
    : 'bg-border/10 text-text-muted';
  const pillarColor = isPillarName(course.pillar_tag)
    ? PILLAR_COLORS[course.pillar_tag as PillarName]
    : '#4a6785';

  return (
    <Link
      href={`/dashboard/courses/${course.id}`}
      className="card overflow-hidden group hover:border-blue/40 transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Cover */}
      <div className="relative h-36 overflow-hidden">
        {course.cover_url ? (
          <img
            src={course.cover_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <BookOpen
              className="w-12 h-12 opacity-40"
              style={{ color: pillarColor }}
            />
          </div>
        )}
        {/* Pillar badge overlay */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-sm ${pillarBg}`}>
            {course.pillar_tag}
          </span>
        </div>
        {isCompleted && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-sm bg-green/20 text-green">
              <CheckCircle className="w-3 h-3" />
              Done
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary line-clamp-1 group-hover:text-blue transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress.percent}%`,
                backgroundColor: isCompleted ? '#27AE60' : '#E8A838',
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>{progress.completed} of {moduleCount} modules</span>
            <span className={isCompleted ? 'text-green font-medium' : 'text-gold font-medium'}>
              {progress.percent}%
            </span>
          </div>
        </div>

        {/* CTA button */}
        <div className="pt-1">
          {isCompleted ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-green">
              <CheckCircle className="w-3.5 h-3.5" />
              Completed
            </div>
          ) : isInProgress ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-gold group-hover:gap-2 transition-all">
              <Play className="w-3.5 h-3.5" />
              Continue
              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium text-blue group-hover:gap-2 transition-all">
              <BookOpen className="w-3.5 h-3.5" />
              Start Course
              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function CoursesPage({ courses, courseProgressMap, moduleCounts }: CoursesPageProps) {
  if (courses.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Courses</h1>
          <p className="text-text-muted text-sm mt-1">Build your skills with structured learning paths</p>
        </div>
        <div className="card p-12 text-center">
          <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">No courses available yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  const totalCompleted = courses.filter((c) => {
    const p = courseProgressMap[c.id];
    const total = moduleCounts[c.id] || 0;
    return total > 0 && p && p.completed === total;
  }).length;

  const inProgress = courses.filter((c) => {
    const p = courseProgressMap[c.id];
    const total = moduleCounts[c.id] || 0;
    return p && p.completed > 0 && p.completed < total;
  }).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Courses</h1>
        <p className="text-text-muted text-sm mt-1">Build your skills with structured learning paths</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{courses.length}</p>
          <p className="text-xs text-text-muted mt-0.5">Total Courses</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gold">{inProgress}</p>
          <p className="text-xs text-text-muted mt-0.5">In Progress</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green">{totalCompleted}</p>
          <p className="text-xs text-text-muted mt-0.5">Completed</p>
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            progress={courseProgressMap[course.id] || { completed: 0, total: 0, percent: 0 }}
            moduleCount={moduleCounts[course.id] || 0}
          />
        ))}
      </div>
    </div>
  );
}
