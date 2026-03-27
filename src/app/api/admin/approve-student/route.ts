import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { sendEmail, welcomeEmailHtml } from '@/lib/email';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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
  let body: { registration_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { registration_id } = body;

  if (!registration_id || typeof registration_id !== 'string') {
    return NextResponse.json({ error: 'registration_id is required' }, { status: 400 });
  }

  // Fetch the registration
  const { data: registration, error: fetchError } = await supabase
    .from('student_registrations')
    .select('*')
    .eq('id', registration_id)
    .single();

  if (fetchError || !registration) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  }

  if (registration.status !== 'pending') {
    return NextResponse.json({ error: 'Registration is not pending' }, { status: 400 });
  }

  // Create Supabase auth user
  const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
    email: registration.email,
    email_confirm: true,
    user_metadata: { name: registration.full_name },
  });

  if (createUserError || !authData.user) {
    console.error('createUser error:', createUserError);
    return NextResponse.json({ error: 'Failed to create auth user' }, { status: 500 });
  }

  // Generate a referral code
  const referral_code = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Create profile
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      user_id: authData.user.id,
      name: registration.full_name,
      email: registration.email,
      type: 'school_student',
      school_name: registration.school_name ?? null,
      grade: registration.grade ?? null,
      photo_url: registration.photo_url ?? null,
      career_interests: registration.interests ?? [],
      username: null,
      referral_code,
    });

  if (profileError) {
    console.error('profile insert error:', profileError);
    // Roll back auth user creation to keep state consistent
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }

  // Update registration status to approved
  const { error: updateError } = await supabaseAdmin
    .from('student_registrations')
    .update({ status: 'approved' })
    .eq('id', registration_id);

  if (updateError) {
    console.error('registration update error:', updateError);
    return NextResponse.json({ error: 'Failed to update registration status' }, { status: 500 });
  }

  // Send password reset email so the student can set their password
  const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(
    registration.email,
    { redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback' }
  );

  if (resetError) {
    // Non-fatal — log but don't fail the whole request
    console.error('resetPasswordForEmail error:', resetError);
  }

  // Send welcome email via Resend (non-fatal)
  await sendEmail({
    to: registration.email,
    subject: `Welcome to Proplr, ${registration.full_name}!`,
    html: welcomeEmailHtml(registration.full_name),
  }).catch((err: unknown) => console.error('welcomeEmail error:', err));

  // Credit referrer if promo_code matches a referral code
  if (registration.promo_code) {
    const { data: referrer } = await supabaseAdmin
      .from('profiles')
      .select('user_id, points')
      .eq('referral_code', registration.promo_code)
      .maybeSingle();

    if (referrer) {
      await supabaseAdmin
        .from('profiles')
        .update({ points: (referrer.points ?? 0) + 100 })
        .eq('user_id', referrer.user_id);
    }
  }

  return NextResponse.json({ success: true });
}
