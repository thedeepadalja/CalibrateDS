'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from 'framer-motion';
import { ArrowRight, ChevronLeft, Check, Copy } from 'lucide-react';
import styles from './page.module.css';

const COMMUNITY_URL = 'https://www.figma.com/community/plugin/1520848851134730449/calibrateds';

/* ── shared: phase timer driven by viewport entry ── */

function usePhases(live: boolean, times: number[]) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!live) return;
    if (reduced) { setPhase(times.length); return; }
    const timers = times.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, reduced]);
  return phase;
}

function Win({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <div className={styles.win}>
      <div className={styles.winHead}>
        <ChevronLeft size={14} className={styles.winBack} />
        <span className={styles.winTitle}>{title}</span>
        {action && <span className={styles.winAction}>{action}</span>}
      </div>
      <div className={styles.winBody}>{children}</div>
    </div>
  );
}

/* ════════ Hero: Home dashboard audits a component live ════════ */

const AXES = [
  { label: 'Accessibility', pct: 96 },
  { label: 'Token coverage', pct: 88 },
  { label: 'Naming hygiene', pct: 94 },
  { label: 'Layout consistency', pct: 90 },
];

function HeroPanel() {
  const reduced = useReducedMotion();
  const score = useMotionValue(reduced ? 92 : 0);
  const label = useTransform(score, (v) => Math.round(v).toString());
  const fixed = usePhases(true, [2600]) >= 1;

  useEffect(() => {
    if (reduced) return;
    const controls = animate(score, 92, { duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [score, reduced]);

  return (
    <Win title="CalibrateDS — Home · Button/Primary" action="Run">
      <div className={styles.scoreRow}>
        <div className={styles.scoreBlock}>
          <span className={styles.scoreGrade}>A</span>
          <span className={styles.scoreValue}><motion.span>{label}</motion.span>/100</span>
        </div>
        <div className={styles.axes}>
          {AXES.map((a, i) => (
            <div key={a.label} className={styles.axis}>
              <span className={styles.axisLabel}>{a.label}</span>
              <span className={styles.axisTrack}>
                <motion.span
                  className={styles.axisFill}
                  initial={{ scaleX: reduced ? a.pct / 100 : 0 }}
                  animate={{ scaleX: a.pct / 100 }}
                  transition={{ duration: 0.9, delay: 0.8 + i * 0.15, ease: 'easeOut' }}
                />
              </span>
              <span className={styles.axisPct}>{a.pct}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.issueCard} ${fixed ? styles.issueFixed : ''}`}>
        <div className={styles.issueMeta}>
          <span className={`${styles.pill} ${fixed ? styles.pillPass : styles.pillFail}`}>
            {fixed ? 'PASS' : 'FAIL'}
          </span>
          <span className={styles.pillGhost}>WCAG</span>
        </div>
        <p className={styles.issueTitle}>
          {fixed ? 'Contrast 4.6 : 1 — body/secondary' : 'Low contrast 2.9 : 1 — body/secondary'}
        </p>
        <div className={styles.issueFoot}>
          <span className={styles.issueNote}>
            {fixed ? 'Bound to var(--text-secondary)' : 'Suggested: var(--text-secondary)'}
          </span>
          <span className={`${styles.fixBtn} ${fixed ? styles.fixBtnDone : ''}`}>
            {fixed ? <>Fixed <Check size={11} /></> : 'Fix'}
          </span>
        </div>
      </div>
    </Win>
  );
}

/* ════════ Module mocks ════════ */

function MockA11y({ live }: { live: boolean }) {
  const fixed = usePhases(live, [1400]) >= 1;
  return (
    <Win title="Accessibility Advisor" action="Run">
      <div className={styles.chipRow}>
        <span className={`${styles.chip} ${styles.chipActive}`}>All (8)</span>
        <span className={styles.chip}>Pass ({fixed ? 2 : 1})</span>
        <span className={styles.chip}>Alert ({fixed ? 3 : 4})</span>
        <span className={styles.chip}>Fail (3)</span>
      </div>
      <div className={`${styles.issueCard} ${fixed ? styles.issueFixed : ''}`}>
        <div className={styles.issueMeta}>
          <span className={`${styles.pill} ${fixed ? styles.pillPass : styles.pillAlert}`}>
            {fixed ? 'PASS' : 'ALERT'}
          </span>
          <span className={styles.pillGhost}>ADVISORY</span>
          <span className={styles.crumb}>btn / chevronDown</span>
        </div>
        <p className={styles.issueTitle}>
          {fixed
            ? 'Touch target resized: "chevronDown" (44×44)'
            : 'Small touch target: "chevronDown" (32×32)'}
        </p>
        <div className={styles.issueFoot}>
          <span className={styles.issueNote}>
            {fixed ? 'Applied to 14 similar nodes · Undo' : 'Native iOS recommends 44×44pt+'}
          </span>
          <span className={`${styles.fixBtn} ${fixed ? styles.fixBtnDone : ''}`}>
            {fixed ? <>Fixed <Check size={11} /></> : 'Fix'}
          </span>
        </div>
      </div>
    </Win>
  );
}

function MockReadiness({ live }: { live: boolean }) {
  const reduced = useReducedMotion();
  const cov = useMotionValue(reduced ? 81 : 0);
  const covLabel = useTransform(cov, (v) => `${Math.round(v)}%`);
  useEffect(() => {
    if (!live || reduced) return;
    const controls = animate(cov, 81, { duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, reduced]);
  return (
    <Win title="Component Readiness" action="Run">
      <div className={styles.healthRow}>
        <span className={styles.healthDot} />
        <span className={styles.healthLabel}>Health: High Risk</span>
        <span className={`${styles.pill} ${styles.pillFail}`}>1 structural</span>
      </div>
      <div className={styles.issueCard}>
        <div className={styles.issueMeta}>
          <span className={`${styles.pill} ${styles.pillFail}`}>HIGH PRIORITY</span>
        </div>
        <p className={styles.issueTitle}>Generic property name: &quot;Property 1&quot;</p>
        <span className={styles.issueNote}>Suggested rename: variant · confidence 0.94</span>
      </div>
      <div className={styles.covCard}>
        <div className={styles.covLeft}>
          <motion.span className={styles.covPct}>{covLabel}</motion.span>
          <span className={styles.covLabel}>Variables &amp; Styles Coverage</span>
        </div>
        <div className={styles.covRight}>
          <span className={styles.covStat}><em>63</em> bound</span>
          <span className={styles.covStat}><em>15</em> hardcoded</span>
        </div>
      </div>
    </Win>
  );
}

const PLATFORM_ROWS = [
  { k: 'WEB CSS', v: 'var(--surface-text-field)' },
  { k: 'SWIFT', v: 'Color.surfaceTextField' },
  { k: 'KOTLIN', v: 'R.color.surface_text_field' },
  { k: 'TAILWIND', v: 'bg-surface-text-field' },
];

function MockInspector({ live }: { live: boolean }) {
  const phase = usePhases(live, [300, 600, 900, 1200, 1800]);
  return (
    <Win title="Token Inspector" action="Inspect">
      <div className={styles.tokenCard}>
        <div className={styles.tokenHead}>
          <span className={styles.tokenKind}>FILL [0]</span>
          <span className={styles.tokenName}>surface/surface-text-field</span>
        </div>
        {PLATFORM_ROWS.slice(0, phase).map((r) => (
          <motion.div
            key={r.k}
            className={styles.tokenRow}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className={styles.tokenPlatform}>{r.k}</span>
            <code className={styles.tokenCode}>{r.v}</code>
            <Copy size={11} className={styles.tokenCopy} />
          </motion.div>
        ))}
      </div>
      {phase >= 5 && (
        <motion.div
          className={styles.warnBar}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>⚠ 20 hardcoded values detected</span>
          <span className={styles.warnAction}>Jump to Errors ↓</span>
        </motion.div>
      )}
    </Win>
  );
}

function MockStateDiff({ live }: { live: boolean }) {
  const phase = usePhases(live, [700, 1300]);
  return (
    <Win title="State Diff Engine" action="Compare">
      <div className={styles.diffHead}>
        <span className={styles.pillGhost}>COMPONENT SET</span>
        <span className={styles.diffName}>TripCard</span>
        <span className={styles.crumb}>2 states</span>
      </div>
      <div className={styles.issueCard}>
        <div className={styles.issueMeta}>
          <span className={styles.crumb}>TripCard → TripCardCompact</span>
        </div>
        <div className={styles.deltaRow}>
          <span className={styles.deltaProp}>Width <em>LAYOUT</em></span>
          <span className={styles.deltaVals}>
            <span className={styles.deltaOld}>343px</span>
            {phase >= 1 && (
              <motion.span
                className={styles.deltaNew}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
              >
                → 191px
              </motion.span>
            )}
          </span>
        </div>
      </div>
      {phase >= 2 && (
        <motion.div
          className={styles.cssBlock}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.cssBlockHead}>
            <span>Generated CSS States</span>
            <span className={styles.cssCopy}>Copy CSS</span>
          </div>
          <pre className={styles.cssCode}>{'.component[data-compact] {\n  width: 191px;\n}'}</pre>
        </motion.div>
      )}
    </Win>
  );
}

const SCENARIOS = [
  { label: 'Original', result: 'Perfect' },
  { label: 'Copy +30%', result: 'Perfect' },
  { label: 'Copy ×2', result: 'Perfect' },
  { label: 'Long Word', result: 'Overflow' },
  { label: 'German · Japanese', result: 'Perfect' },
];

function MockStress({ live }: { live: boolean }) {
  const phase = usePhases(live, [400, 700, 1000, 1300, 1600]);
  return (
    <Win title="Stress Test · AI Enhanced" action="Run">
      <div className={styles.sandboxBar}>
        <span>Sandbox created · Subject: Dropdown</span>
        <span className={styles.warnAction}>Open Sandbox</span>
      </div>
      <div className={styles.scenarios}>
        <div className={styles.scenarioHead}>
          <span>Stress Scenarios</span>
          <span className={styles.crumb}>63 combinations</span>
        </div>
        {SCENARIOS.map((s, i) => (
          <div key={s.label} className={styles.scenarioRow}>
            <span className={styles.scenarioLabel}>{s.label}</span>
            {phase >= i + 1 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                className={`${styles.pill} ${s.result === 'Perfect' ? styles.pillPass : styles.pillAlert}`}
              >
                {s.result}
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </Win>
  );
}

const COLLECTIONS = [
  { name: 'alias', meta: '82 variables' },
  { name: 'brand', meta: '104 variables' },
  { name: 'mapped', meta: '76 variables' },
  { name: 'responsive', meta: '115 variables' },
];

const FORMATS = ['PTB JSON', 'CSS', 'JS', 'React TS', 'Tailwind', 'Style Dict', 'CSV'];

function MockExporter({ live }: { live: boolean }) {
  const phase = usePhases(live, [300, 550, 800, 1050, 1700]);
  return (
    <Win title="Token Exporter / Importer" action="Export">
      <div className={styles.tabRow}>
        <span className={`${styles.tab} ${styles.tabActive}`}>Export</span>
        <span className={styles.tab}>Import</span>
      </div>
      <div className={styles.collections}>
        {COLLECTIONS.map((c, i) => (
          <div key={c.name} className={styles.collectionRow}>
            <span className={`${styles.checkbox} ${phase >= i + 1 ? styles.checkboxOn : ''}`}>
              {phase >= i + 1 && <Check size={10} strokeWidth={3} />}
            </span>
            <span className={styles.collectionName}>{c.name}</span>
            <span className={styles.crumb}>{c.meta}</span>
          </div>
        ))}
      </div>
      <div className={styles.formatRow}>
        {FORMATS.map((f) => (
          <span key={f} className={`${styles.format} ${f === 'PTB JSON' ? styles.formatActive : ''}`}>
            {f}
          </span>
        ))}
      </div>
      {phase >= 5 && (
        <motion.div
          className={styles.exportDone}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Check size={12} /> 377 variables exported · alias chains preserved
        </motion.div>
      )}
    </Win>
  );
}

/* ════════ Page data ════════ */

const PROBLEMS = [
  {
    sev: 'FAIL',
    tag: 'WCAG',
    title: 'Contrast 2.9 : 1 on body text',
    meta: 'rendered background · needs 4.5 : 1',
    note: 'Passed review on the designer’s monitor.',
  },
  {
    sev: 'ALERT',
    tag: 'NAMING',
    title: 'variant="Property 1"',
    meta: 'not a code-safe prop name',
    note: 'Engineering renames it differently in every repo.',
  },
  {
    sev: 'ALERT',
    tag: 'TOKENS',
    title: 'Token coverage 62%',
    meta: 'fill #B68E41 hardcoded · var(--brand) exists',
    note: 'The token existed. The binding didn’t.',
  },
  {
    sev: 'FAIL',
    tag: 'CONTENT',
    title: 'Breaks at 3× text · German',
    meta: 'designed for label: "Submit"',
    note: 'Real content arrives after the handoff.',
  },
];

const MODULES = [
  {
    id: '01',
    name: 'Accessibility Advisor',
    headline: 'Fix it where you see it.',
    desc: 'Context-aware WCAG auditing across six platform targets — contrast measured on rendered luminance, tap targets, font minimums, alt text.',
    bullets: [
      'Live preview before any fix is applied',
      '"Find Similar" bulk-applies across the file, with undo',
      'Learning Mode explains why each issue matters',
    ],
    href: '/docs/plugin/accessibility-advisor',
    Mock: MockA11y,
  },
  {
    id: '02',
    name: 'Component Readiness',
    headline: 'A linter for components.',
    desc: 'Is this component shippable? Prop contracts extracted from variants, naming quality with confidence-scored renames, token coverage by axis.',
    bullets: [
      'Auto-resolve hardcoded values to matching tokens',
      'Batch rename across all variants at once',
      'Exports a clean JSON prop contract',
    ],
    href: '/docs/plugin/component-readiness',
    Mock: MockReadiness,
  },
  {
    id: '03',
    name: 'Token Inspector',
    headline: 'Every binding, every platform.',
    desc: 'Select any node and see every bound variable and every hardcoded property — with the production snippet for each, in five syntaxes.',
    bullets: [
      'CSS · Tailwind · React TS · Swift · Kotlin',
      'Semantic suggestions for hardcoded properties',
      'Selection history with viewport restore',
    ],
    href: '/docs/plugin/token-inspector',
    Mock: MockInspector,
  },
  {
    id: '04',
    name: 'State Diff Engine',
    headline: 'Bugs live in the states.',
    desc: 'Every sibling variant compared against its default — only the properties that changed, with swatches, mapped to CSS pseudo-classes.',
    bullets: [
      'Structure and layer mismatches surfaced first',
      'Hardcoded vs token-bound deltas identified',
      'Ready-to-paste CSS state blocks',
    ],
    href: '/docs/plugin/state-diff',
    Mock: MockStateDiff,
  },
  {
    id: '05',
    name: 'Stress Test · AI',
    headline: 'Break it before users do.',
    desc: 'Real-world content on sandbox clones — 3× text, long words, narrow widths, German and Japanese. Your original frames are never touched.',
    bullets: [
      'Works standalone; BYOK AI adds content-aware scenarios',
      'Fix simulation graded: Resolved / Improved / Worse',
      '8 AI providers, keys stored on-device only',
    ],
    href: '/docs/plugin/stress-test',
    Mock: MockStress,
  },
  {
    id: '06',
    name: 'Token Exporter · Transfer',
    headline: 'The handoff, calibrated.',
    desc: 'Seven engineering formats — PTB JSON feeds the CalibrateDS CLI directly. Figma Transfer moves token systems between files with alias chains kept live.',
    bullets: [
      'Validation catches broken aliases before export',
      'Two-pass import rebuilds collections in one click',
      'CSV opens straight in Sheets or Excel',
    ],
    href: '/docs/plugin/token-exporter',
    Mock: MockExporter,
  },
];

const TRUST = ['Free', '100% local-first', 'BYOK AI — 8 providers', 'No accounts · no telemetry'];

/* ════════ Page ════════ */

function ModuleRow({ mod, index }: { mod: (typeof MODULES)[number]; index: number }) {
  const [live, setLive] = useState(false);
  const { Mock } = mod;
  return (
    <motion.div
      className={`${styles.modRow} ${index % 2 === 1 ? styles.modRowFlip : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onViewportEnter={() => setLive(true)}
    >
      <div className={styles.modText}>
        <span className={styles.modId}>MODULE · {mod.id}</span>
        <h3 className={styles.modName}>{mod.name}</h3>
        <p className={styles.modHeadline}>{mod.headline}</p>
        <p className={styles.modDesc}>{mod.desc}</p>
        <ul className={styles.modBullets}>
          {mod.bullets.map((b) => (
            <li key={b}><Check size={13} className={styles.bulletIcon} /> {b}</li>
          ))}
        </ul>
        <Link href={mod.href} className={styles.pillLink}>
          docs <ArrowRight size={12} />
        </Link>
      </div>
      <div className={styles.modMock}>
        <Mock live={live} />
      </div>
    </motion.div>
  );
}

export default function PluginPage() {
  const rise = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroTicks} aria-hidden="true" />
        <div className={styles.heroInner}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div className={styles.versionChip} variants={rise}>
              <span className={styles.versionDot} />
              CalibrateDS Plugin · v13 · Figma Community
            </motion.div>

            <motion.h1 className={styles.headline} variants={rise}>
              <span className={styles.hLine}>Catch it in the file,</span>
              <span className={styles.hAccent}>not in the build.</span>
            </motion.h1>

            <motion.p className={styles.sub} variants={rise}>
              Six quality modules inside the Figma panel — audit, fix on canvas,
              stress test, and hand off calibrated components. All local, before
              anything ships to engineering.
            </motion.p>

            <motion.div className={styles.heroActions} variants={rise}>
              <a href={COMMUNITY_URL} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
                Get it on Figma Community <ArrowRight size={14} />
              </a>
              <Link href="/docs/plugin/overview" className={styles.btnGhost}>
                Plugin docs
              </Link>
            </motion.div>

            <motion.div className={styles.trust} variants={rise}>
              {TRUST.map((t) => (
                <span key={t} className={styles.trustItem}>{t}</span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <HeroPanel />
          </motion.div>
        </div>
      </section>

      {/* ── 01 · The problem ── */}
      <section className={styles.problem}>
        <div className={styles.inner}>
          <motion.div
            className={styles.sectionHead}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.eyebrow}>01 · The problem</span>
            <h2 className={styles.sectionTitle}>Engineering inherits whatever design ships.</h2>
            <p className={styles.sectionSub}>
              Drift starts before the first line of code — in the file itself.
              These pass every design review and fail in production.
            </p>
          </motion.div>

          <div className={styles.problemGrid}>
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={p.title}
                className={styles.problemCard}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <div className={styles.issueMeta}>
                  <span className={`${styles.pill} ${p.sev === 'FAIL' ? styles.pillFail : styles.pillAlert}`}>
                    {p.sev}
                  </span>
                  <span className={styles.pillGhost}>{p.tag}</span>
                </div>
                <p className={styles.issueTitle}>{p.title}</p>
                <span className={styles.issueNote}>{p.meta}</span>
                <p className={styles.problemNote}>{p.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · The modules ── */}
      <section className={styles.modules}>
        <div className={styles.inner}>
          <motion.div
            className={styles.sectionHead}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.eyebrow}>02 · The instrument, module by module</span>
            <h2 className={styles.sectionTitle}>Six modules. One panel.<br />Zero cloud.</h2>
          </motion.div>

          <div className={styles.modList}>
            {MODULES.map((mod, i) => (
              <ModuleRow key={mod.id} mod={mod} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · Privacy ── */}
      <section className={styles.privacy}>
        <div className={styles.inner}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            03 · The fine print, in bold
          </motion.span>
          <motion.p
            className={styles.privacyStatement}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            No accounts. No cloud. No telemetry.{' '}
            <em className={styles.privacyEm}>
              Audits run on-device, and your AI keys never leave your machine.
            </em>{' '}
            In Dev Mode the plugin is read-only — write guards keep production
            files untouched.
          </motion.p>
        </div>
      </section>

      {/* ── Closing ── */}
      <section className={styles.closing}>
        <div className={styles.inner}>
          <motion.h2
            className={styles.closingTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            The file is the first build.<br />Calibrate it.
          </motion.h2>
          <motion.div
            className={styles.closingActions}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <a href={COMMUNITY_URL} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
              Get it on Figma Community <ArrowRight size={14} />
            </a>
            <Link href="/docs/plugin/overview" className={styles.btnGhost}>
              Read the docs
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
