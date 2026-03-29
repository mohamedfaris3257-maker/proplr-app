import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Must be logged in
  if (!user) redirect('/login');

  // Must be an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('type')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.type !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div
      data-theme="light"
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#f0f2f8',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
        {children}
      </main>
    </div>
  );
}
