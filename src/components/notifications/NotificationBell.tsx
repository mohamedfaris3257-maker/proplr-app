'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, GraduationCap, Trophy, CheckCircle2, Calendar, ClipboardList, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { timeAgo } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Notification, NotificationType } from '@/lib/types';

interface NotificationBellProps {
  userId: string;
  initialNotifications: Notification[];
}

function getNotificationIcon(type: NotificationType): React.ReactNode {
  const cls = 'w-4 h-4';
  switch (type) {
    case 'certificate':  return <GraduationCap className={cls} />;
    case 'badge':        return <Trophy className={cls} />;
    case 'hours':        return <CheckCircle2 className={cls} />;
    case 'event':
    case 'rsvp':         return <Calendar className={cls} />;
    case 'waitlist':
    case 'application':  return <ClipboardList className={cls} />;
    case 'comment':      return <MessageCircle className={cls} />;
    case 'general':
    default:             return <Bell className={cls} />;
  }
}

export function NotificationBell({ userId, initialNotifications }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();

    supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload: { new: Notification }) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeAllChannels();
    };
  }, [userId]);

  // Click-outside to close
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleMouseDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isOpen]);

  const handleMarkAllRead = useCallback(async () => {
    const supabase = createClient();

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, [userId]);

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      if (!notification.is_read) {
        const supabase = createClient();

        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notification.id);

        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
        );
      }

      if (notification.link) {
        setIsOpen(false);
        router.push(notification.link);
      }
    },
    [router]
  );

  const visibleNotifications = notifications.slice(0, 20);

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'relative p-2 rounded-lg transition-all duration-200',
          isOpen
            ? 'bg-surface-2 text-text-primary'
            : 'text-text-muted hover:bg-surface-2 hover:text-text-primary'
        )}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50 card bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue hover:text-blue/80 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-96 overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Bell className="w-8 h-8 text-text-muted opacity-40" />
                <p className="text-sm text-text-muted">No notifications yet</p>
              </div>
            ) : (
              <ul>
                {visibleNotifications.map((notification) => (
                  <li key={notification.id}>
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        'w-full text-left flex items-start gap-3 px-4 py-3 transition-all duration-150',
                        'border-l-2 hover:bg-surface-2',
                        notification.is_read
                          ? 'border-transparent'
                          : 'border-blue bg-blue/5 hover:bg-blue/10'
                      )}
                    >
                      <span className="mt-0.5 flex-shrink-0 text-[#4A90D9]">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'text-sm font-medium leading-snug',
                            notification.is_read ? 'text-text-secondary' : 'text-text-primary'
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-text-muted line-clamp-2 mt-0.5 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          {timeAgo(notification.created_at)}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue flex-shrink-0 mt-1.5" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
