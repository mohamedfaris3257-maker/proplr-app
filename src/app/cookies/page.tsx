export const metadata = {
  title: 'Cookie Policy | Proplr',
  description: 'How Proplr uses cookies and tracking technologies.',
}

export default function CookiesPage() {
  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '140px 24px 60px', fontFamily: "'DM Sans', sans-serif", color: '#2d2d3a', lineHeight: 1.8 }}>
      <div style={{ marginBottom: 40 }}>
        <a href="/" style={{ fontSize: 13, color: '#3d9be9', textDecoration: 'none' }}>← Back to Proplr</a>
      </div>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 32, fontWeight: 700, color: '#071629', marginBottom: 8 }}>Cookie Policy</h1>
      <p style={{ fontSize: 13, color: '#6e7591', marginBottom: 40 }}>Last updated: March 2026</p>

      {[
        {
          title: 'What Are Cookies',
          content: 'Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and understand how you use them.'
        },
        {
          title: 'Cookies We Use',
          content: `Essential Cookies (always active):
• supabase-auth-token - keeps you logged in securely
• next-auth session - maintains your session
These cannot be disabled as they are necessary for the Platform to function.

Analytics Cookies (require consent):
• Google Analytics (_ga, _gid) - helps us understand how visitors use Proplr so we can improve it. Collects anonymized data including pages visited, time spent, and device type. No personal information is shared with Google.

We do NOT use:
• Advertising or tracking cookies
• Social media tracking pixels
• Third-party remarketing cookies`
        },
        {
          title: 'Managing Cookies',
          content: 'You can control analytics cookies via our cookie banner when you first visit the site. You can also manage cookies through your browser settings. Note that disabling essential cookies will prevent you from logging in.'
        },
        {
          title: 'Google Analytics',
          content: 'We use Google Analytics 4 to understand platform usage. IP anonymization is enabled. Data is retained for 14 months. You can opt out using the Google Analytics Opt-out Browser Add-on at tools.google.com/dlpage/gaoptout.'
        },
        {
          title: 'Contact',
          content: 'Questions about our cookie use: privacy@proplr.ae'
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 17, fontWeight: 700, color: '#071629', marginBottom: 10 }}>{section.title}</h2>
          <p style={{ fontSize: 14.5, color: '#2d2d3a', whiteSpace: 'pre-line' }}>{section.content}</p>
        </div>
      ))}
    </main>
    </div>
  )
}
