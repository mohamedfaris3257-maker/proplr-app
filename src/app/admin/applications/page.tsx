export const dynamic = 'force-dynamic';

import { ExternalApplicationsManager } from '@/components/admin/ExternalApplicationsManager';

export default async function AdminApplicationsRoute() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">External Applications</h1>
          <p className="text-text-muted text-sm">Partner, mentor, innovation, summer camp & job postings</p>
        </div>
        <ExternalApplicationsManager />
      </div>
    </div>
  );
}
