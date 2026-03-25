'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

interface DashboardSidebarProps {
  profile: Profile
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

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
    { icon: <CalIcon />, label: 'Events', href: '/dashboard/events', active: pathname.startsWith('/dashboard/events') },
    { icon: <ClockIcon />, label: 'Opportunities', href: '/dashboard/opportunities', active: pathname.startsWith('/dashboard/opportunities') },
    { icon: <ChartIcon />, label: 'Leaderboard', href: '/dashboard/leaderboard', active: pathname === '/dashboard/leaderboard' },
    { icon: <UserIcon />, label: 'Profile', href: '/dashboard/profile', active: pathname === '/dashboard/profile' },
    { icon: <SettingsIcon />, label: 'Settings', href: '/dashboard/settings', active: pathname === '/dashboard/settings' },
  ]

  return (
    <aside style={s.sidebar}>
      <Link href="/" style={{ ...s.logo, textDecoration: 'none', color: '#071629' }}>
        <div style={s.logoBox}>
          <PropellerIcon />
        </div>
        PROPLR
      </Link>

      <nav style={s.nav}>
        {navItems.map(item => (
          <Link key={item.label} href={item.href} style={{
            ...s.ni,
            ...(item.active ? s.niActive : {}),
          }}>
            {item.icon}
            {item.label}
          </Link>
        ))}
        <div style={s.sep} />
        <button onClick={handleSignOut} style={s.signOutBtn}>
          <LogOutIcon />
          Sign Out
        </button>
      </nav>

      <div style={s.helpCard}>
        <p style={s.helpTitle}>Need help?</p>
        <p style={s.helpSub}>Have a question? Send us a message.</p>
        <button style={s.helpBtn}>Contact us</button>
      </div>
    </aside>
  )
}

const s: Record<string, React.CSSProperties> = {
  sidebar: { width: 220, minWidth: 220, background: '#fff', borderRight: '0.5px solid rgba(7,22,41,.08)', display: 'flex', flexDirection: 'column', padding: '18px 10px', height: '100vh', position: 'sticky', top: 0, overflowY: 'auto' },
  logo: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 20px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 17, color: '#071629' },
  logoBox: { width: 30, height: 30, background: '#071629', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 },
  ni: { display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', borderRadius: 100, fontSize: 13, color: '#6e7591', textDecoration: 'none', transition: 'all .2s', whiteSpace: 'nowrap' },
  niActive: { background: '#3d9be9', color: '#fff', fontWeight: 500 },
  sep: { borderTop: '0.5px solid rgba(7,22,41,.08)', margin: '6px 0', paddingTop: 6 },
  signOutBtn: { display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', borderRadius: 100, fontSize: 13, color: '#6e7591', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left' as const },
  helpCard: { background: '#071629', borderRadius: 16, padding: 14, marginTop: 10, color: '#fff' },
  helpTitle: { fontSize: 12.5, fontWeight: 700, margin: 0 },
  helpSub: { fontSize: 11, opacity: .65, margin: '3px 0 10px' },
  helpBtn: { background: 'rgba(255,255,255,.15)', color: '#fff', border: 'none', borderRadius: 100, padding: '6px 12px', fontSize: 11.5, cursor: 'pointer', width: '100%', fontFamily: 'inherit' },
}

// Icons
function PropellerIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="#ffcb5d"/><line x1="12" y1="2" x2="12" y2="9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="2" y1="12" x2="9" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="15" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
}
function GridIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg> }
function LayersIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> }
function UsersIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function CalIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function ClockIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function ChartIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function UserIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function SettingsIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> }
function ShieldIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
function LogOutIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
