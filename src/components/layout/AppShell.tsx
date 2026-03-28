import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import type { Profile } from '@/lib/types';

interface AppShellProps {
  children: React.ReactNode;
}

export async function AppShell({ children }: AppShellProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) redirect('/dashboard');

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 min-h-screen pb-16 lg:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
