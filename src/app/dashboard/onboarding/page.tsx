import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, user_id, name, school_name, grade, career_interests, type')
    .eq('user_id', user.id)
    .single();

  // If profile is complete, redirect to dashboard
  if (profile?.name && profile?.school_name) {
    redirect('/dashboard');
  }

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f2ef', minHeight: '100vh' }}>
      <OnboardingWizard
        userId={user.id}
        existingName={profile?.name || ''}
        existingSchool={profile?.school_name || ''}
        existingGrade={profile?.grade || ''}
        existingInterests={profile?.career_interests || []}
      />
    </div>
  );
}
