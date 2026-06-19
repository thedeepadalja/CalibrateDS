import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'CalibrateDS <hello@deepadalja.com>';
const NOTIFY_TO = 'deep@deepadalja.com';

const SOCIAL_LINKS = [
  { label: 'Website',   href: 'https://deepadalja.com' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/deepadalja/' },
  { label: 'GitHub',    href: 'https://github.com/thedeepadalja' },
  { label: 'Figma',     href: 'https://www.figma.com/@deepadalja' },
  { label: 'npm',       href: 'https://www.npmjs.com/package/@calibrate-ds/cli' },
  { label: 'Medium',    href: 'https://medium.com/@deepadalja' },
  { label: 'Instagram', href: 'https://www.instagram.com/thedeepadalja/' },
  { label: 'YouTube',   href: 'https://www.youtube.com/@DeepAdalja' },
];

const socialLinksHtml = SOCIAL_LINKS.map(s =>
  `<a href="${s.href}" style="color:#64748B;text-decoration:none;font-size:12px;white-space:nowrap;">${s.label}</a>`
).join('<span style="color:#2a2a2e;margin:0 8px;">|</span>');

function confirmationHtml(email: string) {
  const name = email.split('@')[0];
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>You're on the CalibrateDS waitlist</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0b;padding:40px 16px 56px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Logo row -->
        <tr><td align="center" style="padding-bottom:28px;">
          <img src="https://calibrateds.deepadalja.com/CalibrateDSLogoFull.svg"
               alt="CalibrateDS" width="160" height="32"
               style="display:block;border:0;max-width:160px;"
          />
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#111113;border:1px solid #1e1e22;border-radius:16px;overflow:hidden;">

          <!-- Gold accent bar -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="4" style="background:#B68D42;padding:0;line-height:0;font-size:0;">&nbsp;</td>
              <td style="background:linear-gradient(90deg,#1a1508 0%,#111113 60%);padding:28px 36px 24px;">
                <p style="margin:0;font-size:11px;font-weight:700;color:#B68D42;text-transform:uppercase;letter-spacing:0.1em;">CalibrateDS Enterprise</p>
              </td>
            </tr>
          </table>

          <!-- Body -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:0 36px 36px;">
              <h1 style="margin:0 0 12px;font-size:30px;font-weight:800;color:#F5F0E8;line-height:1.15;letter-spacing:-0.5px;">
                You're on the list.
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#94A3B8;line-height:1.75;">
                Thanks for signing up, <strong style="color:#C8B87A;">${name}</strong>. We'll reach out as soon as Enterprise access opens — you'll be first in line.
              </p>

              <!-- Feature cards -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${[
                  ['🤖', 'Team-scoped MCP tools', 'Priority server access with per-team governance and role-based tool access.'],
                  ['🗂', 'Multi-repo governance', 'Track design freshness and implementation status across every repo in your org.'],
                  ['⚙️', 'Custom CI/CD pipelines', 'Native GitHub Actions integration with configurable freshness thresholds.'],
                  ['🎯', 'Dedicated onboarding', 'White-glove setup and a direct line to the team for your first 30 days.'],
                ].map(([icon, title, desc]) => `
                <tr><td style="padding:0 0 12px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:10px;">
                    <tr>
                      <td width="44" style="padding:16px 0 16px 16px;vertical-align:top;font-size:20px;line-height:1;">${icon}</td>
                      <td style="padding:14px 16px 14px 8px;">
                        <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#E2E8F0;">${title}</p>
                        <p style="margin:0;font-size:12px;color:#64748B;line-height:1.55;">${desc}</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>`).join('')}
              </table>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0">
                <tr><td style="border-radius:8px;background:#B68D42;">
                  <a href="https://calibrateds.deepadalja.com/docs/mcp/overview"
                     style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#000;text-decoration:none;letter-spacing:0.01em;">
                    Explore the docs &rarr;
                  </a>
                </td></tr>
              </table>
            </td></tr>
          </table>

          <!-- Divider -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="border-top:1px solid #1e1e22;padding:24px 36px;">

              <!-- Social links -->
              <p style="margin:0 0 12px;text-align:center;">
                ${socialLinksHtml}
              </p>

              <!-- Footer text -->
              <p style="margin:0;font-size:11px;color:#374151;text-align:center;line-height:1.6;">
                You received this because you signed up at
                <a href="https://calibrateds.deepadalja.com" style="color:#4B5563;text-decoration:none;">calibrateds.deepadalja.com</a>.
                &nbsp;&middot;&nbsp; Made by
                <a href="https://deepadalja.com" style="color:#4B5563;text-decoration:none;">Deep Adalja</a>.
              </p>

            </td></tr>
          </table>

        </td></tr>
        <!-- End card -->

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  let email: string;

  try {
    const body = await request.json();
    email = (body.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  try {
    // 1. Confirmation email to the signup
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "You're on the CalibrateDS Enterprise waitlist",
      html: confirmationHtml(email),
    });

    // 2. Notification to owner
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `New waitlist signup: ${email}`,
      html: `<p style="font-family:sans-serif;font-size:15px;">New Enterprise waitlist signup:<br><strong>${email}</strong></p>`,
    });

    // 3. Add to Resend Audience (optional — only if RESEND_AUDIENCE_ID is set)
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[waitlist]', err);
    return NextResponse.json({ error: 'Failed to send — try again' }, { status: 500 });
  }
}
