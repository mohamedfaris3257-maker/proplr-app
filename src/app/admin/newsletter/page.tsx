export const dynamic = 'force-dynamic';

import { NewsletterManager } from '@/components/admin/NewsletterManager';

export default async function AdminNewsletterRoute() {
  return <NewsletterManager />;
}
