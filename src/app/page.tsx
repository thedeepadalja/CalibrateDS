'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from 'framer-motion';
import { ArrowRight, Copy, Check } from 'lucide-react';
import styles from './page.module.css';

/* ────────────────────────────────────────────
   The calibration moment: ghost layers converge,
   the drift meter counts down to zero.
   ──────────────────────────────────────────── */

const SNAP = { duration: 1.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] as const };

function DriftMeter() {
  const reduced = useReducedMotion();
  const drift = useMotionValue(reduced ? 0 : 14.2);
  const label = useTransform(drift, (v) => v.toFixed(1));
  const [locked, setLocked] = useState(!!reduced);

  useEffect(() => {
    if (reduced) return;
    const controls = animate(drift, 0, {
      ...SNAP,
      onComplete: () => setLocked(true),
    });
    return () => controls.stop();
  }, [drift, reduced]);

  return (
    <div className={styles.meter} aria-hidden="true">
      <span className={styles.meterLabel}>Δ drift</span>
      <span className={styles.meterValue}>
        <motion.span>{label}</motion.span>px
      </span>
      <span className={`${styles.meterLock} ${locked ? styles.meterLocked : ''}`}>
        {locked ? '● in register' : '○ converging'}
      </span>
    </div>
  );
}

function RegisterWord({ children }: { children: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <span className={styles.registerFinal}>{children}</span>;
  }
  return (
    <span className={styles.registerWrap}>
      <motion.span
        className={styles.ghostStroke}
        initial={{ x: -20, y: -12, opacity: 0.9 }}
        animate={{ x: 0, y: 0, opacity: 0 }}
        transition={SNAP}
        aria-hidden="true"
      >
        {children}
      </motion.span>
      <motion.span
        className={styles.ghostFill}
        initial={{ x: 20, y: 12, opacity: 0.5 }}
        animate={{ x: 0, y: 0, opacity: 0 }}
        transition={SNAP}
        aria-hidden="true"
      >
        {children}
      </motion.span>
      <motion.span
        className={styles.registerFinal}
        initial={{ opacity: 0.15 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.9 }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ──────────────────────────────────────────── */

const CHANNELS = [
  {
    ch: '01',
    name: 'PTB',
    pkg: '@calibrate-ds/cli',
    headline: 'Compile Figma to typed code.',
    desc: 'Scans your file like source, emits typed React components, and feeds 22 MCP tools to your AI IDE.',
    terminal: [
      { type: 'cmd', text: '$ ptb scan' },
      { type: 'ok', text: '✔ 24 components · 180 tokens' },
      { type: 'cmd', text: '$ ptb mcp setup' },
      { type: 'ok', text: '✔ Claude Code → .mcp.json' },
    ],
    href: '/ptb',
  },
  {
    ch: '02',
    name: 'DNA',
    pkg: '@calibrate-ds/dna',
    headline: 'Hold code to its identity.',
    desc: 'Extracts the design identity your codebase already believes, then gates every change against it.',
    terminal: [
      { type: 'cmd', text: '$ dna check' },
      { type: 'err', text: '✗ raw rgba(182,141,66)' },
      { type: 'muted', text: '  → use var(--brand)' },
      { type: 'muted', text: '1 error · 0 warnings' },
    ],
    href: '/dna',
  },
  {
    ch: '03',
    name: 'Plugin',
    pkg: 'Figma Community',
    headline: 'Verify design before handoff.',
    desc: 'Readiness scores, token coverage, and accessibility checks — inside the Figma file itself.',
    terminal: [
      { type: 'muted', text: 'Component Readiness' },
      { type: 'ok', text: '██████████ Button' },
      { type: 'muted', text: '████████░░ Card' },
      { type: 'err', text: '███░░░░░░░ Input' },
    ],
    href: '/plugin',
  },
];

const STOPS = [
  { label: 'Figma', role: 'design source' },
  { label: 'Design-ready', role: 'verified in-file' },
  { label: 'Code', role: 'generated, typed' },
  { label: 'Conformant', role: 'identity enforced' },
];

const BRIDGES = ['Plugin', 'PTB', 'DNA'];

/* pulse travels the track in 5s of a 6.5s cycle; dots and badges
   ping in phase with its arrival at each checkpoint */
const TRAVEL = 5;

const INSTALLS = [
  { label: 'PTB', cmd: 'npm install -g @calibrate-ds/cli', docs: '/docs/getting-started/quickstart' },
  { label: 'DNA', cmd: 'npm install -g @calibrate-ds/dna', docs: '/docs/dna/getting-started/install' },
];

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Home() {
  const [railLive, setRailLive] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const copyCmd = (i: number) => {
    navigator.clipboard.writeText(INSTALLS[i].cmd).then(() => {
      setCopied(i);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className={styles.page}>

      {/* ── Hero: the calibration moment ── */}
      <section className={styles.hero}>
        <div className={styles.heroTicks} aria-hidden="true" />
        <div className={styles.heroInner}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={rise}>
              <DriftMeter />
            </motion.div>

            <motion.h1 className={styles.headline} variants={rise}>
              <span className={styles.headlineTop}>Design and code,</span>
              <RegisterWord>calibrated.</RegisterWord>
            </motion.h1>

            <motion.p className={styles.sub} variants={rise}>
              Figma and your codebase are two instruments reading the same signal.
              CalibrateDS keeps them in register — verified in design, compiled to
              code, held to one identity.
            </motion.p>

            <motion.div className={styles.heroActions} variants={rise}>
              <Link href="#why" className={styles.btnPrimary}>
                Why CalibrateDS <ArrowRight size={14} />
              </Link>
              <Link href="#instruments" className={styles.btnGhost}>
                The three instruments
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.readouts}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              { val: '03', label: 'instruments' },
              { val: '22+5', label: 'MCP tools' },
              { val: '0.0px', label: 'tolerated drift' },
            ].map((r) => (
              <div key={r.label} className={styles.readout}>
                <span className={styles.readoutVal}>{r.val}</span>
                <span className={styles.readoutLabel}>{r.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 01 · Why ── */}
      <section className={styles.why} id="why">
        <div className={styles.whyInner}>
          <motion.span
            className={styles.benchEyebrow}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            01 · Why — the belief
          </motion.span>
          <motion.p
            className={styles.whyStatement}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Design and code are two records of the same decisions — and every
            handoff erodes them. A color approved in Figma ships one shade off.
            A spacing grid rots one arbitrary pixel at a time. AI writes UI
            faster than any team can review it.{' '}
            <em className={styles.whyEm}>
              We built CalibrateDS because a decision made once in design should
              survive — measurably — all the way to production.
            </em>
          </motion.p>
        </div>
      </section>

      {/* ── 02 · How: the signal chain ── */}
      <section className={styles.chain}>
        <div className={styles.chainInner}>
          <motion.div
            className={styles.chainHead}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.benchEyebrow}>02 · How — the signal chain</span>
            <h2 className={styles.benchTitle}>One loop, three checkpoints.</h2>
          </motion.div>

          <motion.div
            className={`${styles.rail} ${railLive ? styles.railLive : ''}`}
            onViewportEnter={() => setRailLive(true)}
            viewport={{ margin: '-80px' }}
          >
            <span className={styles.pulseTrack} aria-hidden="true">
              <span className={styles.pulse} />
            </span>

            {STOPS.map((stop, i) => (
              <Fragment key={stop.label}>
                <motion.div
                  className={styles.stop}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.12 }}
                >
                  <span
                    className={`${styles.stopDot} ${i === STOPS.length - 1 ? styles.stopDotFinal : ''}`}
                    style={{ animationDelay: `${(i * TRAVEL) / 3}s` }}
                  />
                  <span className={styles.stopName}>{stop.label}</span>
                  <span className={styles.stopRole}>{stop.role}</span>
                </motion.div>

                {i < STOPS.length - 1 && (
                  <div className={styles.seg}>
                    <motion.span
                      className={styles.segLine}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5, delay: i * 0.12 + 0.1, ease: 'easeOut' }}
                    />
                    <motion.span
                      className={styles.segBadge}
                      style={{ animationDelay: `${(i * TRAVEL) / 3 + TRAVEL / 6}s` }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ type: 'spring', stiffness: 460, damping: 22, delay: i * 0.12 + 0.3 }}
                    >
                      {BRIDGES[i]}
                    </motion.span>
                  </div>
                )}
              </Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 03 · What: the instruments ── */}
      <section className={styles.bench} id="instruments">
        <div className={styles.benchInner}>
          <motion.div
            className={styles.benchHead}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.benchEyebrow}>03 · What — the instruments</span>
            <h2 className={styles.benchTitle}>Three tools. One tolerance: zero.</h2>
          </motion.div>

          <div className={styles.channels}>
            {CHANNELS.map((c, i) => (
              <motion.div
                key={c.name}
                className={styles.channel}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={`${styles.bracket} ${styles.bracketTL}`} aria-hidden="true" />
                <span className={`${styles.bracket} ${styles.bracketTR}`} aria-hidden="true" />
                <span className={`${styles.bracket} ${styles.bracketBL}`} aria-hidden="true" />
                <span className={`${styles.bracket} ${styles.bracketBR}`} aria-hidden="true" />

                <div className={styles.channelHead}>
                  <span className={styles.channelId}>CH·{c.ch}</span>
                  <span className={styles.channelPkg}>{c.pkg}</span>
                </div>
                <h3 className={styles.channelName}>{c.name}</h3>
                <p className={styles.channelHeadline}>{c.headline}</p>
                <p className={styles.channelDesc}>{c.desc}</p>

                <div className={styles.channelTerm}>
                  {c.terminal.map((line, j) => (
                    <span key={j} className={`${styles.termLine} ${styles[`term_${line.type}` as keyof typeof styles]}`}>
                      {line.text}
                    </span>
                  ))}
                </div>

                <Link href={c.href} className={styles.channelCta}>
                  Explore {c.name} <ArrowRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing ── */}
      <section className={styles.closing}>
        <div className={styles.closingInner}>
          <motion.h2
            className={styles.closingTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            Bring your system<br />into register.
          </motion.h2>

          <motion.div
            className={styles.installs}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {INSTALLS.map((inst, i) => (
              <div key={inst.label} className={styles.install}>
                <div className={styles.installPill}>
                  <span className={styles.installLabel}>{inst.label}</span>
                  <code className={styles.installCmd}>{inst.cmd}</code>
                  <button
                    className={styles.copyBtn}
                    onClick={() => copyCmd(i)}
                    aria-label={`Copy ${inst.label} install command`}
                  >
                    {copied === i ? <Check size={14} className={styles.copiedIcon} /> : <Copy size={14} />}
                  </button>
                </div>
                <Link href={inst.docs} className={styles.installDocs}>
                  docs <ArrowRight size={12} />
                </Link>
              </div>
            ))}
            <p className={styles.installNote}>
              Independent instruments — start with the one your problem starts with.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
