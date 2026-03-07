'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { NotificationBell } from './NotificationBell';
import type { Notification } from '@/lib/types';

interface MobileNotificationBellProps {
  userId: string;
}

export function MobileNotificationBell({ userId }: MobileNotificationBellProps) {
  const [initialNotifications, setInitialNotifications] = useState<Notification[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }: { data: Notification[] | null }) => {
        setInitialNotifications(data || []);
        setLoaded(true);
      });
  }, [userId]);

  if (!loaded) {
    // Placeholder bell while loading — no badge yet
    return (
      <div className="flex flex-col items-center gap-1 px-3 py-2 text-text-muted">
        <Bell className="w-5 h-5" />
        <span className="text-[10px] font-medium">Alerts</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 px-1 py-2">
      <NotificationBell userId={userId} initialNotifications={initialNotifications} />
      <span className="text-[10px] font-medium text-text-muted">Alerts</span>
    </div>
  );
}
