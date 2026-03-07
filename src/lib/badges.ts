import type { SupabaseClient } from '@supabase/supabase-js';
import { BADGE_META, type BadgeType, type PillarName } from '@/lib/types';

export async function checkAndAwardBadges(
  userId: string,
  supabase: SupabaseClient,
  trigger: 'post' | 'rsvp' | 'certificate'
): Promise<void> {
  // Fetch existing badges for this user
  const { data: existingBadges } = await supabase
    .from('badges')
    .select('badge_type')
    .eq('user_id', userId);

  const earned = new Set((existingBadges ?? []).map((b: { badge_type: string }) => b.badge_type));

  const toAward: BadgeType[] = [];

  if (trigger === 'post') {
    // first_post: check if post count === 1
    if (!earned.has('first_post')) {
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (count === 1) {
        toAward.push('first_post');
      }
    }

    // explorer: check if distinct pillar_tags === 6
    if (!earned.has('explorer')) {
      const { data: pillarRows } = await supabase
        .from('posts')
        .select('pillar_tag')
        .eq('user_id', userId)
        .not('pillar_tag', 'is', null);

      const distinctPillars = new Set((pillarRows ?? []).map((r: { pillar_tag: string }) => r.pillar_tag));
      if (distinctPillars.size >= 6) {
        toAward.push('explorer');
      }
    }
  }

  if (trigger === 'rsvp') {
    // networker: RSVP count >= 5
    if (!earned.has('networker')) {
      const { count } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if ((count ?? 0) >= 5) {
        toAward.push('networker');
      }
    }
  }

  if (trigger === 'certificate') {
    const { count: certCount } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const count = certCount ?? 0;

    // achiever: at least 1 certificate
    if (!earned.has('achiever') && count >= 1) {
      toAward.push('achiever');
    }

    // all_star: all 6 pillar certificates
    if (!earned.has('all_star') && count >= 6) {
      toAward.push('all_star');
    }
  }

  // Award each badge and insert notification
  for (const badge_type of toAward) {
    const now = new Date().toISOString();

    await supabase.from('badges').insert({
      user_id: userId,
      badge_type,
      earned_at: now,
    });
    // ON CONFLICT DO NOTHING equivalent — ignore duplicate errors silently

    const meta = BADGE_META[badge_type];
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'badge',
      title: `Badge Earned: ${meta.label}`,
      message: meta.description,
      link: '/profile',
    });
  }
}

export async function updateStreak(
  userId: string,
  pillarName: PillarName,
  supabase: SupabaseClient
): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Fetch existing streak for user + pillar
  const { data: existing } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .eq('pillar_name', pillarName)
    .maybeSingle();

  if (!existing) {
    // No streak record — insert fresh
    await supabase.from('streaks').insert({
      user_id: userId,
      pillar_name: pillarName,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today,
    });
    return;
  }

  // Calculate days since last activity
  const lastDate = new Date(existing.last_activity_date);
  const todayDate = new Date(today);
  const diffMs = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let newCurrentStreak: number;
  if (diffDays <= 7) {
    // Within 7 days — increment streak
    newCurrentStreak = existing.current_streak + 1;
  } else {
    // More than 7 days — reset streak
    newCurrentStreak = 1;
  }

  const newLongestStreak = Math.max(existing.longest_streak, newCurrentStreak);

  await supabase
    .from('streaks')
    .update({
      current_streak: newCurrentStreak,
      longest_streak: newLongestStreak,
      last_activity_date: today,
    })
    .eq('user_id', userId)
    .eq('pillar_name', pillarName);
}
