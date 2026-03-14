import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { error } = await supabase.from('club_interest_forms').insert({
      school_name: body.school_name,
      contact_name: body.contact_name,
      contact_role: body.contact_role,
      email: body.email,
      phone: body.phone || null,
      grade_range: body.grade_range || null,
      estimated_students: body.estimated_students ? parseInt(body.estimated_students) : null,
      start_timeframe: body.start_timeframe || null,
      referral_source: body.referral_source || null,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Submission failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
