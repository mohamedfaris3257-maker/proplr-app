import { createClient } from '@/lib/supabase/server';
import { LeaderboardPage } from '@/components/leaderboard/LeaderboardPage';

export const revalidate = 300;

interface RawHourRow {
  hours: number;
  pillar_name: string;
  profiles: {
    school_name: string | null;
    user_id: string;
    name: string;
    photo_url: string | null;
  } | null;
}

export default async function LeaderboardRoute() {
  const supabase = await createClient();

  const { data: hourRows } = await supabase
    .from('pillar_hours')
    .select('hours, pillar_name, profiles(school_name, user_id, name, photo_url)')
    .eq('status', 'approved');

  const rows = (hourRows ?? []) as unknown as RawHourRow[];

  const schoolMap = new Map<string, { total_hours: number; student_count: Set<string>; pillar_counts: Record<string, number> }>();
  for (const row of rows) {
    const profile = row.profiles;
    if (!profile?.school_name) continue;
    const school = profile.school_name;
    if (!schoolMap.has(school)) schoolMap.set(school, { total_hours: 0, student_count: new Set(), pillar_counts: {} });
    const entry = schoolMap.get(school)!;
    entry.total_hours += row.hours;
    entry.student_count.add(profile.user_id);
    const pillar = row.pillar_name;
    if (pillar) entry.pillar_counts[pillar] = (entry.pillar_counts[pillar] ?? 0) + row.hours;
  }

  const schools = Array.from(schoolMap.entries())
    .map(([school_name, data]) => {
      const top_pillar = Object.entries(data.pillar_counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
      return { school_name, total_hours: data.total_hours, student_count: data.student_count.size, top_pillar };
    })
    .sort((a, b) => b.total_hours - a.total_hours)
    .slice(0, 20);

  const individualMap = new Map<string, { name: string; school: string; photo_url: string | null; total_hours: number }>();
  for (const row of rows) {
    const profile = row.profiles;
    if (!profile?.user_id) continue;
    const uid = profile.user_id;
    if (!individualMap.has(uid)) individualMap.set(uid, { name: profile.name ?? 'Unknown', school: profile.school_name ?? '', photo_url: profile.photo_url ?? null, total_hours: 0 });
    individualMap.get(uid)!.total_hours += row.hours;
  }

  const individuals = Array.from(individualMap.entries())
    .map(([user_id, data]) => ({ user_id, ...data }))
    .sort((a, b) => b.total_hours - a.total_hours)
    .slice(0, 50);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <LeaderboardPage schools={schools} individuals={individuals} />
    </div>
  );
}
