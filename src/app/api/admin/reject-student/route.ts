import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  // Authenticate the requesting user
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('type')
    .eq('user_id', user.id)
    .single();

  if (profile?.type !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Parse request body
  let body: { registration_id?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { registration_id, reason } = body;

  if (!registration_id || typeof registration_id !== 'string') {
    return NextResponse.json({ error: 'registration_id is required' }, { status: 400 });
  }

  // Verify registration exists
  const { data: registration, error: fetchError } = await supabase
    .from('student_registrations')
    .select('id, status')
    .eq('id', registration_id)
    .single();

  if (fetchError || !registration) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  }

  if (registration.status !== 'pending') {
    return NextResponse.json({ error: 'Registration is not pending' }, { status: 400 });
  }

  // Update status to rejected
  const { error: updateError } = await supabase
    .from('student_registrations')
    .update({
      status: 'rejected',
      rejection_reason: reason ?? null,
    })
    .eq('id', registration_id);

  if (updateError) {
    console.error('reject update error:', updateError);
    return NextResponse.json({ error: 'Failed to update registration status' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
