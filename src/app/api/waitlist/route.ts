import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'CalibrateDS <hello@deepadalja.com>';
const NOTIFY_TO = 'deep@deepadalja.com';
// deepadalja.com's DNS isn't cut over to Vercel yet (unlike this domain,
// which works fine) — this template links OUT to the personal site, so
// unlike deepadalja.com's own /api/subscribe it can't self-derive the
// right host from the incoming request. Flip this once DNS is live.
const PERSONAL_SITE_URL = process.env.PERSONAL_SITE_URL || 'https://deepadalja-com.vercel.app';

// Branded confirmation template — docs/email-waitlist-confirmation.html in
// the deepadalja.com repo. Feature cards match this route's three
// Enterprise waitlist categories (frameworks, design tools, GitHub).
const confirmationTemplate = readFileSync(
  join(process.cwd(), 'emails', 'email-waitlist-confirmation.html'),
  'utf8'
);

function confirmationHtml(email: string) {
  const unsubscribeUrl = `https://calibrateds.deepadalja.com/unsubscribe?email=${encodeURIComponent(email)}`;
  return confirmationTemplate
    .replaceAll('{{UNSUBSCRIBE_URL}}', unsubscribeUrl)
    .replaceAll('{{SITE_URL}}', PERSONAL_SITE_URL);
}

// Browsers always send Origin on a fetch POST, and it has to be this site.
// Scripts replaying the request without one are turned away.
function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Resend idempotency keys are capped at 256 chars; emails cap at 254.
function idempotencyKey(step: string, email: string) {
  return `waitlist-${step}/${email}`.slice(0, 256);
}

export async function POST(request: Request) {
  let email: string;
  let honeypot: unknown;

  try {
    const body = await request.json();
    email = (body.email ?? '').trim().toLowerCase();
    honeypot = body.website;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // The form renders this field hidden, so only a bot fills it in. Answer
  // like a real signup so it has nothing to adapt to, but send nothing.
  if (honeypot) {
    console.warn('[waitlist] honeypot tripped');
    return NextResponse.json({ success: true });
  }

  try {
    // This key is shared with deepadalja.com, whose /api/subscribe was
    // flooded by form bots in Oct 2026 and burned the quota for both
    // sites. Every request here costs two sends, so an address already on
    // the list gets a success and no mail.
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      const { data: existing } = await resend.contacts.get({ audienceId, email });
      if (existing) {
        return NextResponse.json({ success: true });
      }
    }

    // The SDK returns errors instead of throwing, so check each one. The
    // idempotency keys make a repeat or racing request for the same
    // address send once, including when no audience is configured.

    // 1. Confirmation email to the signup
    const { error: confirmError } = await resend.emails.send(
      {
        from: FROM,
        to: email,
        subject: "You're on the CalibrateDS Enterprise waitlist",
        html: confirmationHtml(email),
      },
      { idempotencyKey: idempotencyKey('confirmation', email) }
    );
    if (confirmError) throw new Error(confirmError.message);

    // 2. Notification to owner. The address is escaped: it lands in HTML.
    const safeEmail = email.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
    const { error: notifyError } = await resend.emails.send(
      {
        from: FROM,
        to: NOTIFY_TO,
        subject: `New waitlist signup: ${email}`,
        html: `<p style="font-family:sans-serif;font-size:15px;">New Enterprise waitlist signup:<br><strong>${safeEmail}</strong></p>`,
      },
      { idempotencyKey: idempotencyKey('notify', email) }
    );
    if (notifyError) console.error('[waitlist] owner notification failed', notifyError);

    // 3. Add to Resend Audience (optional — only if RESEND_AUDIENCE_ID is set).
    // Last, so a failed confirmation leaves no contact to block the retry.
    if (audienceId) {
      const { error: contactError } = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
      if (contactError) console.error('[waitlist] contact create failed', contactError);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[waitlist]', err);
    return NextResponse.json({ error: 'Failed to send — try again' }, { status: 500 });
  }
}
