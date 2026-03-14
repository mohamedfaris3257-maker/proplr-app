import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { error } = await supabase.from('summer_camp_registrations').insert({
      student_name: body.student_name,
      email: body.email,
      phone: body.phone || null,
      dob: body.dob || null,
      school: body.school || null,
      grade: body.grade || null,
      parent_name: body.parent_name || null,
      parent_email: body.parent_email || null,
      parent_phone: body.parent_phone || null,
      promo_code: body.promo_code || null,
    });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
