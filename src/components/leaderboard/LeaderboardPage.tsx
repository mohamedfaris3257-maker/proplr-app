import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

interface SchoolEntry {
  school_name: string;
  total_hours: number;
  student_count: number;
  top_pillar: string;
}

interface IndividualEntry {
  name: string;
  school: string;
  photo_url: string | null;
  total_hours: number;
  user_id: string;
}

interface LeaderboardPageProps {
  schools: SchoolEntry[];
  individuals: IndividualEntry[];
}

function rankStyle(rank: number): { row: string; badge: string } {
  if (rank === 1) {
    return {
      row: 'bg-[#E8A838]/10 border-l-2 border-l-[#E8A838]',
      badge: 'bg-[#E8A838] text-background font-bold',
    };
  }
  if (rank === 2) {
    return {
      row: 'bg-[#C0C0C0]/10 border-l-2 border-l-[#C0C0C0]',
      badge: 'bg-[#C0C0C0] text-background font-bold',
    };
  }
  if (rank === 3) {
    return {
      row: 'bg-[#CD7F32]/10 border-l-2 border-l-[#CD7F32]',
      badge: 'bg-[#CD7F32] text-background font-bold',
    };
  }
  return {
    row: 'hover:bg-surface-2 transition-colors',
    badge: 'bg-surface-2 text-text-muted',
  };
}

function RankBadge({ rank }: { rank: number }) {
  const { badge } = rankStyle(rank);

  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${badge}`}
    >
      {rank === 1 ? <Trophy className="w-3.5 h-3.5" /> : rank}
    </span>
  );
}

export function LeaderboardPage({ schools, individuals }: LeaderboardPageProps) {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Simple header */}
      <header className="bg-surface border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8A838] to-[#c8881e] flex items-center justify-center">
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="#0d1624" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5L10 0Z" />
          </svg>
        </div>
        <span className="text-lg font-bold text-text-primary tracking-tight">proplr</span>
        <div className="ml-auto">
          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Page title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-text-primary">Leaderboard</h1>
          <p className="text-text-muted text-sm">
            Top UAE schools building the next generation
          </p>
        </div>

        {/* School leaderboard */}
        <section className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-text-primary">School Leaderboard</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-text-muted font-medium w-16">Rank</th>
                  <th className="text-left px-5 py-3 text-text-muted font-medium">School</th>
                  <th className="text-right px-5 py-3 text-text-muted font-medium">Total Hours</th>
                  <th className="text-right px-5 py-3 text-text-muted font-medium">Students</th>
                  <th className="text-left px-5 py-3 text-text-muted font-medium">Top Pillar</th>
                </tr>
              </thead>
              <tbody>
                {schools.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-text-muted">
                      No data yet — be the first school to earn hours!
                    </td>
                  </tr>
                ) : (
                  schools.map((school, idx) => {
                    const rank = idx + 1;
                    const { row } = rankStyle(rank);
                    return (
                      <tr key={school.school_name} className={`border-b border-border last:border-0 ${row}`}>
                        <td className="px-5 py-3">
                          <RankBadge rank={rank} />
                        </td>
                        <td className="px-5 py-3 font-medium text-text-primary">
                          {school.school_name}
                        </td>
                        <td className="px-5 py-3 text-right text-text-primary font-semibold">
                          {school.total_hours.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-right text-text-secondary">
                          {school.student_count.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-text-secondary">
                          {school.top_pillar || '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Individual leaderboard */}
        <section className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-text-primary">Individual Leaderboard</h2>
            <p className="text-xs text-text-muted mt-0.5">Top 50 students by approved pillar hours</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-text-muted font-medium w-16">Rank</th>
                  <th className="text-left px-5 py-3 text-text-muted font-medium">Student</th>
                  <th className="text-left px-5 py-3 text-text-muted font-medium">School</th>
                  <th className="text-right px-5 py-3 text-text-muted font-medium">Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {individuals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-text-muted">
                      No data yet — start logging hours to appear here!
                    </td>
                  </tr>
                ) : (
                  individuals.map((student, idx) => {
                    const rank = idx + 1;
                    const { row } = rankStyle(rank);
                    return (
                      <tr
                        key={student.user_id}
                        className={`border-b border-border last:border-0 ${row}`}
                      >
                        <td className="px-5 py-3">
                          <RankBadge rank={rank} />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={student.name} photoUrl={student.photo_url} size="xs" />
                            <span className="font-medium text-text-primary">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-text-secondary">
                          {student.school || '—'}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-text-primary">
                          {student.total_hours.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div className="card p-6 text-center space-y-3">
          <p className="text-text-secondary text-sm">
            Want to climb the leaderboard? Sign in and start logging your pillar hours.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#E8A838] text-background font-semibold px-5 py-2.5 rounded-lg hover:bg-[#c8881e] transition-colors duration-200 text-sm"
          >
            Sign in to join the leaderboard
          </Link>
        </div>
      </main>
    </div>
  );
}
