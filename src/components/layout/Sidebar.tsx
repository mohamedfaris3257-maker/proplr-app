'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CalendarDays,
  Briefcase,
  User,
  Shield,
  LogOut,
  ChevronRight,
  Bookmark,
  Users2,
  CheckSquare,
  BookOpen,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import type { Profile, Notification } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface SidebarProps {
  profile: Profile;
}

const navItems = [
  { href: '/feed', label: 'Feed', icon: LayoutDashboard },
  { href: '/dashboard/courses', label: 'Courses', icon: BookOpen },
  { href: '/dashboard/community', label: 'Community', icon: Users2 },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/events', label: 'Events', icon: CalendarDays },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/saved', label: 'Saved', icon: Bookmark },
  { href: '/profile', label: 'My Profile', icon: User },
];

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [initialNotifications, setInitialNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', profile.user_id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setInitialNotifications((data as Notification[]) || []);
      });
  }, [profile.user_id]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const isAdmin = profile.type === 'admin';
  const trackLabel =
    profile.type === 'school_student'
      ? 'Foundation Track'
      : profile.type === 'uni_student'
      ? 'Impact Track'
      : 'Admin';

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-surface border-r border-border p-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center">
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="#0d1624" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5L10 0Z" />
          </svg>
        </div>
        <span className="text-lg font-bold text-text-primary tracking-tight">proplr</span>
      </div>

      {/* User card with notification bell */}
      <div className="card card-gradient-gold p-3 flex items-center gap-3">
        <Avatar name={profile.name} photoUrl={profile.photo_url} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary truncate">{profile.name}</p>
          <p className="text-xs text-text-muted truncate">{trackLabel}</p>
        </div>
        {profile.subscription_status === 'premium' && (
          <span className="text-[10px] font-bold bg-gold/10 text-gold px-1.5 py-0.5 rounded-sm flex-shrink-0">
            PRO
          </span>
        )}
        <NotificationBell
          userId={profile.user_id}
          initialNotifications={initialNotifications}
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group hover:translate-x-0.5',
                active
                  ? 'bg-gold/10 text-gold shadow-[inset_3px_0_0_#E8A838]'
                  : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4',
                  active ? 'text-gold' : 'text-text-muted group-hover:text-text-secondary'
                )}
              />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-gold" />}
            </Link>
          );
        })}

        <Link
          href="/admin"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group hover:translate-x-0.5',
            pathname.startsWith('/admin')
              ? 'bg-purple/10 text-purple shadow-[inset_3px_0_0_#9B59B6]'
              : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
          )}
        >
          <Shield className="w-4 h-4" />
          Admin Panel
        </Link>
      </nav>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-red/10 hover:text-red transition-all duration-200 w-full"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </aside>
  );
}
