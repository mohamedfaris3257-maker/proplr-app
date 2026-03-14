import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { error } = await supabase.from('partner_applications').insert({
      type: body.type,
      org_name: body.org_name,
      contact_name: body.contact_name,
      role: body.role || null,
      email: body.email,
      phone: body.phone || null,
      partnership_types: body.partnership_types || null,
      institution_type: body.institution_type || null,
      student_count: body.student_count ? parseInt(body.student_count) : null,
      interests: body.interests || null,
      notes: body.notes || null,
    });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
