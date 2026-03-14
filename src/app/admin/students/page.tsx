export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { AdminStudentsPage } from '@/components/admin/AdminStudentsPage';

export default async function AdminStudentsRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .in('type', ['school_student', 'uni_student'])
    .order('created_at', { ascending: false });

  return <AdminStudentsPage students={students ?? []} />;
}
