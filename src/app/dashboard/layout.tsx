import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MessagingWidget } from '@/components/dashboard/MessagingWidget';
import { WelcomePopup } from '@/components/dashboard/WelcomePopup';
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

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // If no profile exists, create a minimal one so dashboard loads
  if (!profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({ user_id: user.id, name: user.email?.split('@')[0] || 'Student' })
      .select('*')
      .single();
    if (!newProfile) redirect('/login');
    profile = newProfile;
  }

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
      <MessagingWidget
        currentUserId={user.id}
        currentUserName={(profile as Profile).name || ''}
      />
      <Suspense fallback={null}>
        <WelcomePopup name={(profile as Profile).name || ''} />
      </Suspense>
    </div>
  );
}
