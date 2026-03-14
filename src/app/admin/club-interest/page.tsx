export const dynamic = 'force-dynamic';

import { ClubInterestAdmin } from '@/components/admin/ClubInterestAdmin';

export default async function AdminClubInterestRoute() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Club Interest Forms</h1>
          <p className="text-text-muted text-sm">Schools interested in launching a Proplr chapter</p>
        </div>
        <ClubInterestAdmin />
      </div>
    </div>
  );
}
