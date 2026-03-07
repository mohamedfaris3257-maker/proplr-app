export const dynamic = 'force-dynamic';

import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('type')
    .eq('user_id', user!.id)
    .single();

  if (profile?.type !== 'admin') {
    redirect('/feed');
  }

  // Fetch admin stats
  const [
    { count: totalUsers },
    { count: schoolStudents },
    { count: uniStudents },
    { count: totalEvents },
    { count: totalOpportunities },
    { count: totalApplications },
    { data: recentUsers },
    { data: pendingHours },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('type', 'school_student'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('type', 'uni_student'),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('opportunities').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('pillar_hours').select('*, profiles(name, email)').eq('status', 'pending').limit(20),
  ]);

  return (
    <AppShell>
      <AdminDashboard
        stats={{
          totalUsers: totalUsers || 0,
          schoolStudents: schoolStudents || 0,
          uniStudents: uniStudents || 0,
          totalEvents: totalEvents || 0,
          totalOpportunities: totalOpportunities || 0,
          totalApplications: totalApplications || 0,
        }}
        recentUsers={recentUsers || []}
        pendingHours={pendingHours || []}
      />
    </AppShell>
  );
}
