export const dynamic = 'force-dynamic';

import { ShowcaseAdmin } from '@/components/admin/ShowcaseAdmin';

export default async function AdminShowcaseRoute() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Showcase Registrations</h1>
          <p className="text-text-muted text-sm">Schools registered for the National Showcase</p>
        </div>
        <ShowcaseAdmin />
      </div>
    </div>
  );
}
