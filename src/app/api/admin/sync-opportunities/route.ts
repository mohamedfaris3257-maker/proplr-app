import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

const SEARCH_QUERIES = [
  'internship',
  'graduate',
  'trainee',
  'entry level',
  'junior',
];

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
    title: item.title?.replace(/<\/?[^>]+(>|$)/g, '') || 'Untitled',
    company: item.company?.display_name || 'Unknown Company',
    description: item.description?.replace(/<\/?[^>]+(>|$)/g, '') || '',
    type: mapCategory(item.category?.label || ''),
    pillar_tags: ['Career Readiness'],
    audience: 'both',
    is_active: false,
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

// Fetch jobs from Adzuna for a specific country/location
async function fetchAdzunaJobs(
  query: string,
  appId: string,
  appKey: string,
  country = 'ae',
  where = 'Dubai'
): Promise<any[]> {
  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: '20',
    what: query,
    sort_by: 'date',
    max_days_old: '60',
  });

  if (where) params.set('where', where);

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params}`;

  console.log('Fetching:', url.replace(appKey, 'KEY_HIDDEN'));

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  console.log('Adzuna response status:', res.status);

  if (!res.ok) {
    const text = await res.text();
    console.error('Adzuna error response:', text);
    throw new Error(`Adzuna API error: ${res.status} - ${text}`);
  }

  const data = await res.json();
  console.log(`Query "${query}" (${country}/${where || 'any'}): ${data.results?.length || 0} results, total: ${data.count}`);
  return data.results || [];
}

// Try UAE first, fall back to UK remote jobs
async function fetchWithFallback(
  query: string,
  appId: string,
  appKey: string
): Promise<any[]> {
  try {
    // Try UAE / Dubai first
    const uaeResults = await fetchAdzunaJobs(query, appId, appKey, 'ae', 'Dubai');
    if (uaeResults.length > 0) return uaeResults;

    // Try UAE without location filter
    const uaeWideResults = await fetchAdzunaJobs(query, appId, appKey, 'ae', '');
    if (uaeWideResults.length > 0) return uaeWideResults;

    // Fallback: UK with remote filter (many remote jobs available to UAE students)
    const remoteResults = await fetchAdzunaJobs(query + ' remote', appId, appKey, 'gb', '');
    return remoteResults;
  } catch (err) {
    console.error(`[Adzuna] Error fetching "${query}":`, err);
    return [];
  }
}

// POST — manually trigger sync (admin only)
// GET  — can be called by Vercel cron
export async function GET(req: NextRequest) {
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
  // Read env vars at runtime
  const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
  const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

  console.log('ENV CHECK - ADZUNA_APP_ID:', ADZUNA_APP_ID ? `SET (${ADZUNA_APP_ID.slice(0, 4)}...)` : 'MISSING');
  console.log('ENV CHECK - ADZUNA_APP_KEY:', ADZUNA_APP_KEY ? `SET (${ADZUNA_APP_KEY.slice(0, 4)}...)` : 'MISSING');

  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    return NextResponse.json({
      error: 'Adzuna API credentials not configured',
      debug: {
        hasAppId: !!ADZUNA_APP_ID,
        hasAppKey: !!ADZUNA_APP_KEY,
      },
    }, { status: 500 });
  }

  const db = tryCreateAdminClient();
  if (!db) {
    return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });
  }

  try {
    let allItems: any[] = [];
    const queryResults: Record<string, { count: number; source: string }> = {};

    for (const query of SEARCH_QUERIES) {
      const jobs = await fetchWithFallback(query, ADZUNA_APP_ID, ADZUNA_APP_KEY);
      queryResults[query] = { count: jobs.length, source: jobs.length > 0 ? 'found' : 'none' };
      allItems = allItems.concat(jobs);
    }

    console.log('Query results summary:', JSON.stringify(queryResults));

    if (allItems.length === 0) {
      return NextResponse.json({
        message: 'No results from Adzuna across all queries and fallbacks',
        imported: 0,
        queryResults,
      });
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
      return NextResponse.json({
        message: 'All items already imported',
        imported: 0,
        total_fetched: uniqueItems.size,
        queryResults,
      });
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
      queryResults,
    });
  } catch (err: any) {
    console.error('[Adzuna Sync] Error:', err);
    return NextResponse.json({ error: err.message || 'Sync failed' }, { status: 500 });
  }
}
