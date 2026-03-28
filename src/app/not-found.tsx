export default function NotFound() {
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
      <div style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 96,
        fontWeight: 900,
        color: '#3d9be9',
        lineHeight: 1,
        marginBottom: 16,
      }}>404</div>
      <h1 style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 24,
        fontWeight: 700,
        color: '#071629',
        marginBottom: 12,
      }}>
        This page doesn&apos;t exist yet.
      </h1>
      <p style={{ fontSize: 15, color: '#6e7591', maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
        Maybe it&apos;s still being built - just like your career. Head back to Proplr and keep going.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
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
        <a href="/dashboard" style={{
          background: '#3d9be9',
          color: '#fff',
          borderRadius: 100,
          padding: '12px 28px',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          fontFamily: 'inherit',
        }}>
          My Dashboard
        </a>
      </div>
      <div style={{ marginTop: 48, fontSize: 13, color: '#6e7591' }}>
        KHDA Permit #633441 · <a href="mailto:hello@proplr.ae" style={{ color: '#3d9be9' }}>hello@proplr.ae</a>
      </div>
    </div>
  )
}
