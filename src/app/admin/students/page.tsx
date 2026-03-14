export const dynamic = 'force-dynamic';

import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminStudentsPage } from '@/components/admin/AdminStudentsPage';

export default async function AdminStudentsRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('type').eq('user_id', user.id).single();
  if (profile?.type !== 'admin') redirect('/feed');

  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .in('type', ['school_student', 'uni_student'])
    .order('created_at', { ascending: false });

  return (
    <AppShell>
      <AdminStudentsPage students={students ?? []} />
    </AppShell>
  );
}
