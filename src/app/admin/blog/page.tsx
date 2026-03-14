export const dynamic = 'force-dynamic';

import { AdminBlogPage } from '@/components/admin/AdminBlogPage';

export default async function AdminBlogRoute() {
  return (
    <div className="min-h-screen bg-background">
      <AdminBlogPage />
    </div>
  );
}
