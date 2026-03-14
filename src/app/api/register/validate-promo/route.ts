import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code || !code.trim()) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const supabase = await createClient();

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('promo_codes')
    .select('id, discount_type, discount_value, expires_at, usage_limit, usage_count, is_active')
    .eq('code', code.trim().toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('[validate-promo] query error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ valid: false });
  }

  // Check expiry
  if (data.expires_at && data.expires_at < now) {
    return NextResponse.json({ valid: false });
  }

  // Check usage limit
  if (
    data.usage_limit !== null &&
    data.usage_count !== null &&
    data.usage_count >= data.usage_limit
  ) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    discount_type: data.discount_type as 'percentage' | 'fixed',
    discount_value: data.discount_value as number,
  });
}
