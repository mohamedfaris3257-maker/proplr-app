'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('proplr-cookie-consent')
    if (!consent) setVisible(true)
    if (consent === 'accepted') loadAnalytics()
  }, [])

  const loadAnalytics = () => {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID
    if (!GA_ID) return
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script.async = true
    document.head.appendChild(script)
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) { window.dataLayer.push(args) }
    gtag('js', new Date())
    gtag('config', GA_ID, { anonymize_ip: true })
  }

  const acceptAll = () => {
    localStorage.setItem('proplr-cookie-consent', 'accepted')
    loadAnalytics()
    setVisible(false)
  }

  const acceptEssential = () => {
    localStorage.setItem('proplr-cookie-consent', 'essential')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#071629',
      color: '#fff',
      padding: '16px 24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
      flexWrap: 'wrap',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.2)',
    }}>
      <div style={{ flex: 1, minWidth: 280 }}>
        <p style={{ fontSize: 13.5, margin: 0, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)' }}>
          We use essential cookies to keep you logged in, and optional analytics cookies to improve Proplr.{' '}
          <a href="/cookies" style={{ color: '#ffcb5d', textDecoration: 'underline' }}>Learn more</a>
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button onClick={acceptEssential} style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff',
          borderRadius: 100,
          padding: '8px 18px',
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          Essential only
        </button>
        <button onClick={acceptAll} style={{
          background: '#3d9be9',
          border: 'none',
          color: '#fff',
          borderRadius: 100,
          padding: '8px 18px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          Accept all
        </button>
      </div>
    </div>
  )
}
