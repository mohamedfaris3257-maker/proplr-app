export const metadata = {
  title: 'Privacy Policy | Proplr',
  description: 'How Proplr collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px', fontFamily: "'DM Sans', sans-serif", color: '#1d1d1f', lineHeight: 1.8 }}>
      <div style={{ marginBottom: 40 }}>
        <a href="/" style={{ fontSize: 13, color: '#3d9be9', textDecoration: 'none' }}>← Back to Proplr</a>
      </div>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 32, fontWeight: 700, color: '#071629', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, color: '#6e7591', marginBottom: 40 }}>Last updated: March 2026 · Proplr FZ-LLC, Dubai, UAE · KHDA Permit #633441</p>

      {[
        {
          title: '1. Who We Are',
          content: 'Proplr ("we", "our", "us") is a KHDA-certified student career development platform operating in Dubai, UAE under Permit #633441. Our registered address is Dubai, United Arab Emirates. For privacy matters, contact us at privacy@proplr.ae.'
        },
        {
          title: '2. Information We Collect',
          content: `We collect the following categories of personal data:

• Identity data: full name, date of birth, profile photo
• Contact data: email address, phone number, WhatsApp number
• Educational data: school name, grade level, program enrollment
• Parent/guardian data: name, email, phone (for students under 18)
• Usage data: pages visited, features used, login times, device and browser type
• Payment data: handled securely by Stripe — we do not store card numbers
• Communications: messages sent through our platform, support requests`
        },
        {
          title: '3. How We Use Your Data',
          content: `We use your personal data to:

• Create and manage your Proplr account
• Deliver our educational programs and track your progress
• Issue KHDA-certified certificates
• Send program updates, event reminders, and important notices
• Enable community features, messaging, and social learning
• Process payments for program enrollment
• Improve our platform through anonymized analytics
• Comply with KHDA regulatory requirements and UAE law`
        },
        {
          title: '4. Legal Basis for Processing',
          content: `We process your data under the following legal bases:

• Contract: to deliver the services you enrolled in
• Legal obligation: to comply with KHDA and UAE regulatory requirements
• Legitimate interests: to improve our platform and ensure security
• Consent: for marketing communications and optional features (you may withdraw consent at any time)`
        },
        {
          title: '5. Data Sharing',
          content: `We share your data only with:

• KHDA (Dubai Knowledge and Human Development Authority): as required for certificate issuance and regulatory compliance
• Stripe: for secure payment processing
• Supabase: our database provider (data stored in EU-West region)
• Anthropic: AI-powered features (anonymized data only)
• Your school's Proplr coordinator: program progress and attendance data
• Parents/guardians of students under 18: progress reports and certificates

We do not sell your personal data to third parties. We do not share your data with advertisers.`
        },
        {
          title: '6. Data Retention',
          content: `We retain your personal data for:

• Active accounts: for the duration of your enrollment plus 2 years
• Certificates and academic records: 7 years (KHDA requirement)
• Payment records: 5 years (UAE financial regulations)
• Deleted accounts: anonymized within 30 days of deletion request`
        },
        {
          title: '7. Your Rights',
          content: `You have the right to:

• Access your personal data
• Correct inaccurate data
• Request deletion of your data (subject to legal retention requirements)
• Withdraw consent for marketing communications
• Request a copy of your data in a portable format
• Lodge a complaint with the UAE Data Office

To exercise these rights, email privacy@proplr.ae. We will respond within 30 days.`
        },
        {
          title: '8. Children\'s Privacy',
          content: 'Proplr serves students from Grade 8 (approximately 13 years old). For students under 18, we require parental consent during registration. Parents may request access to, correction of, or deletion of their child\'s data by contacting privacy@proplr.ae. We do not knowingly collect data from children under 13.'
        },
        {
          title: '9. Cookies',
          content: 'We use essential cookies to keep you logged in and secure your session. We use analytics cookies (Google Analytics) to understand how our platform is used — these require your consent and can be declined via our cookie banner. See our Cookie Policy for full details.'
        },
        {
          title: '10. Security',
          content: 'We implement industry-standard security measures including TLS encryption in transit, AES-256 encryption at rest, role-based access controls, and regular security audits. Despite these measures, no system is completely secure. Please use a strong password and contact us immediately if you suspect unauthorized access.'
        },
        {
          title: '11. International Transfers',
          content: 'Your data may be processed outside the UAE by our service providers (Supabase in EU, Stripe in USA). We ensure appropriate safeguards are in place including standard contractual clauses and adequacy decisions where applicable.'
        },
        {
          title: '12. Changes to This Policy',
          content: 'We may update this policy periodically. We will notify you of significant changes via email or a notice on our platform. Your continued use of Proplr after changes constitutes acceptance of the updated policy.'
        },
        {
          title: '13. Contact Us',
          content: 'For privacy-related questions or requests:\n\nEmail: privacy@proplr.ae\nAddress: Proplr FZ-LLC, Dubai, UAE\nKHDA Permit: #633441'
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 17, fontWeight: 700, color: '#071629', marginBottom: 10 }}>{section.title}</h2>
          <p style={{ fontSize: 14.5, color: '#4a4a5a', whiteSpace: 'pre-line' }}>{section.content}</p>
        </div>
      ))}
    </main>
  )
}
