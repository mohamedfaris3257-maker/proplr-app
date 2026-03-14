export const dynamic = 'force-dynamic';

import { CoursesManager } from '@/components/admin/CoursesManager';

export default async function AdminCoursesRoute() {
  return <CoursesManager />;
}
