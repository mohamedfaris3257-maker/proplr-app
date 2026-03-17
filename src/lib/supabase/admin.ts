import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client using the service role key.
 * This BYPASSES Row Level Security — use only in server-side API routes.
 * NEVER import this in client components or expose the key.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
