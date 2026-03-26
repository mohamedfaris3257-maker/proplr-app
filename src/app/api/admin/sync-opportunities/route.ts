import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tryCreateAdminClient } from '@/lib/supabase/admin';

// Search across multiple countries — no strict location filters
const SEARCH_CONFIGS = [
  { country: 'ae', q: 'internship' },
  { country: 'ae', q: 'graduate' },
  { country: 'ae', q: 'entry level' },
  { country: 'ae', q: 'job' },
  { country: 'gb', q: 'internship dubai' },
  { country: 'gb', q: 'remote internship' },
  { country: 'gb', q: 'graduate remote' },
  { country: 'us', q: 'remote internship' },
  { country: 'us', q: 'remote graduate entry level' },
];

// Map Adzuna categories to our opportunity types
function mapCategory(category: string): string {
  const lower = (category || '').toLowerCase();
  if (lower.includes('intern')) return 'internship';
  if (lower.includes('volunteer')) return 'volunteering';
  if (lower.includes('graduate') || lower.includes('entry')) return 'job';
  return 'internship';
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

// Fetch jobs from Adzuna for a specific country/query
async function fetchAdzunaJobs(
  country: string,
  query: string,
  appId: string,
  appKey: string
): Promise<any[]> {
  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: '15',
    what: query,
    content_type: 'application/json',
    sort_by: 'date',
    max_days_old: '90',
  });

  // No location filter — let the search query handle targeting
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params}`;

  console.log('Fetching:', url.replace(appKey, 'KEY_HIDDEN'));

  const res = await fetch(url);

  if (!res.ok) {
    console.error(`Adzuna ${country} error:`, res.status, await res.text());
    return [];
  }

  const data = await res.json();
  console.log(`Adzuna ${country} "${query}": ${data.results?.length || 0} results, total: ${data.count}`);

  // Log sample result for debugging
  if (data.results?.length > 0) {
    const sample = data.results[0];
    console.log('Sample result:', sample.title, '|', sample.company?.display_name, '|', sample.location?.display_name);
  }

  return data.results || [];
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
    const queryResults: Record<string, number> = {};

    let totalSkipped = 0;

    for (const { country, q } of SEARCH_CONFIGS) {
      try {
        const jobs = await fetchAdzunaJobs(country, q, ADZUNA_APP_ID, ADZUNA_APP_KEY);
        // Only skip jobs missing a title or apply link
        const valid = jobs.filter((job: any) => {
          if (!job.title && !job.redirect_url) {
            totalSkipped++;
            return false;
          }
          return true;
        });
        queryResults[`${country}:${q}`] = valid.length;
        allItems = allItems.concat(valid);
      } catch (err) {
        console.error(`Error fetching ${country} "${q}":`, err);
        queryResults[`${country}:${q}`] = 0;
      }
    }

    console.log('Total skipped (no title/link):', totalSkipped);

    console.log('Query results summary:', JSON.stringify(queryResults));

    if (allItems.length === 0) {
      return NextResponse.json({
        message: 'No results from Adzuna across all queries',
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
