export const dynamic = 'force-dynamic';

import { ClubInterestAdmin } from '@/components/admin/ClubInterestAdmin';

export default async function AdminClubInterestRoute() {
  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#071629', marginBottom: 4 }}>
        Club Interest Forms
      </h1>
      <p style={{ color: '#6e7591', marginBottom: 24, fontSize: 14 }}>Schools interested in launching a Proplr chapter</p>
      <ClubInterestAdmin />
    </div>
  );
}
