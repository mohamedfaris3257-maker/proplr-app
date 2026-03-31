'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Profile } from '@/lib/types'
import { WelcomeModal } from './WelcomeModal'
import { FeatureCarousel } from './FeatureCarousel'
import { DashboardWalkthrough } from './DashboardWalkthrough'

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

/* ─── color system ──────────────────────────────────────────────────── */

const C = {
  bg: '#f0f2f8',
  card: '#ffffff',
  cardBorder: 'rgba(0,0,0,0.08)',
  cardHover: 'rgba(0,0,0,0.02)',
  text: '#071629',
  textMuted: '#64748b',
  textDim: '#94a3b8',
  blue: '#0ea5e9',
  purple: '#a855f7',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  orange: '#f97316',
  pink: '#ec4899',
  gold: '#ffcb5d',
}

const PILLAR_EMOJI: Record<string, string> = {
  Leadership: '◎',
  Entrepreneurship: '◆',
  'Digital Literacy': '▣',
  'Personal Branding': '●',
  Communication: '◈',
  'Project Management': '▦',
}

const PILLAR_COLORS: Record<string, string> = {
  Leadership: C.blue,
  Entrepreneurship: C.amber,
  'Digital Literacy': C.green,
  'Personal Branding': C.pink,
  Communication: C.orange,
  'Project Management': C.purple,
}

/* ─── helpers ───────────────────────────────────────────────────────── */

function getLevel(progress: number) {
  if (progress >= 100) return { label: 'Certified ★', color: `${C.gold}25`, text: C.gold }
  if (progress >= 70) return { label: 'Advanced', color: `${C.blue}25`, text: C.blue }
  if (progress >= 30) return { label: 'Intermediate', color: `${C.amber}25`, text: C.amber }
  return { label: 'Beginner', color: `${C.green}25`, text: C.green }
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
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())

  const firstName = profile.name?.split(' ')[0] || 'Student'
  const fullName = profile.name || 'Student'

  const progressValues = courses.map((c: any) => courseProgressMap[c.id] || 0)
  const overallProgress = progressValues.length > 0
    ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
    : 0

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
      color: PILLAR_COLORS[pillarName] || C.blue,
    }
  })

  const filteredPillars =
    activeTab === 'Completed' ? pillars.filter(p => p.progress >= 100)
    : activeTab === 'Active' ? pillars.filter(p => p.progress > 0 && p.progress < 100)
    : pillars

  const taskItems = pendingTasks.slice(0, 4).map((t: any) => ({
    id: t.id,
    title: t.title || 'Untitled Task',
    due: t.due_date ? new Date(t.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '',
    priority: t.priority === 'high' ? 'high' : 'low',
  }))

  const nextEvent = upcomingEvents[0] || null

  const now = new Date()
  const todayDate = now.getDate().toString()
  const todayMonth = now.getMonth()
  const todayYear = now.getFullYear()
  const today = calMonth === todayMonth && calYear === todayYear ? todayDate : ''
  const firstDay = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const calDays: string[] = []
  for (let i = 0; i < firstDay; i++) calDays.push('')
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d.toString())
  const monthName = new Date(calYear, calMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const eventDays = upcomingEvents
    .filter((e: any) => { const d = new Date(e.date); return d.getMonth() === calMonth && d.getFullYear() === calYear })
    .map((e: any) => new Date(e.date).getDate().toString())
  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }

  const currentHours = currentUserEntry?.total_hours || 0

  /* ── stat cards ── */
  const stats = [
    { label: 'Hours Logged', value: String(totalHours), icon: '◷', color: C.blue, glow: `${C.blue}20` },
    { label: 'Badges Earned', value: String(badgeCount), icon: '★', color: C.amber, glow: `${C.amber}20` },
    { label: 'Pillars Done', value: `${completedPillars}/6`, icon: '▤', color: C.green, glow: `${C.green}20` },
    { label: 'Day Streak', value: `${currentStreak}`, icon: '↯', color: C.red, glow: `${C.red}20` },
  ]

  const cardStyle: React.CSSProperties = {
    background: C.card,
    borderRadius: 18,
    border: `1px solid ${C.cardBorder}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  }

  return (
    <>
      <WelcomeModal name={profile.name || ''} />
      <DashboardWalkthrough />

      {/* ═══════ MAIN ═══════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px' }}>

        {/* TOP BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
          <div>
            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 26, fontWeight: 800, color: '#071629', margin: 0, letterSpacing: -0.5 }}>
              Hello, {firstName} 👋
            </h1>
            <p style={{ fontSize: 13, color: C.textMuted, margin: '4px 0 0' }}>
              Let&apos;s see what&apos;s happening today.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.card, border: `1px solid ${C.cardBorder}`,
              borderRadius: 100, padding: '9px 18px', fontSize: 13, color: C.textMuted,
              width: 220,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search courses, tasks...
            </div>
            <Link href="/dashboard/events" style={{
              width: 40, height: 40, background: C.card, border: `1px solid ${C.cardBorder}`,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative', textDecoration: 'none',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {notifications.length > 0 && (
                <div style={{
                  position: 'absolute', top: 6, right: 6, width: 10, height: 10,
                  background: C.red, borderRadius: '50%', border: `2px solid ${C.bg}`,
                  boxShadow: `0 0 8px ${C.red}60`,
                }} />
              )}
            </Link>
          </div>
        </div>

        {/* FEATURE CAROUSEL */}
        <FeatureCarousel />

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              ...cardStyle,
              padding: '22px 22px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${stat.color}40`;
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${stat.glow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = C.cardBorder;
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `${stat.color}15`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: stat.color, marginBottom: 14,
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: 30, fontWeight: 800,
                color: '#071629', lineHeight: 1, letterSpacing: -1,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 5, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* MY PILLARS */}
        <div style={{ ...cardStyle, padding: '22px 24px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 800, color: '#071629', margin: 0, letterSpacing: -0.3 }}>My Pillars</h3>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center', background: 'rgba(0,0,0,0.04)', borderRadius: 100, padding: 3 }}>
              {['All', 'Active', 'Completed'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  padding: '5px 16px', borderRadius: 100, fontSize: 12, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.2s',
                  background: activeTab === t ? C.blue : 'transparent',
                  color: activeTab === t ? '#fff' : C.textMuted,
                }}>
                  {t}
                </button>
              ))}
              <Link href="/dashboard/courses" style={{ fontSize: 12, color: C.blue, textDecoration: 'none', marginLeft: 8, fontWeight: 600 }}>See all →</Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredPillars.length === 0 && (
              <p style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', padding: '16px 0' }}>
                No pillars found for this filter.
              </p>
            )}
            {filteredPillars.map(p => (
              <Link
                key={p.id}
                href={`/dashboard/courses/${p.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  background: 'rgba(0,0,0,0.02)', borderRadius: 14,
                  textDecoration: 'none', color: 'inherit', transition: 'all .2s',
                  border: `1px solid ${C.cardBorder}`,
                  borderLeft: `4px solid ${p.color}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)';
                  (e.currentTarget as HTMLElement).style.borderColor = `${p.color}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)';
                  (e.currentTarget as HTMLElement).style.borderColor = C.cardBorder;
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `${p.color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: p.color,
                }}>
                  {p.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13.5, fontWeight: 700, color: '#071629' }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Facilitated by Proplr Team</div>
                </div>
                <div style={{ width: 130 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: C.textMuted, marginBottom: 5 }}>
                    <span>Progress</span>
                    <span style={{ fontWeight: 700, color: '#071629' }}>{p.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${p.progress}%`,
                      background: `linear-gradient(90deg, ${p.color}, ${p.color}99)`,
                      borderRadius: 10, transition: 'width .5s ease',
                      boxShadow: `0 0 8px ${p.color}40`,
                    }} />
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 100,
                  background: p.levelColor, color: p.levelText, whiteSpace: 'nowrap',
                }}>
                  {p.level}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* MY TASKS */}
        <div style={{ ...cardStyle, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 800, color: '#071629', margin: 0, letterSpacing: -0.3 }}>My Tasks</h3>
            <Link href="/dashboard/tasks" style={{ fontSize: 12, color: C.blue, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {taskItems.length === 0 ? (
              <div style={{
                gridColumn: '1/-1', background: `${C.amber}10`, border: `1.5px dashed ${C.amber}30`,
                borderRadius: 14, padding: 28, textAlign: 'center', color: C.amber, fontSize: 13,
              }}>
                All caught up! No pending tasks. 🎉
              </div>
            ) : (
              taskItems.map(task => (
                <div key={task.id} style={{
                  background: task.priority === 'high' ? `${C.red}08` : 'rgba(0,0,0,0.02)',
                  borderRadius: 14, padding: '16px 18px',
                  border: `1px solid ${task.priority === 'high' ? `${C.red}20` : C.cardBorder}`,
                  borderLeft: `4px solid ${task.priority === 'high' ? C.red : C.textDim}`,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#071629', flex: 1, paddingRight: 8, lineHeight: 1.3 }}>
                      {task.title}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 100, whiteSpace: 'nowrap',
                      background: task.priority === 'high' ? `${C.red}20` : `${C.green}20`,
                      color: task.priority === 'high' ? C.red : C.green,
                    }}>
                      {task.priority === 'high' ? 'High' : 'Low'}
                    </span>
                  </div>
                  {task.due && (
                    <div style={{ fontSize: 11, color: C.textMuted }}>Due: {task.due}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ═══════ RIGHT PANEL ═══════ */}
      <div style={{ width: 300, minWidth: 300, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* PROFILE CARD */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{
            height: 64,
            background: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)',
            position: 'relative',
          }}>
            <Link href="/dashboard/profile" style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)',
              border: 'none', cursor: 'pointer', color: '#fff', fontSize: 12,
              textDecoration: 'none', borderRadius: 100, padding: '4px 12px',
              fontWeight: 600,
            }}>
              Edit ✎
            </Link>
          </div>
          <div style={{ padding: '0 20px 20px', textAlign: 'center' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: C.blue, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 800,
              margin: '-30px auto 10px', overflow: 'hidden',
              border: `3px solid ${C.card}`, boxShadow: `0 4px 16px rgba(0,0,0,0.3)`,
            }}>
              {profile.photo_url
                ? <img src={profile.photo_url} alt={fullName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : firstName?.[0]?.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 15, color: '#071629' }}>{fullName}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{profile.email}</div>
            <div style={{
              marginTop: 10, display: 'inline-flex', padding: '4px 14px',
              background: `${C.blue}15`,
              borderRadius: 100, fontSize: 11, fontWeight: 700, color: C.blue,
              border: `1px solid ${C.blue}25`,
            }}>
              Foundation Track
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div style={{ ...cardStyle, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: '0 4px', fontSize: 14, fontFamily: 'inherit' }}>‹</button>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#071629' }}>{monthName}</span>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: '0 4px', fontSize: 14, fontFamily: 'inherit' }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: 2 }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} style={{ fontSize: 10, color: C.textDim, padding: '3px 0', fontWeight: 700 }}>{d}</div>
            ))}
            {calDays.map((d, i) => (
              <div key={i} style={{
                fontSize: 11.5, padding: '5px 2px', borderRadius: 8, cursor: d ? 'pointer' : 'default',
                color: d === today ? '#fff' : eventDays.includes(d) ? C.blue : C.textMuted,
                background: d === today ? C.blue : 'transparent',
                fontWeight: d === today || eventDays.includes(d) ? 700 : 400,
                aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                visibility: d === '' ? 'hidden' : 'visible',
                boxShadow: d === today ? `0 2px 10px ${C.blue}50` : 'none',
              }}>
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* LEADERBOARD */}
        <div style={{
          ...cardStyle,
          padding: 20,
          background: 'linear-gradient(180deg, #f8f9fc 0%, #f0f2f8 100%)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 14, color: '#071629', letterSpacing: -0.3 }}>★ Leaderboard</span>
            <Link href="/dashboard/leaderboard" style={{ fontSize: 11, color: C.gold, textDecoration: 'none', fontWeight: 600 }}>See all →</Link>
          </div>

          {topStudents.length === 0 ? (
            <p style={{ fontSize: 12, color: C.textDim, textAlign: 'center', padding: '12px 0' }}>No data yet.</p>
          ) : (
            <>
              {/* Podium */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8, marginBottom: 18 }}>
                {/* 2nd */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>🥈</div>
                  <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {topStudents[1]?.name?.split(' ')[0] || '—'}
                  </div>
                  <div style={{
                    background: 'rgba(0,0,0,0.06)', borderRadius: '10px 10px 0 0', height: 48,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#071629',
                  }}>
                    {topStudents[1]?.total_hours || 0}h
                  </div>
                </div>
                {/* 1st */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>🥇</div>
                  <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.8)', marginBottom: 4, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {topStudents[0]?.name?.split(' ')[0] || '—'}
                  </div>
                  <div style={{
                    background: `linear-gradient(180deg, ${C.gold}, ${C.amber})`, borderRadius: '10px 10px 0 0', height: 64,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#071629',
                    boxShadow: `0 0 20px ${C.gold}30`,
                  }}>
                    {topStudents[0]?.total_hours || 0}h
                  </div>
                </div>
                {/* 3rd */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>🥉</div>
                  <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {topStudents[2]?.name?.split(' ')[0] || '—'}
                  </div>
                  <div style={{
                    background: 'rgba(0,0,0,0.03)', borderRadius: '10px 10px 0 0', height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#071629',
                  }}>
                    {topStudents[2]?.total_hours || 0}h
                  </div>
                </div>
              </div>

              {/* Ranks 4-5 */}
              {topStudents.slice(3, 5).map((s, i) => (
                <div key={s.user_id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                  borderTop: '0.5px solid rgba(0,0,0,0.06)',
                }}>
                  <span style={{ fontSize: 12, color: C.textDim, minWidth: 16, fontWeight: 700 }}>{i + 4}</span>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#071629',
                    overflow: 'hidden', flexShrink: 0,
                  }}>
                    {s.photo_url
                      ? <img src={s.photo_url} alt={s.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : s.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ flex: 1, fontSize: 12, color: 'rgba(0,0,0,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.name || 'Student'}
                  </span>
                  <span style={{ fontSize: 11, color: C.gold, fontWeight: 700 }}>{s.total_hours}h</span>
                </div>
              ))}

              {/* Your rank */}
              <div style={{
                marginTop: 14, padding: '10px 14px',
                background: `${C.blue}15`,
                borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8,
                border: `1px solid ${C.blue}20`,
              }}>
                <span style={{ fontSize: 12, color: C.blue, fontWeight: 700 }}>Your rank</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 12, color: '#071629', fontWeight: 800 }}>#{currentUserRank} · {currentHours}h</span>
              </div>
            </>
          )}
        </div>

        {/* UPCOMING EVENT */}
        <div style={{ ...cardStyle, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 14, color: '#071629', letterSpacing: -0.3 }}>Upcoming</span>
            <Link href="/dashboard/events" style={{ fontSize: 11, color: C.blue, textDecoration: 'none', fontWeight: 600 }}>See all →</Link>
          </div>
          {nextEvent ? (
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                minWidth: 48, height: 48,
                background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
                borderRadius: 12, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 16px ${C.blue}30`,
              }}>
                <span style={{ fontSize: 9, color: '#fff', fontWeight: 800, lineHeight: 1, letterSpacing: 0.5, opacity: 0.8 }}>
                  {new Date(nextEvent.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                </span>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {new Date(nextEvent.date).getDate()}
                </span>
              </div>
              <div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13.5, fontWeight: 700, color: '#071629', lineHeight: 1.3 }}>
                  {nextEvent.title}
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, margin: '4px 0 12px' }}>
                  {nextEvent.time || ''}{nextEvent.location ? ` · ${nextEvent.location}` : nextEvent.online_link ? ' · Online' : ''}
                </div>
                <Link href={`/dashboard/events/${nextEvent.id}`} style={{
                  background: C.blue, color: '#fff',
                  border: 'none', borderRadius: 100,
                  padding: '7px 18px', fontSize: 11.5, fontWeight: 700,
                  textDecoration: 'none', fontFamily: 'inherit',
                  boxShadow: `0 2px 10px ${C.blue}40`,
                }}>
                  RSVP →
                </Link>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 12, color: C.textMuted, textAlign: 'center', padding: '8px 0' }}>No upcoming events.</p>
          )}
        </div>

        {/* REMINDERS */}
        {notifications.length > 0 && (
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 14, color: '#071629', marginBottom: 12, letterSpacing: -0.3 }}>
              Reminders
            </div>
            {notifications.slice(0, 3).map((n: any, i: number) => {
              const dotColors = [C.red, C.blue, C.gold]
              return (
                <div key={n.id} style={{
                  display: 'flex', gap: 10, padding: '8px 0',
                  borderBottom: i < 2 ? `0.5px solid ${C.cardBorder}` : 'none',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: dotColors[i % dotColors.length], marginTop: 4, flexShrink: 0,
                    boxShadow: `0 0 6px ${dotColors[i % dotColors.length]}40`,
                  }} />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#071629' }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{n.message}</div>
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
