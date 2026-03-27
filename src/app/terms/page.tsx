export const metadata = {
  title: 'Terms & Conditions | Proplr',
  description: 'Terms and conditions for using the Proplr platform.',
}

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px', fontFamily: "'DM Sans', sans-serif", color: '#1d1d1f', lineHeight: 1.8 }}>
      <div style={{ marginBottom: 40 }}>
        <a href="/" style={{ fontSize: 13, color: '#3d9be9', textDecoration: 'none' }}>← Back to Proplr</a>
      </div>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 32, fontWeight: 700, color: '#071629', marginBottom: 8 }}>Terms & Conditions</h1>
      <p style={{ fontSize: 13, color: '#6e7591', marginBottom: 40 }}>Last updated: March 2026 · Proplr FZ-LLC, Dubai, UAE</p>

      {[
        {
          title: '1. Acceptance of Terms',
          content: 'By accessing or using the Proplr platform ("Platform"), you agree to be bound by these Terms and Conditions. If you are under 18, your parent or guardian must accept these terms on your behalf. If you do not agree, do not use our Platform.'
        },
        {
          title: '2. About Proplr',
          content: 'Proplr is a KHDA-certified (Permit #633441) student career development platform offering after-school programs, career assessments, and community features for students in the UAE. We operate under the laws of Dubai, United Arab Emirates.'
        },
        {
          title: '3. Eligibility',
          content: 'The Platform is available to students in Grades 8–12 (Foundation program) and university students (Impact program). Students under 18 require verifiable parental consent to enroll. We reserve the right to verify eligibility at any time.'
        },
        {
          title: '4. Account Responsibilities',
          content: `You are responsible for:

• Providing accurate and truthful registration information
• Maintaining the security of your account credentials
• All activity that occurs under your account
• Notifying us immediately of any unauthorized access at hello@proplr.ae

You may not share your account with others or create multiple accounts.`
        },
        {
          title: '5. Program Enrollment and Payments',
          content: `Foundation Program: AED 400/month × 8 months (AED 3,200/year)
Impact Program: AED 999/year (flat rate)
Compass Assessment: as listed at time of purchase

Payments are processed securely via Stripe. By enrolling, you authorize us to charge the applicable fees. All prices are in AED and inclusive of VAT where applicable.`
        },
        {
          title: '6. Refund Policy',
          content: `• Cancellation within 7 days of enrollment: full refund
• Cancellation after 7 days but before program start: 50% refund
• Cancellation after program start: no refund for completed months
• KHDA certificates are non-refundable once issued

To request a refund, email billing@proplr.ae with your enrollment details.`
        },
        {
          title: '7. KHDA Certificates',
          content: 'KHDA certificates are issued upon successful completion of each pillar (minimum 80% attendance and completion of required assessments). Certificates are the property of the student and cannot be revoked once issued, except in cases of fraud or misconduct.'
        },
        {
          title: '8. Acceptable Use',
          content: `You agree NOT to:

• Post harmful, offensive, discriminatory, or illegal content
• Harass, bully, or intimidate other users
• Share another user's personal information without consent
• Use the platform for commercial purposes without written permission
• Attempt to access systems or data you are not authorized to access
• Misrepresent your identity or credentials

Violations may result in immediate account suspension.`
        },
        {
          title: '9. Intellectual Property',
          content: 'All content on the Platform including curriculum materials, assessments, designs, and software is owned by Proplr or its licensors. You may not copy, reproduce, or distribute our content without written permission. Your portfolio and personal work remains your own intellectual property.'
        },
        {
          title: '10. Community and Messaging',
          content: 'Our platform includes social features including community feeds and direct messaging. These features are restricted to verified Proplr members only. You are responsible for content you post. We reserve the right to remove content that violates these terms.'
        },
        {
          title: '11. Limitation of Liability',
          content: 'To the maximum extent permitted by UAE law, Proplr shall not be liable for indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid in the 12 months preceding the claim.'
        },
        {
          title: '12. Governing Law',
          content: 'These Terms are governed by the laws of Dubai, UAE. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.'
        },
        {
          title: '13. Changes to Terms',
          content: 'We may update these Terms at any time. We will notify you via email or platform notice. Continued use of the Platform after changes constitutes acceptance.'
        },
        {
          title: '14. Contact',
          content: 'Questions about these Terms: legal@proplr.ae\nGeneral inquiries: hello@proplr.ae\nKHDA Permit: #633441'
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
