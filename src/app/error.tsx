'use client'

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      background: '#f0f2f8',
      padding: 24,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>&#x26A0;&#xFE0F;</div>
      <h1 style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 24,
        fontWeight: 700,
        color: '#071629',
        marginBottom: 12,
      }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: 15, color: '#6e7591', maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
        We hit an unexpected error. Our team has been notified. Try refreshing or come back shortly.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={reset} style={{
          background: '#3d9be9',
          color: '#fff',
          border: 'none',
          borderRadius: 100,
          padding: '12px 28px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          Try Again
        </button>
        <a href="/" style={{
          background: '#071629',
          color: '#fff',
          borderRadius: 100,
          padding: '12px 28px',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          fontFamily: 'inherit',
        }}>
          Go Home
        </a>
      </div>
    </div>
  )
}
