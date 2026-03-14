export const dynamic = 'force-dynamic';

import { ShowcaseAdmin } from '@/components/admin/ShowcaseAdmin';

export default async function AdminShowcaseRoute() {
  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#071629', marginBottom: 4 }}>
        Showcase Registrations
      </h1>
      <p style={{ color: '#6e7591', marginBottom: 24, fontSize: 14 }}>Schools registered for the National Showcase</p>
      <ShowcaseAdmin />
    </div>
  );
}
