export const dynamic = 'force-dynamic';

import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminFaqPage } from '@/components/admin/AdminFaqPage';

export default async function AdminFaqRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('type').eq('user_id', user.id).single();
  if (profile?.type !== 'admin') redirect('/feed');

  return (
    <AppShell>
      <AdminFaqPage />
    </AppShell>
  );
}
