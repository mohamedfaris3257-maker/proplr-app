import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client using the service role key.
 * This BYPASSES Row Level Security — use only in server-side API routes.
 * NEVER import this in client components or expose the key.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('[Admin Client] NEXT_PUBLIC_SUPABASE_URL is not set');
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  }

  if (!serviceRoleKey) {
    console.error('[Admin Client] SUPABASE_SERVICE_ROLE_KEY is not set. Available env vars:',
      Object.keys(process.env).filter(k => k.includes('SUPA')).join(', ') || 'none'
    );
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  console.log('[Admin Client] Creating admin client with service role key (length:', serviceRoleKey.length, ')');

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Try to create an admin client; if the service role key is missing,
 * return null so callers can fall back to the regular server client.
 */
export function tryCreateAdminClient() {
  try {
    return createAdminClient();
  } catch (err) {
    console.error('[Admin Client] Fallback to session client:', (err as Error).message);
    return null;
  }
}
