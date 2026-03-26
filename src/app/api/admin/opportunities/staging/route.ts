import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await adminClient
    .from('opportunities')
    .select('*')
    .eq('status', 'staging')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ opportunities: data || [] })
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, action } = body

    if (action === 'approve_all') {
      const { error } = await adminClient
        .from('opportunities')
        .update({ status: 'approved', published: true })
        .eq('status', 'staging')
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    if (action === 'approve') {
      const { error } = await adminClient
        .from('opportunities')
        .update({ status: 'approved', published: true })
        .eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    if (action === 'reject') {
      const { error } = await adminClient
        .from('opportunities')
        .update({ status: 'rejected' })
        .eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Staging PATCH error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
