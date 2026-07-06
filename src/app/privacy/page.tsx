import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy — CalibrateDS',
  description: 'How CalibrateDS handles anonymous CLI telemetry and what data is never collected.',
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>Last updated: July 6, 2026</p>
        </header>

        <section className={styles.section}>
          <p className={styles.lead}>
            CalibrateDS (<code className={styles.inline}>@calibrate-ds/cli</code>) is built by a solo developer. This page explains
            what data the CLI collects, why, and how to turn it off in one command.
            The short version: <strong>no personal data is ever collected.</strong>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Anonymous telemetry</h2>
          <p>
            Starting in v0.1.70, PTB collects anonymous usage telemetry to understand which commands
            are used and how the tool is adopted over time. Telemetry is enabled by default — a
            one-time notice is printed on your first command run, and you can opt out at any time.
          </p>
          <p>
            This follows the same pattern as other open developer tools: Next.js, Vercel CLI, and
            create-react-app all ship with opt-out telemetry for the same reason — it helps a small
            team prioritise what to fix and build.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>What is collected</h2>
          <ul className={styles.list}>
            <li>Command name (e.g. <code className={styles.inline}>scan</code>, <code className={styles.inline}>implement component</code>)</li>
            <li>PTB version number</li>
            <li>Operating system platform (macOS, Linux, Windows)</li>
            <li>Node.js version</li>
            <li>A random anonymous machine ID (UUID) — see below</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>What is never collected</h2>
          <ul className={styles.list}>
            <li>Figma file keys or access tokens</li>
            <li>Component names, design data, or file contents</li>
            <li>IP addresses</li>
            <li>Your name, email, or any account information</li>
            <li>Any project-specific data from your codebase</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>The machine ID</h2>
          <p>
            On first run, PTB generates a random UUID and stores it locally on your machine. This ID
            is used as the <code>distinct_id</code> in telemetry events so we can count unique
            installations — not unique people. The ID is not linked to your name, email, git identity,
            or any other identifier.
          </p>
          <p>
            The ID is stored at:
          </p>
          <ul className={styles.list}>
            <li>macOS: <code className={styles.inline}>~/Library/Application Support/calibrate-ds/telemetry.json</code></li>
            <li>Linux: <code className={styles.inline}>~/.config/calibrate-ds/telemetry.json</code> (or <code className={styles.inline}>$XDG_CONFIG_HOME/calibrate-ds/telemetry.json</code>)</li>
          </ul>
          <p>You can inspect or delete this file at any time.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>How to opt out</h2>
          <p>Run this command once — it takes effect immediately and persists across updates:</p>
          <pre className={styles.code}>{`ptb telemetry off`}</pre>
          <p>To re-enable or check your current status:</p>
          <pre className={styles.code}>{`ptb telemetry on\nptb telemetry`}</pre>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Where data is sent</h2>
          <p>
            Telemetry events are sent to <a href="https://posthog.com" target="_blank" rel="noreferrer" className={styles.link}>PostHog</a>,
            an open-source product analytics platform. Events are sent over HTTPS and PostHog&apos;s
            data processing is covered by their own{' '}
            <a href="https://posthog.com/privacy" target="_blank" rel="noreferrer" className={styles.link}>privacy policy</a>.
            PTB uses PostHog&apos;s US cloud region.
          </p>
          <p>
            No data is sold, shared with third parties, or used for advertising.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Contact</h2>
          <p>
            Questions about this policy?{' '}
            <a href="mailto:deep@deepadalja.com" className={styles.link}>deep@deepadalja.com</a>
          </p>
        </section>
      </div>
    </main>
  );
}
