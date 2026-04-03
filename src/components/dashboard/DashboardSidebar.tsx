'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProplrIcon } from '@/components/ProplrLogo'
import type { Profile } from '@/lib/types'

interface DashboardSidebarProps {
  profile: Profile
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches)
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Close sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navItems = [
    { icon: <GridIcon />, label: 'Dashboard', href: '/dashboard', active: pathname === '/dashboard' },
    { icon: <LayersIcon />, label: 'My Program', href: '/dashboard/courses', active: pathname.startsWith('/dashboard/courses') },
    { icon: <UsersIcon />, label: 'Community', href: '/dashboard/community', active: pathname.startsWith('/dashboard/community') },
    { icon: <MessageIcon />, label: 'Messages', href: '/dashboard/messages', active: pathname.startsWith('/dashboard/messages') },
    { icon: <CalIcon />, label: 'Events', href: '/dashboard/events', active: pathname.startsWith('/dashboard/events') },
    { icon: <ClockIcon />, label: 'Opportunities', href: '/dashboard/opportunities', active: pathname.startsWith('/dashboard/opportunities') },
    { icon: <ChartIcon />, label: 'Leaderboard', href: '/dashboard/leaderboard', active: pathname === '/dashboard/leaderboard' },
    { icon: <UserIcon />, label: 'Profile', href: '/dashboard/profile', active: pathname === '/dashboard/profile' },
    { icon: <SettingsIcon />, label: 'Settings', href: '/dashboard/settings', active: pathname === '/dashboard/settings' },
  ]

  const sidebarContent = (
    <>
      {/* Logo */}
      <Link href="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 10px 24px',
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 800,
        fontSize: 18,
        color: '#071629',
        textDecoration: 'none',
        letterSpacing: -0.5,
      }}>
        <ProplrIcon size={32} variant="dark" />
        PROPLR
      </Link>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: item.active ? 600 : 400,
            color: item.active ? '#0ea5e9' : '#64748b',
            textDecoration: 'none',
            transition: 'all .2s',
            background: item.active
              ? 'rgba(14,165,233,0.08)'
              : 'transparent',
            borderLeft: item.active ? '3px solid #0ea5e9' : '3px solid transparent',
            position: 'relative',
          }}>
            {item.icon}
            {item.label}
            {item.active && (
              <div style={{
                position: 'absolute',
                right: 12,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#0ea5e9',
                boxShadow: '0 0 8px #0ea5e9',
              }} />
            )}
          </Link>
        ))}

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', margin: '8px 0', paddingTop: 8 }} />

        <button onClick={handleSignOut} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          borderRadius: 12,
          fontSize: 13,
          color: '#94a3b8',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          width: '100%',
          textAlign: 'left' as const,
          transition: 'all .2s',
          borderLeft: '3px solid transparent',
        }}>
          <LogOutIcon />
          Sign Out
        </button>
      </nav>

      {/* Help card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.06), rgba(168,85,247,0.04))',
        border: '1px solid rgba(14,165,233,0.1)',
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: 'rgba(14,165,233,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
          fontSize: 14,
          color: '#0ea5e9',
        }}>
          ?
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#071629' }}>Need help?</p>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 12px', lineHeight: 1.4 }}>
          Have a question? Send us a message.
        </p>
        <button style={{
          background: 'rgba(14,165,233,0.08)',
          color: '#0ea5e9',
          border: '1px solid rgba(14,165,233,0.12)',
          borderRadius: 100,
          padding: '7px 14px',
          fontSize: 11.5,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
          fontFamily: 'inherit',
          transition: 'all 0.2s',
        }}>
          Contact us
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 1000,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#071629" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: 16,
            color: '#071629',
            textDecoration: 'none',
            letterSpacing: -0.5,
          }}>
            <ProplrIcon size={28} variant="dark" />
            PROPLR
          </Link>
          <div style={{ width: 38 }} />
        </div>
      )}

      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1001,
            transition: 'opacity 0.2s',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 230,
        minWidth: 230,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        overflowY: 'auto',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.06)',
        ...(isMobile ? {
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1002,
          borderRadius: 0,
          margin: 0,
          height: '100vh',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        } : {
          height: 'calc(100vh - 24px)',
          position: 'sticky',
          top: 12,
          borderRadius: 20,
          margin: '12px 0 12px 12px',
        }),
      }}>
        {sidebarContent}
      </aside>
    </>
  )
}

// Icons
// PropellerIcon removed — now using ProplrIcon from @/components/ProplrLogo
function GridIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg> }
function LayersIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> }
function UsersIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function CalIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function ClockIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function ChartIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function UserIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function SettingsIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> }
function MessageIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function LogOutIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
