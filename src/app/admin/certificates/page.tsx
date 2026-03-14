export const dynamic = 'force-dynamic';

import { CertificatesManager } from '@/components/admin/CertificatesManager';

export default async function AdminCertificatesRoute() {
  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#071629', marginBottom: 4 }}>
        Certificates
      </h1>
      <p style={{ color: '#6e7591', marginBottom: 24, fontSize: 14 }}>Issue and manage pillar certificates</p>
      <CertificatesManager />
    </div>
  );
}
