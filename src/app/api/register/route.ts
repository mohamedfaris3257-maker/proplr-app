import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RegistrationBody {
  full_name: string;
  email: string;
  date_of_birth?: string | null;
  nationality?: string | null;
  school_name: string;
  grade?: string | null;
  class_name?: string | null;
  parent_name: string;
  parent_email: string;
  parent_phone?: string | null;
  parental_consent: boolean;
  photo_url?: string | null;
  interests?: string[];
  extracurriculars?: string | null;
  how_heard?: string | null;
  promo_code?: string | null;
}

export async function POST(req: NextRequest) {
  // Parse body
  let body: RegistrationBody;
  try {
    body = (await req.json()) as RegistrationBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Required field validation
  const {
    full_name,
    email,
    school_name,
    parent_name,
    parent_email,
    parental_consent,
    date_of_birth,
    nationality,
    grade,
    class_name,
    parent_phone,
    photo_url,
    interests,
    extracurriculars,
    how_heard,
    promo_code,
  } = body;

  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
    return NextResponse.json({ error: 'Full name is required.' }, { status: 422 });
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 422 });
  }
  if (!school_name || typeof school_name !== 'string' || !school_name.trim()) {
    return NextResponse.json({ error: 'School name is required.' }, { status: 422 });
  }
  if (!parent_name || typeof parent_name !== 'string' || !parent_name.trim()) {
    return NextResponse.json({ error: 'Parent/guardian name is required.' }, { status: 422 });
  }
  if (!parent_email || typeof parent_email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent_email)) {
    return NextResponse.json({ error: 'A valid parent email address is required.' }, { status: 422 });
  }
  if (!parental_consent) {
    return NextResponse.json({ error: 'Parental consent is required.' }, { status: 422 });
  }

  // Check for duplicate email
  const supabase = await createClient();

  const { data: existing, error: lookupError } = await supabase
    .from('student_registrations')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (lookupError) {
    console.error('[register] lookup error:', lookupError);
    return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json(
      { error: 'An application with this email already exists.' },
      { status: 409 }
    );
  }

  // Insert registration
  const { data: registration, error: insertError } = await supabase
    .from('student_registrations')
    .insert({
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      date_of_birth: date_of_birth ?? null,
      nationality: nationality?.trim() ?? null,
      school_name: school_name.trim(),
      grade: grade ?? null,
      class_name: class_name?.trim() ?? null,
      parent_name: parent_name.trim(),
      parent_email: parent_email.toLowerCase().trim(),
      parent_phone: parent_phone?.trim() ?? null,
      parental_consent: true,
      photo_url: photo_url ?? null,
      interests: Array.isArray(interests) ? interests : [],
      extracurriculars: extracurriculars?.trim() ?? null,
      how_heard: how_heard ?? null,
      promo_code: promo_code?.trim() ?? null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('[register] insert error:', insertError);
    return NextResponse.json(
      { error: 'Failed to save registration. Please try again.' },
      { status: 500 }
    );
  }

  // If a promo code matches a referral code, note the referrer (we credit them on approval)
  // No action needed here — crediting happens in approve-student route when status → approved

  return NextResponse.json({ success: true, id: registration.id }, { status: 201 });
}
