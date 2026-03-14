import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { error } = await supabase.from('mentor_applications').insert({
      name: body.name,
      company: body.company || null,
      role: body.role || null,
      email: body.email,
      phone: body.phone || null,
      expertise: body.expertise || null,
      availability: body.availability || null,
    });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
