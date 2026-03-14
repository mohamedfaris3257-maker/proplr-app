import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import type { Profile } from '@/lib/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) redirect('/onboarding');

  return (
    <div
      data-theme="light"
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'DM Sans', sans-serif",
        background: '#f0f2f8',
        color: '#071629',
      }}
    >
      <DashboardSidebar profile={profile as Profile} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
        {children}
      </div>
    </div>
  );
}
