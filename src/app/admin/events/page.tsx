export const dynamic = 'force-dynamic';

import { EventsManager } from '@/components/admin/EventsManager';

export default async function AdminEventsRoute() {
  return <EventsManager />;
}
