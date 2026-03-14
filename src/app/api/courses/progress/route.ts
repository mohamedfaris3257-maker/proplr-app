import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { course_id, module_id, status } = body as {
      course_id: string;
      module_id: string;
      status: 'in_progress' | 'completed';
    };

    if (!course_id || !module_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['in_progress', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const { error } = await supabase.from('student_course_progress').upsert(
      {
        user_id: user.id,
        course_id,
        module_id,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,course_id,module_id' }
    );

    if (error) {
      console.error('Progress upsert error:', error);
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Progress route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
