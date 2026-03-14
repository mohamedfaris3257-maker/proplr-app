'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CalendarDays,
  Briefcase,
  Bookmark,
  User,
  Users2,
  CheckSquare,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/community', label: 'Community', icon: Users2 },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/events', label: 'Events', icon: CalendarDays },
  { href: '/dashboard/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/dashboard/saved', label: 'Saved', icon: Bookmark },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border px-2 pb-safe">
      <div className="flex items-center justify-around h-16 overflow-x-auto gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 flex-shrink-0',
                active ? 'text-gold' : 'text-text-muted'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
