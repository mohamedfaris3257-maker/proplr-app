import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code, points')
    .eq('user_id', user.id)
    .single();

  if (!profile?.referral_code) {
    return NextResponse.json({ referral_code: null, referral_count: 0, points: profile?.points ?? 0 });
  }

  // Count how many registrations used this referral code as promo_code
  const { count } = await supabase
    .from('student_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('promo_code', profile.referral_code)
    .eq('status', 'approved');

  return NextResponse.json({
    referral_code: profile.referral_code,
    referral_count: count ?? 0,
    points: profile.points ?? 0,
  });
}
