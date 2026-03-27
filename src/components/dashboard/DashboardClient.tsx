'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Profile } from '@/lib/types'
import { WelcomeModal } from './WelcomeModal'

/* ─── types ─────────────────────────────────────────────────────────── */

interface LeaderboardEntry {
  user_id: string
  name: string
  photo_url: string | null
  total_hours: number
}

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
  topStudents: LeaderboardEntry[]
  currentUserRank: number
  currentUserEntry: LeaderboardEntry | null
  currentStreak: number
}

/* ─── constants ─────────────────────────────────────────────────────── */

const PILLAR_EMOJI: Record<string, string> = {
  Leadership: '◎',
  Entrepreneurship: '◆',
  'Digital Literacy': '▣',
  'Personal Branding': '●',
  Communication: '◈',
  'Project Management': '▦',
}

const PILLAR_COLORS: Record<string, string> = {
  Leadership: '#3d9be9',
  Entrepreneurship: '#f59e0b',
  'Digital Literacy': '#10b981',
  'Personal Branding': '#ec4899',
  Communication: '#f97316',
  'Project Management': '#8b5cf6',
}

/* ─── helpers ───────────────────────────────────────────────────────── */

function getLevel(progress: number) {
  if (progress >= 100) return { label: 'Certified ★', color: 'rgba(255,203,93,.2)', text: '#7a5800' }
  if (progress >= 70) return { label: 'Advanced', color: 'rgba(61,155,233,.12)', text: '#1a5ea5' }
  if (progress >= 30) return { label: 'Intermediate', color: 'rgba(255,203,93,.15)', text: '#7a5800' }
  return { label: 'Beginner', color: 'rgba(46,213,115,.12)', text: '#1a7a42' }
}

/* ─── component ─────────────────────────────────────────────────────── */

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
  topStudents,
  currentUserRank,
  currentUserEntry,
  currentStreak,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('All')

  const firstName = profile.name?.split(' ')[0] || 'Student'
  const fullName = profile.name || 'Student'

  /* ── overall progress ── */
  const progressValues = courses.map((c: any) => courseProgressMap[c.id] || 0)
  const overallProgress = progressValues.length > 0
    ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
    : 0

  /* ── pillar data ── */
  const pillars = courses.map((c: any) => {
    const pillarName = c.pillar_tag || c.title || 'General'
    const progress = courseProgressMap[c.id] || 0
    const level = getLevel(progress)
    return {
      id: c.id,
      emoji: PILLAR_EMOJI[pillarName] || '▤',
      title: pillarName,
      level: level.label,
      levelColor: level.color,
      levelText: level.text,
      progress,
      color: PILLAR_COLORS[pillarName] || '#3d9be9',
    }
  })

  const filteredPillars =
    activeTab === 'Completed' ? pillars.filter(p => p.progress >= 100)
    : activeTab === 'Active' ? pillars.filter(p => p.progress > 0 && p.progress < 100)
    : pillars

  /* ── tasks ── */
  const taskItems = pendingTasks.slice(0, 4).map((t: any) => ({
    id: t.id,
    title: t.title || 'Untitled Task',
    due: t.due_date ? new Date(t.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '',
    priority: t.priority === 'high' ? 'high' : 'low',
  }))

  /* ── next event ── */
  const nextEvent = upcomingEvents[0] || null

  /* ── calendar ── */
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

  /* ── leaderboard ── */
  const currentUserInTop5 = topStudents.some(s => s.user_id === profile.user_id)
  const currentHours = currentUserEntry?.total_hours || 0

  return (
    <>
      <WelcomeModal name={profile.name || ''} />
      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px' }}>

        {/* ── TOP BAR ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 24, fontWeight: 700, color: '#071629', margin: 0 }}>
              Hello, {firstName}
            </h1>
            <p style={{ fontSize: 13, color: '#6e7591', margin: '4px 0 0' }}>
              Let&apos;s see what&apos;s happening today.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '0.5px solid rgba(7,22,41,0.08)', borderRadius: 100, padding: '8px 16px', fontSize: 13, color: '#6e7591', width: 220 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search courses, tasks...
            </div>
            <div style={{ width: 38, height: 38, background: '#fff', border: '0.5px solid rgba(7,22,41,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', fontSize: 16 }}>
              ●
              {notifications.length > 0 && (
                <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ff4757', borderRadius: '50%', border: '1.5px solid #f0f2f8' }} />
              )}
            </div>
          </div>
        </div>

        {/* ── HERO BANNER — navy ── */}
        <div style={{
          background: '#071629',
          borderRadius: 20,
          padding: '28px 32px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, background: 'rgba(61,155,233,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', right: 60, bottom: -60, width: 160, height: 160, background: 'rgba(255,203,93,0.06)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 11, color: '#ffcb5d', fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>PROPLR FOUNDATION TRACK</div>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>
              Build your career before you graduate.
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '0 0 20px' }}>
              Complete your 6 pillars · Earn KHDA certificates · Get industry-ready
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/dashboard/courses" style={{ background: '#3d9be9', color: '#fff', borderRadius: 100, padding: '9px 20px', fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: 'inherit' }}>
                Continue Learning →
              </Link>
              <Link href="/dashboard/events" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 100, padding: '9px 20px', fontSize: 13, textDecoration: 'none', fontFamily: 'inherit' }}>
                View Schedule
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#ffcb5d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff' }}>{overallProgress}%</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Overall Progress</div>
          </div>
        </div>

        {/* ── STAT CARDS — white, clean ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Hours Logged', value: String(totalHours), icon: '◷', accent: '#3d9be9', lightBg: 'rgba(61,155,233,0.08)' },
            { label: 'Badges Earned', value: String(badgeCount), icon: '★', accent: '#f59e0b', lightBg: 'rgba(245,158,11,0.08)' },
            { label: 'Pillars Done', value: `${completedPillars}/6`, icon: '▤', accent: '#10b981', lightBg: 'rgba(16,185,129,0.08)' },
            { label: 'Day Streak', value: `${currentStreak}`, icon: '↯', accent: '#ef4444', lightBg: 'rgba(239,68,68,0.08)' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', boxShadow: '0 1px 8px rgba(7,22,41,0.06)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: stat.lightBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 12 }}>
                {stat.icon}
              </div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 24, fontWeight: 700, color: '#071629', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: '#6e7591', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── MY PILLARS — vertical list in white card ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', marginBottom: 16, boxShadow: '0 1px 8px rgba(7,22,41,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: '#071629', margin: 0 }}>My Pillars</h3>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {['All', 'Active', 'Completed'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  padding: '4px 14px', borderRadius: 100, fontSize: 12, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', background: activeTab === t ? '#071629' : 'transparent',
                  color: activeTab === t ? '#fff' : '#6e7591',
                }}>
                  {t}
                </button>
              ))}
              <Link href="/dashboard/courses" style={{ fontSize: 12, color: '#3d9be9', textDecoration: 'none', marginLeft: 8 }}>See all →</Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredPillars.length === 0 && (
              <p style={{ fontSize: 13, color: '#6e7591', textAlign: 'center', padding: '16px 0' }}>
                No pillars found for this filter.
              </p>
            )}
            {filteredPillars.map(p => (
              <Link
                key={p.id}
                href={`/dashboard/courses/${p.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                  background: '#f8f9fc', borderRadius: 12, borderLeft: `4px solid ${p.color}`,
                  textDecoration: 'none', color: 'inherit', transition: 'background .15s',
                }}
              >
                <div style={{ fontSize: 22 }}>{p.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#071629' }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: '#6e7591', marginTop: 2 }}>Facilitated by Proplr Team</div>
                </div>
                <div style={{ width: 120 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#6e7591', marginBottom: 4 }}>
                    <span>Progress</span>
                    <span style={{ fontWeight: 600, color: '#071629' }}>{p.progress}%</span>
                  </div>
                  <div style={{ height: 5, background: '#e8eaf0', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.progress}%`, background: p.color, borderRadius: 10, transition: 'width .4s ease' }} />
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: `${p.color}18`, color: p.color }}>{p.level}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── MY TASKS — 2-col grid in white card ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 1px 8px rgba(7,22,41,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: '#071629', margin: 0 }}>My Tasks</h3>
            <Link href="/dashboard/tasks" style={{ fontSize: 12, color: '#3d9be9', textDecoration: 'none' }}>+ Add new</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {taskItems.length === 0 ? (
              <div style={{
                gridColumn: '1/-1', background: 'rgba(255,203,93,0.08)', border: '1.5px dashed rgba(255,203,93,0.4)',
                borderRadius: 12, padding: 24, textAlign: 'center', color: '#b87d00', fontSize: 13,
              }}>
                All caught up! No pending tasks.
              </div>
            ) : (
              taskItems.map(task => (
                <div key={task.id} style={{
                  background: task.priority === 'high' ? 'rgba(255,203,93,0.12)' : '#f8f9fc',
                  borderRadius: 12, padding: '14px 16px',
                  borderLeft: `3px solid ${task.priority === 'high' ? '#ffcb5d' : '#e8eaf0'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#071629', flex: 1, paddingRight: 8, lineHeight: 1.3 }}>
                      {task.title}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap',
                      background: task.priority === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                      color: task.priority === 'high' ? '#dc2626' : '#059669',
                    }}>
                      {task.priority === 'high' ? 'High' : 'Low'}
                    </span>
                  </div>
                  {task.due && (
                    <div style={{ fontSize: 11, color: '#6e7591' }}>Due: {task.due}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════ RIGHT PANEL (300px) ═══════════════════ */}
      <div style={{ width: 300, minWidth: 300, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── PROFILE CARD ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, textAlign: 'center', boxShadow: '0 1px 8px rgba(7,22,41,0.06)', position: 'relative' }}>
          <Link href="/dashboard/profile" style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: '#6e7591', fontSize: 13, textDecoration: 'none' }}>
            ✎
          </Link>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: '#3d9be9', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 700,
            margin: '0 auto 10px', overflow: 'hidden',
          }}>
            {profile.photo_url
              ? <img src={profile.photo_url} alt={fullName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : firstName?.[0]?.toUpperCase()}
          </div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 14, color: '#071629' }}>{fullName}</div>
          <div style={{ fontSize: 12, color: '#6e7591', marginTop: 3 }}>{profile.email}</div>
          <div style={{ marginTop: 10, display: 'inline-flex', padding: '3px 12px', background: 'rgba(61,155,233,0.1)', borderRadius: 100, fontSize: 11, fontWeight: 600, color: '#3d9be9' }}>
            Foundation Track
          </div>
        </div>

        {/* ── CALENDAR ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px 18px', boxShadow: '0 1px 8px rgba(7,22,41,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6e7591', padding: '0 4px', fontSize: 13, fontFamily: 'inherit' }}>‹</button>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12.5, fontWeight: 700, color: '#071629' }}>{monthName}</span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6e7591', padding: '0 4px', fontSize: 13, fontFamily: 'inherit' }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: 1 }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} style={{ fontSize: 9.5, color: '#6e7591', padding: '2px 0', fontWeight: 600 }}>{d}</div>
            ))}
            {calDays.map((d, i) => (
              <div key={i} style={{
                fontSize: 11, padding: '4px 2px', borderRadius: '50%', cursor: d ? 'pointer' : 'default',
                color: d === today ? '#fff' : eventDays.includes(d) ? '#3d9be9' : '#071629',
                background: d === today ? '#3d9be9' : 'transparent',
                fontWeight: d === today || eventDays.includes(d) ? 700 : 400,
                aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                visibility: d === '' ? 'hidden' : 'visible',
              }}>
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* ── LEADERBOARD — navy, podium ── */}
        <div style={{ background: '#071629', borderRadius: 20, padding: 18, boxShadow: '0 4px 20px rgba(7,22,41,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>★ Leaderboard</span>
            <Link href="/dashboard/leaderboard" style={{ fontSize: 11, color: '#ffcb5d', textDecoration: 'none' }}>See all →</Link>
          </div>

          {topStudents.length === 0 ? (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '12px 0' }}>No data yet.</p>
          ) : (
            <>
              {/* Podium — top 3 */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 6, marginBottom: 16 }}>
                {/* 2nd */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>▲2</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {topStudents[1]?.name?.split(' ')[0] || '—'}
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.1)', borderRadius: '8px 8px 0 0', height: 44,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff',
                  }}>
                    {topStudents[1]?.total_hours || 0}h
                  </div>
                </div>
                {/* 1st */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>▲1</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)', marginBottom: 4, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {topStudents[0]?.name?.split(' ')[0] || '—'}
                  </div>
                  <div style={{
                    background: '#ffcb5d', borderRadius: '8px 8px 0 0', height: 60,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#071629',
                  }}>
                    {topStudents[0]?.total_hours || 0}h
                  </div>
                </div>
                {/* 3rd */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>▲3</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {topStudents[2]?.name?.split(' ')[0] || '—'}
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.06)', borderRadius: '8px 8px 0 0', height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff',
                  }}>
                    {topStudents[2]?.total_hours || 0}h
                  </div>
                </div>
              </div>

              {/* Ranks 4-5 */}
              {topStudents.slice(3, 5).map((s, i) => (
                <div key={s.user_id} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0',
                  borderTop: '0.5px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', minWidth: 14 }}>{i + 4}</span>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff',
                    overflow: 'hidden', flexShrink: 0,
                  }}>
                    {s.photo_url
                      ? <img src={s.photo_url} alt={s.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : s.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.name || 'Student'}
                  </span>
                  <span style={{ fontSize: 11, color: '#ffcb5d', fontWeight: 600 }}>{s.total_hours}h</span>
                </div>
              ))}

              {/* Your rank */}
              <div style={{
                marginTop: 12, padding: '8px 12px', background: 'rgba(61,155,233,0.15)',
                borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 11.5, color: '#3d9be9', fontWeight: 600 }}>Your rank</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>#{currentUserRank} · {currentHours}h</span>
              </div>
            </>
          )}
        </div>

        {/* ── UPCOMING EVENT ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 18, boxShadow: '0 1px 8px rgba(7,22,41,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: '#071629' }}>Upcoming</span>
            <Link href="/dashboard/events" style={{ fontSize: 11, color: '#3d9be9', textDecoration: 'none' }}>See all →</Link>
          </div>
          {nextEvent ? (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                minWidth: 42, height: 42, background: '#071629', borderRadius: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 9, color: '#ffcb5d', fontWeight: 700, lineHeight: 1 }}>
                  {new Date(nextEvent.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                </span>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {new Date(nextEvent.date).getDate()}
                </span>
              </div>
              <div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#071629', lineHeight: 1.3 }}>
                  {nextEvent.title}
                </div>
                <div style={{ fontSize: 11, color: '#6e7591', margin: '3px 0 10px' }}>
                  {nextEvent.time || ''}{nextEvent.location ? ` · ${nextEvent.location}` : nextEvent.online_link ? ' · Online' : ''}
                </div>
                <Link href="/dashboard/events" style={{
                  background: '#3d9be9', color: '#fff', border: 'none', borderRadius: 100,
                  padding: '6px 16px', fontSize: 11.5, fontWeight: 600, textDecoration: 'none', fontFamily: 'inherit',
                }}>
                  RSVP →
                </Link>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 12, color: '#6e7591', textAlign: 'center', padding: '8px 0' }}>No upcoming events.</p>
          )}
        </div>

        {/* ── REMINDERS ── */}
        {notifications.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 18, boxShadow: '0 1px 8px rgba(7,22,41,0.06)' }}>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: '#071629', marginBottom: 10 }}>
              Reminders
            </div>
            {notifications.slice(0, 3).map((n: any, i: number) => {
              const dotColors = ['#ff4757', '#3d9be9', '#ffcb5d']
              return (
                <div key={n.id} style={{ display: 'flex', gap: 9, padding: '7px 0', borderBottom: i < 2 ? '0.5px solid rgba(7,22,41,0.06)' : 'none' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColors[i % dotColors.length], marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#071629' }}>{n.title}</div>
                    <div style={{ fontSize: 10.5, color: '#6e7591' }}>{n.message}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
