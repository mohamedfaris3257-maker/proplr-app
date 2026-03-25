import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// GET /api/people/search?q=searchterm
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ people: [] });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;

  const { data: people, error } = await db
    .from('profiles')
    .select('id, user_id, name, type, school_name, photo_url')
    .ilike('name', `%${q.trim()}%`)
    .neq('user_id', user.id)
    .limit(10);

  if (error) {
    console.error('[People Search]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ people: people || [] });
}
