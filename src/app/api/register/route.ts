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
  parent_name?: string | null;
  parent_email?: string | null;
  parent_phone?: string | null;
  parental_consent?: boolean;
  photo_url?: string | null;
  interests?: string[];
  extracurriculars?: string | null;
  how_heard?: string | null;
  promo_code?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    let body: RegistrationBody;
    try {
      body = (await req.json()) as RegistrationBody;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    console.log('[register] body:', JSON.stringify(body));

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

    // Only require name, email, school
    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 422 });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 422 });
    }
    if (!school_name || typeof school_name !== 'string' || !school_name.trim()) {
      return NextResponse.json({ error: 'School name is required.' }, { status: 422 });
    }

    // Parent fields are optional — no validation required

    const supabase = await createClient();

    // Check for duplicate email
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
      // Already exists — just return success (non-blocking call, don't fail)
      return NextResponse.json({ success: true, id: existing.id }, { status: 200 });
    }

    // Insert registration record
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
        parent_name: parent_name?.trim() ?? null,
        parent_email: parent_email?.toLowerCase().trim() ?? null,
        parent_phone: parent_phone?.trim() ?? null,
        parental_consent: parental_consent ?? false,
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

    return NextResponse.json({ success: true, id: registration.id }, { status: 201 });
  } catch (err: any) {
    console.error('[register] unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 });
  }
}
