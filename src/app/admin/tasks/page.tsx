export const dynamic = 'force-dynamic';

import { TasksManager } from '@/components/admin/TasksManager';

export default async function AdminTasksRoute() {
  return <TasksManager />;
}
