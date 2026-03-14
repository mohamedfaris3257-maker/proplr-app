export const dynamic = 'force-dynamic';

import { AdminFaqPage } from '@/components/admin/AdminFaqPage';

export default async function AdminFaqRoute() {
  return (
    <div className="min-h-screen bg-background">
      <AdminFaqPage />
    </div>
  );
}
