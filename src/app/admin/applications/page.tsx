export const dynamic = 'force-dynamic';

import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExternalApplicationsManager } from '@/components/admin/ExternalApplicationsManager';

export default async function AdminApplicationsRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('type').eq('user_id', user.id).single();
  if (profile?.type !== 'admin') redirect('/feed');

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">External Applications</h1>
          <p className="text-text-muted text-sm">Partner, mentor, innovation, summer camp & job postings</p>
        </div>
        <ExternalApplicationsManager />
      </div>
    </AppShell>
  );
}
