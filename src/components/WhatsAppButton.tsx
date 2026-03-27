'use client'

import { IconWhatsApp } from '@/components/icons'

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/971XXXXXXXXX?text=Hi%20Proplr!%20I%27m%20interested%20in%20learning%20more%20about%20your%20programs."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Proplr on WhatsApp"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: '#25d366',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        zIndex: 999,
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(37,211,102,0.5)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(37,211,102,0.4)';
      }}
    >
      <IconWhatsApp />
    </a>
  )
}
