export const dynamic = 'force-dynamic';

import { ExternalApplicationsManager } from '@/components/admin/ExternalApplicationsManager';

export default async function AdminApplicationsRoute() {
  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#071629', marginBottom: 4 }}>
        External Applications
      </h1>
      <p style={{ color: '#6e7591', marginBottom: 24, fontSize: 14 }}>Partner, mentor, innovation, summer camp & job postings</p>
      <ExternalApplicationsManager />
    </div>
  );
}
