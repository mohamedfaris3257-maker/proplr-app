import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

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
  let body: {
    email?: string;
    password?: string;
    name?: string;
    school_name?: string;
    grade?: string;
    type?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, password, name, school_name, grade, type } = body;

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: 'email, password, and name are required' },
      { status: 400 }
    );
  }

  const studentType = type === 'uni_student' ? 'uni_student' : 'school_student';

  // Create Supabase auth user with admin API
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    console.error('createUser error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create auth user' },
      { status: 500 }
    );
  }

  // Create profile record
  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    user_id: data.user.id,
    name,
    email,
    type: studentType,
    school_name: school_name || null,
    grade: grade || null,
    career_interests: [],
    subscription_status: 'free',
    is_ambassador: false,
    dibz_discount_active: false,
  });

  if (profileError) {
    console.error('profile insert error:', profileError);
    // Roll back auth user creation
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    user: { id: data.user.id, email: data.user.email, name },
  });
}
