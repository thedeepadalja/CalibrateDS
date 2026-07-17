import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'CalibrateDS <hello@deepadalja.com>';
const NOTIFY_TO = 'deep@deepadalja.com';

// Branded confirmation template — docs/email-waitlist-confirmation.html in
// the deepadalja.com repo. Feature cards match this route's three
// Enterprise waitlist categories (frameworks, design tools, GitHub).
const confirmationTemplate = readFileSync(
  join(process.cwd(), 'emails', 'email-waitlist-confirmation.html'),
  'utf8'
);

function confirmationHtml(email: string) {
  const unsubscribeUrl = `https://calibrateds.deepadalja.com/unsubscribe?email=${encodeURIComponent(email)}`;
  return confirmationTemplate.replaceAll('{{UNSUBSCRIBE_URL}}', unsubscribeUrl);
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
