import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PublicProfile } from '@/components/profile/PublicProfile';
import { PILLARS } from '@/lib/types';
import type { Profile, Certificate, PortfolioItem, PillarHour, PillarName } from '@/lib/types';

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} | Proplr`,
    description: `View ${username}'s Proplr profile`,
  };
}

export const revalidate = 60;

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // Fetch profile by username
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  // Only show public profiles for uni_student type
  if (!profile || (profile as Profile).type === 'school_student') {
    notFound();
  }

  const p = profile as Profile;

  // Fetch data in parallel
  const [
    { data: pinnedItems },
    { data: certificates },
    { data: pillarHours },
  ] = await Promise.all([
    supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', p.user_id)
      .eq('is_pinned', true)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('certificates')
      .select('*')
      .eq('user_id', p.user_id)
      .order('issued_at', { ascending: false }),
    supabase
      .from('pillar_hours')
      .select('*')
      .eq('user_id', p.user_id)
      .eq('status', 'approved'),
  ]);

  // Aggregate approved hours per pillar
  const pillarHoursMap = {} as Record<PillarName, number>;
  PILLARS.forEach((pillar) => {
    pillarHoursMap[pillar as PillarName] = 0;
  });
  (pillarHours || []).forEach((ph: PillarHour) => {
    pillarHoursMap[ph.pillar_name] = (pillarHoursMap[ph.pillar_name] || 0) + ph.hours;
  });

  return (
    <PublicProfile
      profile={p}
      pinnedItems={(pinnedItems || []) as PortfolioItem[]}
      certificates={(certificates || []) as Certificate[]}
      pillarHoursMap={pillarHoursMap}
    />
  );
}
