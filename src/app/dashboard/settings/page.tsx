import { createClient } from '@/lib/supabase/server';
import { SettingsClient } from '@/components/dashboard/SettingsClient';
import type { Profile } from '@/lib/types';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px' }}>
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-xl font-bold mb-4"
          style={{ color: '#071629', fontFamily: "'Montserrat', sans-serif" }}
        >
          Settings
        </h1>
        <SettingsClient profile={profile as Profile} />
      </div>
    </div>
  );
}
