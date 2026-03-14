import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { error } = await supabase.from('showcase_registrations').insert({
      school_name: body.school_name,
      contact_name: body.contact_name,
      email: body.email,
      student_count: body.student_count ? parseInt(body.student_count) : null,
      notes: body.notes || null,
    });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
