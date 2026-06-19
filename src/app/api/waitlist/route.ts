import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'CalibrateDS <hello@deepadalja.com>';
const NOTIFY_TO = 'deep@deepadalja.com';

function confirmationHtml(email: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0b;padding:48px 24px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111113;border:1px solid #222;border-radius:12px;overflow:hidden;max-width:560px;width:100%;">
        <!-- Header bar -->
        <tr><td style="background:#B68D42;padding:4px 0;"></td></tr>
        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 24px;font-size:13px;font-weight:600;color:#B68D42;text-transform:uppercase;letter-spacing:0.08em;">CalibrateDS Enterprise</p>
          <h1 style="margin:0 0 16px;font-size:26px;font-weight:800;color:#F5F0E8;line-height:1.2;">You're on the list.</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#94A3B8;line-height:1.7;">
            Thanks for signing up, ${email.split('@')[0]}. We'll reach out as soon as Enterprise access opens up.
          </p>
          <p style="margin:0 0 8px;font-size:14px;color:#64748B;line-height:1.6;">Here's what's coming your way:</p>
          <ul style="margin:0 0 32px;padding-left:20px;color:#94A3B8;font-size:14px;line-height:2;">
            <li>Priority MCP server access with team-scoped tools</li>
            <li>Multi-repo design system governance</li>
            <li>Custom CI/CD pipeline integration</li>
            <li>Dedicated onboarding and support</li>
          </ul>
          <table cellpadding="0" cellspacing="0"><tr><td>
            <a href="https://calibrateds.com/docs/mcp/overview" style="display:inline-block;background:#B68D42;color:#000;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;">
              Explore the docs →
            </a>
          </td></tr></table>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #1e1e20;">
          <p style="margin:0;font-size:12px;color:#475569;">
            You're receiving this because you signed up at calibrateds.com.<br>
            Made by <a href="https://deepadalja.com" style="color:#B68D42;text-decoration:none;">Deep Adalja</a>.
          </p>
        </td></tr>
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
