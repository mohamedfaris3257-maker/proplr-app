export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { StudentDetailPage } from '@/components/admin/StudentDetailPage';

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function StudentDetailRoute({ params }: Props) {
  const { userId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: student }, { data: hours }, { data: certificates }] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', userId).single(),
    supabase.from('pillar_hours').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('certificates').select('*').eq('user_id', userId).order('issued_at', { ascending: false }),
  ]);

  if (!student) notFound();

  return (
    <StudentDetailPage
      student={student}
      hours={hours ?? []}
      certificates={certificates ?? []}
    />
  );
}
