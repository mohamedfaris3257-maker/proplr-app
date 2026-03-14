'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, Crown } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import type { Profile } from '@/lib/types';

interface StudentRow extends Profile {
  created_at: string;
  total_hours?: number;
}

interface AdminStudentsPageProps {
  students: StudentRow[];
}

export function AdminStudentsPage({ students }: AdminStudentsPageProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'school_student' | 'uni_student'>('all');

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesType = typeFilter === 'all' || s.type === typeFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.school_name ?? '').toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [students, search, typeFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Students</h1>
          <p className="text-text-muted text-sm">{students.length} total enrolled</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email or school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
          />
        </div>
        <div className="flex gap-1 p-1 bg-surface-2 rounded-xl">
          {(['all', 'school_student', 'uni_student'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                typeFilter === t
                  ? 'bg-surface text-text-primary shadow-card'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {t === 'all' ? 'All' : t === 'school_student' ? 'School' : 'University'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">No students found.</div>
          ) : (
            filtered.map((student) => (
              <button
                key={student.id}
                onClick={() => router.push(`/admin/students/${student.user_id}`)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors text-left"
              >
                <Avatar name={student.name} photoUrl={student.photo_url} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary truncate">{student.name}</p>
                    {student.is_ambassador && (
                      <Crown className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate">{student.email}</p>
                </div>
                <div className="hidden sm:block text-xs text-text-muted truncate max-w-[140px]">
                  {student.school_name ?? '—'}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                  student.type === 'school_student' ? 'bg-gold/10 text-gold' :
                  student.type === 'uni_student' ? 'bg-blue/10 text-blue' : 'bg-purple/10 text-purple'
                }`}>
                  {student.type === 'school_student' ? 'School' : student.type === 'uni_student' ? 'Uni' : 'Admin'}
                </span>
                <span className="hidden md:block text-xs text-text-muted flex-shrink-0">
                  {formatDate(student.created_at)}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
