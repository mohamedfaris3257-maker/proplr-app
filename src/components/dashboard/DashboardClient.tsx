'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Profile } from '@/lib/types'

/* ─── types ────────────────────────────────────────────────────────────── */

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

/* ─── constants ────────────────────────────────────────────────────────── */

const PILLAR_EMOJI: Record<string, string> = {
  Leadership: '🧭',
  Entrepreneurship: '💡',
  'Digital Literacy': '💻',
  'Personal Branding': '🎨',
  Communication: '💬',
  'Project Management': '📊',
}

const PILLAR_BORDER_COLORS: Record<string, string> = {
  Leadership: '#3d9be9',
  Entrepreneurship: '#ffcb5d',
  'Digital Literacy': '#2ed573',
  'Personal Branding': '#9b59b6',
  Communication: '#27ae60',
  'Project Management': '#e05c3a',
}

const PILLAR_BG: Record<string, string> = {
  Leadership: 'rgba(61,155,233,.06)',
  Entrepreneurship: 'rgba(255,203,93,.08)',
  'Digital Literacy': 'rgba(46,213,115,.06)',
  'Personal Branding': 'rgba(155,89,182,.06)',
  Communication: 'rgba(39,174,96,.06)',
  'Project Management': 'rgba(224,92,58,.06)',
}

/* ─── helpers ──────────────────────────────────────────────────────────── */

function getLevel(progress: number) {
  if (progress >= 100) return { label: 'Certified 🏅', color: 'rgba(255,203,93,.2)', text: '#7a5800' }
  if (progress >= 70) return { label: 'Advanced', color: 'rgba(61,155,233,.12)', text: '#1a5ea5' }
  if (progress >= 30) return { label: 'Intermediate', color: 'rgba(255,203,93,.15)', text: '#7a5800' }
  return { label: 'Beginner', color: 'rgba(46,213,115,.12)', text: '#1a7a42' }
}

function Avatar({ name, url, size = 36 }: { name: string; url: string | null; size?: number }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    )
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: '#3d9be9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Montserrat', sans-serif", fontSize: size * 0.4, fontWeight: 700,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

/* ─── component ────────────────────────────────────────────────────────── */

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
  const studentName = profile.name?.split(' ')[0] || 'Student'

  /* ── stat cards ── */
  const stats = [
    { icon: '⏱', label: 'Hours Logged', value: String(totalHours), gradient: 'linear-gradient(135deg, #e0f0ff 0%, #b6d8f7 100%)', accent: '#3d9be9' },
    { icon: '⭐', label: 'Badges Earned', value: String(badgeCount), gradient: 'linear-gradient(135deg, #fff8e1 0%, #ffe082 100%)', accent: '#b87d00' },
    { icon: '✅', label: 'Pillars Done', value: `${completedPillars}/6`, gradient: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)', accent: '#1a9e4f' },
    { icon: '🔥', label: 'Day Streak', value: String(currentStreak), gradient: 'linear-gradient(135deg, #071629 0%, #0f2744 100%)', accent: '#ffcb5d', dark: true },
  ]

  /* ── pillar cards ── */
  const pillars = courses.map((c: any) => {
    const pillarName = c.pillar_tag || c.title || 'General'
    const progress = courseProgressMap[c.id] || 0
    const level = getLevel(progress)
    return {
      id: c.id,
      emoji: PILLAR_EMOJI[pillarName] || '📘',
      title: pillarName,
      level: level.label,
      levelColor: level.color,
      levelText: level.text,
      sessions: moduleCounts[c.id] || 0,
      students: studentCounts[c.id] || 0,
      progress,
      borderColor: PILLAR_BORDER_COLORS[pillarName] || '#3d9be9',
      bg: PILLAR_BG[pillarName] || 'rgba(61,155,233,.06)',
    }
  })

  /* ── tasks ── */
  const taskItems = pendingTasks.slice(0, 6).map((t: any) => ({
    id: t.id,
    title: t.title || 'Untitled Task',
    desc: t.description || '',
    due: t.due_date ? new Date(t.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '',
    priority: t.priority === 'high' ? 'High' : 'Low',
  }))

  /* ── next event ── */
  const nextEvent = upcomingEvents[0] || null

  /* ── leaderboard: check if current user is in top 5 ── */
  const currentUserInTop5 = topStudents.some(s => s.user_id === profile.user_id)

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 40px' }}>
      {/* ══════ HERO WELCOME BANNER ══════ */}
      <div style={{
        background: 'linear-gradient(135deg, #ffcb5d 0%, #ffe082 40%, #fff3c4 100%)',
        padding: '28px 28px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -30, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.2)' }} />
        <div style={{ position: 'absolute', bottom: -40, right: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.15)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 26, fontWeight: 800, color: '#071629', margin: 0, lineHeight: 1.2 }}>
            Hello, {studentName} 👋
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(7,22,41,.6)', margin: '6px 0 0', fontWeight: 500 }}>
            Let&apos;s see what&apos;s happening today.
          </p>
        </div>
      </div>

      {/* ══════ STAT CARDS ══════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '0 28px', marginTop: -14, position: 'relative', zIndex: 2 }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: stat.gradient,
            borderRadius: 16,
            padding: '16px 14px',
            boxShadow: '0 2px 8px rgba(0,0,0,.06)',
            transition: 'transform .15s',
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
            <div style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 26, fontWeight: 800,
              color: stat.dark ? '#ffffff' : '#071629',
              lineHeight: 1.1,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: 11.5, fontWeight: 500, marginTop: 2,
              color: stat.dark ? 'rgba(255,255,255,.7)' : 'rgba(7,22,41,.5)',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ══════ TWO-COLUMN LAYOUT ══════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, padding: '20px 28px 0' }}>

        {/* ── LEFT COLUMN (60%) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* MY PILLARS — horizontal scroll */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: '#071629' }}>My Pillars</span>
              <Link href="/dashboard/courses" style={{ fontSize: 12, color: '#3d9be9', textDecoration: 'none', fontWeight: 500 }}>See all →</Link>
            </div>
            <div style={{
              display: 'flex', gap: 12, overflowX: 'auto',
              paddingBottom: 6,
              scrollbarWidth: 'thin',
              scrollbarColor: '#ddd transparent',
            }}>
              {pillars.length === 0 && (
                <p style={{ fontSize: 13, color: '#6e7591', padding: '16px 0', width: '100%', textAlign: 'center' }}>
                  No courses enrolled yet.
                </p>
              )}
              {pillars.map(p => (
                <Link
                  href={`/dashboard/courses/${p.id}`}
                  key={p.id}
                  style={{
                    minWidth: 200, maxWidth: 220, flex: '0 0 auto',
                    background: '#fff',
                    borderRadius: 14,
                    borderLeft: `4px solid ${p.borderColor}`,
                    padding: '14px 14px 12px',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    textDecoration: 'none', color: 'inherit',
                    boxShadow: '0 1px 4px rgba(0,0,0,.04)',
                    transition: 'box-shadow .15s, transform .15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 36, height: 36, borderRadius: 10, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 18,
                      background: p.bg,
                    }}>
                      {p.emoji}
                    </span>
                    <div>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12.5, fontWeight: 700, color: '#071629', lineHeight: 1.3 }}>
                        {p.title}
                      </div>
                      <span style={{
                        display: 'inline-block', fontSize: 9.5, fontWeight: 600, marginTop: 2,
                        padding: '2px 7px', borderRadius: 100,
                        background: p.levelColor, color: p.levelText,
                      }}>
                        {p.level}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 10.5, color: '#6e7591' }}>
                    <span>📋 {p.sessions}</span>
                    <span>👥 {p.students}</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: '#6e7591' }}>Progress</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#071629' }}>{p.progress}%</span>
                    </div>
                    <div style={{ height: 5, background: '#eef0f8', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 10, background: p.borderColor, width: `${p.progress}%`, transition: 'width .4s ease' }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* LEADERBOARD */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '18px 16px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: '#071629' }}>🏆 Leaderboard</span>
              <Link href="/dashboard/leaderboard" style={{ fontSize: 12, color: '#3d9be9', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
            </div>

            {topStudents.length === 0 ? (
              <p style={{ fontSize: 13, color: '#6e7591', textAlign: 'center', padding: '20px 0' }}>No students yet.</p>
            ) : (
              <>
                {/* ── PODIUM (top 3) ── */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: 18, paddingTop: 10 }}>
                  {/* 2nd place */}
                  {topStudents.length >= 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <Avatar name={topStudents[1].name} url={topStudents[1].photo_url} size={40} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#071629', maxWidth: 72, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {topStudents[1].name.split(' ')[0]}
                      </span>
                      <span style={{ fontSize: 10, color: '#6e7591', fontWeight: 500 }}>{topStudents[1].total_hours}h</span>
                      <div style={{
                        width: 56, height: 48, borderRadius: '8px 8px 0 0',
                        background: 'linear-gradient(180deg, #e0e0e0 0%, #c0c0c0 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 800, color: '#fff',
                      }}>
                        2
                      </div>
                    </div>
                  )}
                  {/* 1st place */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 18, marginBottom: -2 }}>👑</div>
                    <Avatar name={topStudents[0].name} url={topStudents[0].photo_url} size={48} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#071629', maxWidth: 80, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {topStudents[0].name.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: 10.5, color: '#b87d00', fontWeight: 600 }}>{topStudents[0].total_hours}h</span>
                    <div style={{
                      width: 60, height: 64, borderRadius: '8px 8px 0 0',
                      background: 'linear-gradient(180deg, #ffe082 0%, #ffcb5d 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 800, color: '#fff',
                    }}>
                      1
                    </div>
                  </div>
                  {/* 3rd place */}
                  {topStudents.length >= 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <Avatar name={topStudents[2].name} url={topStudents[2].photo_url} size={38} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#071629', maxWidth: 72, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {topStudents[2].name.split(' ')[0]}
                      </span>
                      <span style={{ fontSize: 10, color: '#6e7591', fontWeight: 500 }}>{topStudents[2].total_hours}h</span>
                      <div style={{
                        width: 52, height: 36, borderRadius: '8px 8px 0 0',
                        background: 'linear-gradient(180deg, #e2a97e 0%, #cd7f32 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 800, color: '#fff',
                      }}>
                        3
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Ranks 4-5 ── */}
                {topStudents.slice(3).map((s, i) => (
                  <div key={s.user_id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px',
                    borderTop: '1px solid rgba(7,22,41,.06)', background: i % 2 === 0 ? 'rgba(0,0,0,.015)' : 'transparent',
                    borderRadius: 8,
                  }}>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#6e7591', minWidth: 20, textAlign: 'center' }}>
                      {i + 4}
                    </span>
                    <Avatar name={s.name} url={s.photo_url} size={30} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#071629', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.name}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#071629' }}>{s.total_hours}h</span>
                  </div>
                ))}

                {/* ── Current user rank (if not in top 5) ── */}
                {!currentUserInTop5 && currentUserEntry && (
                  <>
                    <div style={{ textAlign: 'center', padding: '4px 0', color: '#6e7591', fontSize: 14, letterSpacing: 2 }}>•••</div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px',
                      background: 'rgba(61,155,233,.06)', borderRadius: 8, border: '1px solid rgba(61,155,233,.15)',
                    }}>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#3d9be9', minWidth: 20, textAlign: 'center' }}>
                        {currentUserRank}
                      </span>
                      <Avatar name={currentUserEntry.name} url={currentUserEntry.photo_url} size={30} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#3d9be9' }}>
                        You
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#071629' }}>{currentUserEntry.total_hours}h</span>
                    </div>
                  </>
                )}

                {/* ── Current user rank (if in top 5 — show highlight) ── */}
                {currentUserInTop5 && currentUserRank > 0 && (
                  <div style={{
                    textAlign: 'center', padding: '8px 0 2px',
                    fontSize: 12, color: '#3d9be9', fontWeight: 600,
                  }}>
                    You&apos;re #{currentUserRank}! Keep going 🚀
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN (40%) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* QUICK TASKS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: '#071629' }}>Quick Tasks</span>
              <Link href="/dashboard/tasks" style={{ fontSize: 12, color: '#3d9be9', textDecoration: 'none', fontWeight: 500 }}>All tasks →</Link>
            </div>

            {taskItems.length === 0 ? (
              <div style={{
                background: '#fff', borderRadius: 14, padding: '28px 16px', textAlign: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,.04)',
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>✨</div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 700, color: '#071629', margin: '0 0 4px' }}>
                  All caught up!
                </p>
                <p style={{ fontSize: 12, color: '#6e7591' }}>No pending tasks right now.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {taskItems.map(task => (
                  <div key={task.id} style={{
                    background: '#fff', borderRadius: 12, padding: '12px 12px 10px',
                    boxShadow: '0 1px 3px rgba(0,0,0,.04)',
                    display: 'flex', flexDirection: 'column', gap: 4,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#071629', lineHeight: 1.3, flex: 1 }}>
                        {task.title}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100, whiteSpace: 'nowrap',
                        background: task.priority === 'High' ? 'rgba(255,71,87,.1)' : 'rgba(46,213,115,.1)',
                        color: task.priority === 'High' ? '#c0392b' : '#1a7a42',
                      }}>
                        {task.priority}
                      </span>
                    </div>
                    {task.due && (
                      <span style={{ fontSize: 10.5, color: '#6e7591' }}>📅 {task.due}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* UPCOMING EVENT CARD — navy */}
          <div style={{
            background: 'linear-gradient(135deg, #071629 0%, #0f2744 100%)',
            borderRadius: 16, padding: '18px 16px',
            boxShadow: '0 2px 10px rgba(7,22,41,.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#fff' }}>📅 Upcoming Event</span>
              <Link href="/dashboard/events" style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>See all</Link>
            </div>
            {nextEvent ? (
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>
                  {nextEvent.title}
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 12, flexWrap: 'wrap' }}>
                  <span>📆 {new Date(nextEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  {nextEvent.time && <span>🕐 {nextEvent.time}</span>}
                  {nextEvent.location && <span>📍 {nextEvent.location}</span>}
                  {!nextEvent.location && nextEvent.online_link && <span>🌐 Online</span>}
                </div>
                <Link
                  href={`/dashboard/events`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#ffcb5d', color: '#071629', borderRadius: 100,
                    padding: '8px 18px', fontSize: 12, fontWeight: 700,
                    textDecoration: 'none', fontFamily: "'Montserrat', sans-serif",
                    transition: 'transform .1s',
                  }}
                >
                  RSVP →
                </Link>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', textAlign: 'center', padding: '10px 0' }}>
                No upcoming events.
              </p>
            )}
          </div>

          {/* NOTIFICATIONS / REMINDERS */}
          {notifications.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 14px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#071629', marginBottom: 8 }}>
                🔔 Notifications
              </div>
              {notifications.slice(0, 3).map((n: any) => (
                <div key={n.id} style={{
                  display: 'flex', gap: 8, padding: '7px 0',
                  borderBottom: '1px solid rgba(7,22,41,.05)',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3d9be9', marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#071629', lineHeight: 1.4 }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: '#6e7591', lineHeight: 1.4 }}>{n.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* UPCOMING EVENTS LIST */}
          {upcomingEvents.length > 1 && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 14px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#071629', marginBottom: 8 }}>
                🗓️ More Events
              </div>
              {upcomingEvents.slice(1, 4).map((e: any, i: number) => {
                const colors = ['#3d9be9', '#ffcb5d', '#2ed573', '#9b59b6']
                return (
                  <div key={e.id} style={{
                    display: 'flex', gap: 10, padding: '7px 0',
                    borderBottom: i < 2 ? '1px solid rgba(7,22,41,.05)' : 'none',
                  }}>
                    <span style={{ fontSize: 11, color: '#6e7591', minWidth: 38 }}>
                      {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: colors[i % colors.length], marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#071629' }}>{e.title}</div>
                      <div style={{ fontSize: 10.5, color: '#6e7591' }}>
                        {e.time || ''}{e.location ? ` · ${e.location}` : e.online_link ? ' · Online' : ''}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
