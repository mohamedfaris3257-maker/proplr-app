interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping email');
    return { ok: false };
  }

  const fromAddr = from ?? 'Proplr <noreply@proplr.ae>';
  const toAddresses = Array.isArray(to) ? to : [to];

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: fromAddr, to: toAddresses, subject, html }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[email] Resend error:', err);
    return { ok: false, error: err };
  }

  return { ok: true };
}

export function welcomeEmailHtml(name: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
      <h1 style="color:#1a2744;font-size:24px">Welcome to Proplr, ${name}! 🎉</h1>
      <p style="color:#4a5568;font-size:16px;line-height:1.6">
        Your application has been approved. You can now sign into your Proplr account and
        start building your career portfolio.
      </p>
      <p style="color:#4a5568;font-size:16px;line-height:1.6">
        Check your email for a separate link to set your password.
      </p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://proplr.ae'}"
         style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
        Go to Proplr
      </a>
      <p style="color:#9ca3af;font-size:12px;margin-top:32px">
        © ${new Date().getFullYear()} Proplr. UAE Student Career Platform.
      </p>
    </div>
  `;
}
