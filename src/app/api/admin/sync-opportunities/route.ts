import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs';

// Map Adzuna categories to our opportunity types
function mapCategory(category: string): string {
  const lower = (category || '').toLowerCase();
  if (lower.includes('intern')) return 'internship';
  if (lower.includes('volunteer')) return 'volunteering';
  if (lower.includes('graduate') || lower.includes('entry')) return 'job';
  return 'internship'; // default for student-focused
}

// Map Adzuna results to our opportunity schema
function mapAdzunaToOpportunity(item: any) {
  return {
    title: item.title?.replace(/<\/?[^>]+(>|$)/g, '') || 'Untitled', // strip HTML tags
    company: item.company?.display_name || 'Unknown Company',
    description: item.description?.replace(/<\/?[^>]+(>|$)/g, '') || '',
    type: mapCategory(item.category?.label || ''),
    pillar_tags: ['Career Readiness'],
    audience: 'both',
    is_active: false, // Not active until approved
    external_url: item.redirect_url || null,
    source: 'adzuna',
    source_id: String(item.id),
    salary_min: item.salary_min || null,
    salary_max: item.salary_max || null,
    location: item.location?.display_name || null,
    expires_at: null,
    status: 'staging',
  };
}

// POST — manually trigger sync (admin only)
// GET  — can be called by Vercel cron
export async function GET(req: NextRequest) {
  // Verify cron secret for automated calls
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = tryCreateAdminClient() || supabase;
    const { data: profile } = await db
      .from('profiles')
      .select('type')
      .eq('user_id', user.id)
      .single();

    if (profile?.type !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }
  }

  return runSync();
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = tryCreateAdminClient() || supabase;
  const { data: profile } = await db
    .from('profiles')
    .select('type')
    .eq('user_id', user.id)
    .single();

  if (profile?.type !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  return runSync();
}

async function runSync() {
  // Read env vars at runtime, not module load time
  const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
  const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
  const ADZUNA_COUNTRY = process.env.ADZUNA_COUNTRY || 'ae';

  console.log('ENV CHECK - ADZUNA_APP_ID:', ADZUNA_APP_ID ? `SET (${ADZUNA_APP_ID.slice(0, 4)}...)` : 'MISSING');
  console.log('ENV CHECK - ADZUNA_APP_KEY:', ADZUNA_APP_KEY ? `SET (${ADZUNA_APP_KEY.slice(0, 4)}...)` : 'MISSING');
  console.log('ENV CHECK - ADZUNA_COUNTRY:', ADZUNA_COUNTRY);

  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    return NextResponse.json({
      error: 'Adzuna API credentials not configured',
      debug: {
        hasAppId: !!ADZUNA_APP_ID,
        hasAppKey: !!ADZUNA_APP_KEY,
        country: ADZUNA_COUNTRY,
      },
    }, { status: 500 });
  }

  const db = tryCreateAdminClient();
  if (!db) {
    return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });
  }

  try {
    // Search for student-relevant opportunities
    const searchTerms = ['internship', 'graduate', 'entry level', 'work experience'];
    let allItems: any[] = [];

    for (const term of searchTerms) {
      const url = `${ADZUNA_BASE_URL}/${ADZUNA_COUNTRY}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=10&what=${encodeURIComponent(term)}&sort_by=date`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error(`[Adzuna Sync] Failed to fetch "${term}":`, res.statusText);
        continue;
      }

      const data = await res.json();
      if (data.results) {
        allItems = allItems.concat(data.results);
      }
    }

    if (allItems.length === 0) {
      return NextResponse.json({ message: 'No results from Adzuna', imported: 0 });
    }

    // Deduplicate by Adzuna ID
    const uniqueItems = new Map<string, any>();
    for (const item of allItems) {
      uniqueItems.set(String(item.id), item);
    }

    // Check which source_ids already exist
    const sourceIds = Array.from(uniqueItems.keys());
    const { data: existing } = await db
      .from('opportunities')
      .select('source_id')
      .eq('source', 'adzuna')
      .in('source_id', sourceIds);

    const existingIds = new Set((existing || []).map((e: any) => e.source_id));

    // Filter out already-imported items
    const newItems = Array.from(uniqueItems.values())
      .filter((item) => !existingIds.has(String(item.id)));

    if (newItems.length === 0) {
      return NextResponse.json({ message: 'All items already imported', imported: 0 });
    }

    // Map and insert
    const mapped = newItems.map(mapAdzunaToOpportunity);

    const { data: inserted, error } = await db
      .from('opportunities')
      .insert(mapped)
      .select('id');

    if (error) {
      console.error('[Adzuna Sync] Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Imported ${inserted?.length || 0} new opportunities`,
      imported: inserted?.length || 0,
      total_fetched: uniqueItems.size,
      duplicates_skipped: uniqueItems.size - newItems.length,
    });
  } catch (err: any) {
    console.error('[Adzuna Sync] Error:', err);
    return NextResponse.json({ error: err.message || 'Sync failed' }, { status: 500 });
  }
}
