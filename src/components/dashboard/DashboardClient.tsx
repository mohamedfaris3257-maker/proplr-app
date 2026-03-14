'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Profile } from '@/lib/types'

interface DashboardClientProps {
  profile: Profile
  totalHours: number
  badgeCount: number
  completedPillars: number
  eventsAttended: number
  courses: any[]
  courseProgressMap: Record<string, number>
  moduleCounts: Record<string, number>
  studentCounts: Record<string, number>
  pendingTasks: any[]
  upcomingEvents: any[]
  notifications: any[]
}

const PILLAR_EMOJI: Record<string, string> = {
  Leadership: '🧭',
  Entrepreneurship: '💡',
  'Digital Literacy': '💻',
  'Personal Branding': '🎨',
  Communication: '💬',
  'Project Management': '📊',
}

const PILLAR_CARD_COLORS: Record<string, { barColor: string; bg: string }> = {
  Leadership: { barColor: '#3d9be9', bg: 'rgba(61,155,233,.08)' },
  Entrepreneurship: { barColor: '#ffcb5d', bg: 'rgba(255,203,93,.12)' },
  'Digital Literacy': { barColor: '#2ed573', bg: 'rgba(7,22,41,.04)' },
  'Personal Branding': { barColor: '#9b59b6', bg: 'rgba(155,89,182,.08)' },
  Communication: { barColor: '#27ae60', bg: 'rgba(39,174,96,.08)' },
  'Project Management': { barColor: '#e05c3a', bg: 'rgba(224,92,58,.08)' },
}

function getLevel(progress: number) {
  if (progress >= 100) return { label: 'Certified 🏅', color: 'rgba(255,203,93,.2)', text: '#7a5800' }
  if (progress >= 70) return { label: 'Advanced', color: 'rgba(61,155,233,.1)', text: '#1a5ea5' }
  if (progress >= 30) return { label: 'Intermediate', color: 'rgba(255,203,93,.15)', text: '#7a5800' }
  return { label: 'Beginner', color: 'rgba(46,213,115,.12)', text: '#1a7a42' }
}

const SCHEDULE_COLORS = ['#3d9be9', '#ffcb5d', '#2ed573', '#9b59b6', '#e05c3a']
const REMINDER_COLORS = ['#ff4757', '#3d9be9', '#ffcb5d', '#2ed573', '#9b59b6']

export function DashboardClient({
  profile,
  totalHours,
  badgeCount,
  completedPillars,
  eventsAttended,
  courses,
  courseProgressMap,
  moduleCounts,
  studentCounts,
  pendingTasks,
  upcomingEvents,
  notifications,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('all')

  const studentName = profile.name?.split(' ')[0] || 'Student'

  const stats = [
    { icon: '⏱', label: 'Total Hours Logged', value: String(totalHours), color: '#3d9be9', bg: 'rgba(61,155,233,.1)' },
    { icon: '⭐', label: 'Badges Earned', value: String(badgeCount), color: '#b87d00', bg: 'rgba(255,203,93,.18)' },
    { icon: '✅', label: 'Pillars Completed', value: `${completedPillars}/6`, color: '#1a9e4f', bg: 'rgba(46,213,115,.1)' },
    { icon: '📅', label: 'Events Attended', value: String(eventsAttended), color: '#071629', bg: 'rgba(7,22,41,.05)' },
  ]

  const pillars = courses.map((c: any) => {
    const pillarName = c.pillar_tag || c.title || 'General'
    const progress = courseProgressMap[c.id] || 0
    const level = getLevel(progress)
    const colors = PILLAR_CARD_COLORS[pillarName] || { barColor: '#3d9be9', bg: 'rgba(61,155,233,.08)' }
    return {
      id: c.id, emoji: PILLAR_EMOJI[pillarName] || '📘', title: pillarName,
      level: level.label, levelColor: level.color, levelText: level.text,
      sessions: moduleCounts[c.id] || 0, tasks: 0, students: studentCounts[c.id] || 0,
      progress, barColor: colors.barColor, bg: colors.bg,
    }
  })

  const filteredPillars =
    activeTab === 'completed' ? pillars.filter(p => p.progress >= 100)
    : activeTab === 'active' ? pillars.filter(p => p.progress > 0 && p.progress < 100)
    : pillars

  const taskItems = pendingTasks.slice(0, 4).map((t: any, i: number) => ({
    title: t.title || 'Untitled Task', desc: t.description || '',
    due: t.due_date ? new Date(t.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
    priority: t.priority === 'high' ? 'High' : 'Low', yellow: i % 3 === 0,
  }))

  const scheduleItems = upcomingEvents.slice(0, 3).map((e: any, i: number) => ({
    date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    name: e.title,
    time: `${e.time || ''}${e.location ? ' · ' + e.location : e.online_link ? ' · Online' : ''}`,
    color: SCHEDULE_COLORS[i % SCHEDULE_COLORS.length],
  }))

  const reminderItems = notifications.slice(0, 3).map((n: any, i: number) => ({
    name: n.title, sub: n.message, color: REMINDER_COLORS[i % REMINDER_COLORS.length],
  }))

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate().toString()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const calDays: string[] = []
  for (let i = 0; i < firstDay; i++) calDays.push('')
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d.toString())
  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const eventDays = upcomingEvents
    .filter((e: any) => { const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year })
    .map((e: any) => new Date(e.date).getDate().toString())

  return (
    <>
      {/* MAIN CONTENT */}
      <main style={s.main}>
        <div style={s.topbar}>
          <div>
            <h1 style={s.greetH}>Hello, {studentName} 👋</h1>
            <p style={s.greetSub}>Let&apos;s see what&apos;s happening today.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={s.search}><SearchIcon /><span>Search courses, tasks...</span></div>
            <div style={s.bell}><BellIcon />{notifications.length > 0 && <div style={s.bellDot} />}</div>
          </div>
        </div>

        <div style={s.statsGrid}>
          {stats.map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={{ ...s.statIcon, background: stat.bg }}><span style={{ fontSize: 15 }}>{stat.icon}</span></div>
              <div style={s.statNum}>{stat.value}</div>
              <div style={s.statLbl}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={s.sectionHead}>
            <span style={s.sectionTitle}>My Pillars</span>
            <a href="/dashboard/courses" style={s.seeAll}>See all</a>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {['all', 'active', 'completed'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div style={s.pillarsGrid}>
            {filteredPillars.map(p => (
              <div key={p.id} style={s.pillarCard}>
                <div style={{ ...s.pillarCover, background: p.bg }}>{p.emoji}</div>
                <div><div style={s.pillarTitle}>{p.title}</div><div style={s.pillarMeta}>Facilitated by Proplr Team</div></div>
                <div><span style={{ ...s.levelBadge, background: p.levelColor, color: p.levelText }}>{p.level}</span></div>
                <div style={s.pillarStats}><span>📋 {p.sessions} sessions</span><span>✅ {p.tasks} tasks</span><span>👥 {p.students}</span></div>
                <div style={s.progressWrap}>
                  <div style={s.progressRow}><span style={{ fontSize: 10.5, color: '#6e7591' }}>Completed</span><span style={{ fontSize: 10.5, fontWeight: 600, color: '#071629' }}>{p.progress}%</span></div>
                  <div style={s.progressBg}><div style={{ ...s.progressFill, width: `${p.progress}%`, background: p.barColor }} /></div>
                </div>
              </div>
            ))}
            {filteredPillars.length === 0 && <p style={{ fontSize: 13, color: '#6e7591', gridColumn: '1/-1', textAlign: 'center', padding: 20 }}>No pillars found for this filter.</p>}
          </div>
        </div>

        <div>
          <div style={s.sectionHead}>
            <span style={s.sectionTitle}>My Tasks</span>
            <a href="/dashboard/tasks" style={s.seeAll}>+ Add new</a>
          </div>
          <div style={s.tasksGrid}>
            {taskItems.map(task => (
              <div key={task.title} style={{ ...s.taskCard, background: task.yellow ? '#ffcb5d' : '#fff', border: task.yellow ? 'none' : '0.5px solid rgba(7,22,41,.08)' }}>
                <div style={s.taskTop}>
                  <span style={s.taskName}>{task.title}</span>
                  <span style={{ ...s.priorityBadge, background: task.priority === 'High' ? 'rgba(255,71,87,.12)' : 'rgba(46,213,115,.12)', color: task.priority === 'High' ? '#c0392b' : '#1a7a42' }}>{task.priority}</span>
                </div>
                <p style={s.taskDesc}>{task.desc}</p>
                {task.due && <p style={s.taskDue}>📅 Due: {task.due}</p>}
              </div>
            ))}
            {taskItems.length === 0 && <p style={{ fontSize: 13, color: '#6e7591', gridColumn: '1/-1', textAlign: 'center', padding: 20 }}>No pending tasks. You&apos;re all caught up!</p>}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside style={s.right}>
        <div style={s.profileCard}>
          <Link href="/dashboard/profile" style={s.editIcon}><EditIcon /></Link>
          <div style={s.avatar}>
            {profile.photo_url
              ? <img src={profile.photo_url} alt={profile.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : (profile.name?.charAt(0)?.toUpperCase() || 'S')}
          </div>
          <div style={s.profileName}>{profile.name}</div>
          <div style={s.profileEmail}>{profile.email}</div>
        </div>

        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <button style={s.calNav}>‹</button><span style={s.calMonth}>{monthName}</span><button style={s.calNav}>›</button>
          </div>
          <div style={s.calGrid}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} style={s.calDayName}>{d}</div>)}
            {calDays.map((d, i) => (
              <div key={i} style={{ ...s.calDay, ...(d === today ? s.calToday : {}), ...(eventDays.includes(d) && d !== today ? s.calEvent : {}), ...(d === '' ? { visibility: 'hidden' as const } : {}) }}>{d}</div>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardHead}>Upcoming <a href="/dashboard/events" style={s.seeAll}>See all</a></div>
          {scheduleItems.map(item => (
            <div key={item.name} style={s.scheduleItem}>
              <span style={s.scheduleDate}>{item.date}</span>
              <div style={{ ...s.dot, background: item.color }} />
              <div><div style={s.scheduleName}>{item.name}</div><div style={s.scheduleTime}>{item.time}</div></div>
            </div>
          ))}
          {scheduleItems.length === 0 && <p style={{ fontSize: 11.5, color: '#6e7591', textAlign: 'center', padding: '8px 0' }}>No upcoming events.</p>}
        </div>

        <div style={s.card}>
          <div style={s.cardHead}>Reminders</div>
          {reminderItems.map(item => (
            <div key={item.name} style={s.scheduleItem}>
              <div style={{ ...s.dot, background: item.color, marginTop: 4 }} />
              <div><div style={s.scheduleName}>{item.name}</div><div style={s.scheduleTime}>{item.sub}</div></div>
            </div>
          ))}
          {reminderItems.length === 0 && <p style={{ fontSize: 11.5, color: '#6e7591', textAlign: 'center', padding: '8px 0' }}>No new reminders.</p>}
        </div>
      </aside>
    </>
  )
}

const s: Record<string, React.CSSProperties> = {
  main: { flex: 1, overflowY: 'auto', padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 18 },
  topbar: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  greetH: { fontFamily: "'Montserrat', sans-serif", fontSize: 21, fontWeight: 700, color: '#071629', margin: 0 },
  greetSub: { fontSize: 13, color: '#6e7591', margin: '2px 0 0' },
  search: { display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '0.5px solid rgba(7,22,41,.08)', borderRadius: 100, padding: '7px 13px', fontSize: 12.5, color: '#6e7591', width: 190 },
  bell: { width: 34, height: 34, background: '#fff', border: '0.5px solid rgba(7,22,41,.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' },
  bellDot: { position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: '#ff4757', borderRadius: '50%', border: '1.5px solid #f0f2f8' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 },
  statCard: { background: '#fff', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 5 },
  statIcon: { width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  statNum: { fontFamily: "'Montserrat', sans-serif", fontSize: 21, fontWeight: 700, color: '#071629' },
  statLbl: { fontSize: 11, color: '#6e7591' },
  sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontFamily: "'Montserrat', sans-serif", fontSize: 14.5, fontWeight: 700, color: '#071629' },
  seeAll: { fontSize: 12, color: '#3d9be9', cursor: 'pointer', textDecoration: 'none' },
  tab: { padding: '5px 13px', borderRadius: 100, fontSize: 12, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: 'transparent', color: '#6e7591' },
  tabActive: { background: '#071629', color: '#fff' },
  pillarsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 },
  pillarCard: { background: '#fff', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 9 },
  pillarCover: { height: 72, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 },
  pillarTitle: { fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#071629', lineHeight: 1.3 },
  pillarMeta: { fontSize: 11, color: '#6e7591' },
  levelBadge: { display: 'inline-flex', padding: '3px 8px', borderRadius: 100, fontSize: 10.5, fontWeight: 600 },
  pillarStats: { display: 'flex', gap: 8, fontSize: 10.5, color: '#6e7591' },
  progressWrap: { display: 'flex', flexDirection: 'column', gap: 4 },
  progressRow: { display: 'flex', justifyContent: 'space-between' },
  progressBg: { height: 4, background: '#eef0f8', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 10 },
  tasksGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 9 },
  taskCard: { borderRadius: 16, padding: 13 },
  taskTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  taskName: { fontSize: 12.5, fontWeight: 600, color: '#071629', lineHeight: 1.3, flex: 1, paddingRight: 6 },
  priorityBadge: { fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 100, whiteSpace: 'nowrap' },
  taskDesc: { fontSize: 11.5, color: '#4a4a5a', marginBottom: 5 },
  taskDue: { fontSize: 11, color: '#6e7591' },
  right: { width: 248, minWidth: 248, padding: '22px 14px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', background: '#f0f2f8' },
  profileCard: { background: '#fff', borderRadius: 16, padding: 14, textAlign: 'center', position: 'relative' },
  editIcon: { position: 'absolute', top: 11, right: 11, color: '#6e7591', cursor: 'pointer' },
  avatar: { width: 52, height: 52, borderRadius: '50%', background: '#3d9be9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat', sans-serif", fontSize: 17, fontWeight: 700, margin: '0 auto 8px', overflow: 'hidden' },
  profileName: { fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13.5, color: '#071629' },
  profileEmail: { fontSize: 11, color: '#6e7591', marginTop: 2 },
  card: { background: '#fff', borderRadius: 16, padding: 13 },
  cardHead: { fontFamily: "'Montserrat', sans-serif", fontSize: 12.5, fontWeight: 700, color: '#071629', marginBottom: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  calMonth: { fontFamily: "'Montserrat', sans-serif", fontSize: 12.5, fontWeight: 700, color: '#071629' },
  calNav: { background: 'none', border: 'none', cursor: 'pointer', color: '#6e7591', padding: '0 4px', fontSize: 13, fontFamily: 'inherit' },
  calGrid: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', gap: 1 },
  calDayName: { fontSize: 9.5, color: '#6e7591', padding: '2px 0', fontWeight: 600 },
  calDay: { fontSize: 11, padding: '4px 2px', borderRadius: '50%', cursor: 'pointer', color: '#071629', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  calToday: { background: '#3d9be9', color: '#fff', fontWeight: 700 },
  calEvent: { fontWeight: 600, color: '#3d9be9' },
  scheduleItem: { display: 'flex', gap: 9, padding: '7px 0', borderBottom: '0.5px solid rgba(7,22,41,.06)' },
  scheduleDate: { fontSize: 10.5, color: '#6e7591', minWidth: 36 },
  dot: { width: 7, height: 7, borderRadius: '50%', marginTop: 4, flexShrink: 0 },
  scheduleName: { fontSize: 12, fontWeight: 500, color: '#071629' },
  scheduleTime: { fontSize: 10.5, color: '#6e7591' },
}

function SearchIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function BellIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6e7591" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function EditIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
