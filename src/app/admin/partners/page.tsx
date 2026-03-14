export const dynamic = 'force-dynamic';

import { ExternalApplicationsManager } from '@/components/admin/ExternalApplicationsManager';

export default async function AdminPartnersRoute() {
  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#071629', marginBottom: 4 }}>
        Partner Applications
      </h1>
      <p style={{ color: '#6e7591', marginBottom: 24, fontSize: 14 }}>Industry and institution partnership requests</p>
      <ExternalApplicationsManager />
    </div>
  );
}
