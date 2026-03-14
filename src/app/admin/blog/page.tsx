export const dynamic = 'force-dynamic';

import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminBlogPage } from '@/components/admin/AdminBlogPage';

export default async function AdminBlogRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('type').eq('user_id', user.id).single();
  if (profile?.type !== 'admin') redirect('/feed');

  return (
    <AppShell>
      <AdminBlogPage />
    </AppShell>
  );
}
