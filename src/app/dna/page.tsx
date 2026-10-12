'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Copy, Check } from 'lucide-react';
import styles from './page.module.css';

/* ────────────────────────────────────────────
   The lint-catch moment: the headline itself
   carries a violation, gets flagged, resolves
   to the token, and passes.
   ──────────────────────────────────────────── */

const PHASES = [
  { at: 1400, label: '✗ color-family-allowlist — raw value', cls: 'flagRaw' },
  { at: 2400, label: '→ dna resolve: var(--brand)', cls: 'flagResolve' },
  { at: 3400, label: '✓ in identity · from: code', cls: 'flagPass' },
] as const;

function CheckedWord({ children }: { children: string }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(reduced ? PHASES.length : 0);

  useEffect(() => {
    if (reduced) return;
    const timers = PHASES.map((p, i) => setTimeout(() => setPhase(i + 1), p.at));
    const done = setTimeout(() => setPhase(PHASES.length + 1), 5600);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [reduced]);

  const settled = phase >= PHASES.length;
  const flag = phase >= 1 && phase <= PHASES.length ? PHASES[phase - 1] : null;

  return (
    <span className={styles.checkedWrap}>
      <span className={`${styles.checkedWord} ${settled ? styles.wordToken : styles.wordRaw}`}>
        {children}
      </span>
      {flag && (
        <motion.span
          key={flag.label}
          className={`${styles.flag} ${styles[flag.cls]}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          aria-hidden="true"
        >
          {flag.label}
        </motion.span>
      )}
    </span>
  );
}

/* ── hero terminal: the whole story in one run ── */

const TERM: Array<{ type: string; text: string; d?: number }> = [
  { type: 'cmd',   text: '$ dna start' },
  { type: 'note',  text: '● reading source — postcss · tailwind · tsx' },
  { type: 'ok',    text: '✔ palette 12 · type 8 · spacing 4px · radius 4' },
  { type: 'ok',    text: '✔ identity.yaml written · provenance: from code', d: 700 },
  { type: 'cmd',   text: '$ dna check' },
  { type: 'err',   text: '✗ Button.module.css:14 — rgba(182,141,66,0.1)' },
  { type: 'note',  text: '  → use var(--brand-dim)' },
  { type: 'muted', text: '  1 error · 0 warnings', d: 700 },
  { type: 'cmd',   text: '$ dna resolve #B68D42' },
  { type: 'ok',    text: '● --brand · axis: color', d: 700 },
  { type: 'cmd',   text: '$ dna check' },
  { type: 'ok',    text: '✓ clean · 0 errors · 0 warnings' },
];

function HeroTerminal() {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? TERM.length : 0);

  useEffect(() => {
    if (reduced || n >= TERM.length) return;
    const t = setTimeout(() => setN(n + 1), TERM[n].d ?? 260);
    return () => clearTimeout(t);
  }, [n, reduced]);

  return (
    <div className={styles.term}>
      <div className={styles.termHead}>
        <span className={styles.termDot} /><span className={styles.termDot} /><span className={styles.termDot} />
        <span className={styles.termTitle}>bash — dna</span>
      </div>
      <pre className={styles.termBody}>
        {TERM.slice(0, n).map((line, i) => (
          <span key={i} className={`${styles.termLine} ${styles[`t_${line.type}` as keyof typeof styles]}`}>
            {line.text}
          </span>
        ))}
        {n < TERM.length && <span className={styles.cursor} />}
      </pre>
    </div>
  );
}

/* ──────────────────────────────────────────── */

const FINDINGS = [
  {
    rule: 'color-family-allowlist',
    snippet: 'background: #b68e41;',
    hint: '→ one digit off var(--brand)',
    note: 'Invisible in code review. Visible in production.',
  },
  {
    rule: 'off-grid-spacing',
    snippet: 'gap: 7px;',
    hint: '→ nearest on-grid: 8px',
    note: 'The 4px grid dies one arbitrary pixel at a time.',
  },
  {
    rule: 'ghost-tokens',
    snippet: 'color: var(--accent-muted);',
    hint: '→ no such token in identity.yaml',
    note: 'Renamed six months ago. Still referenced in 9 files.',
  },
  {
    rule: 'similar · rebuild',
    snippet: '<div className="card-wrap">…',
    hint: '→ 0.92 match with <Card />',
    note: 'An AI rebuilt it because it never checked the inventory.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Extract',
    lead: 'dna start reads what your codebase already believes.',
    desc: 'Palette with tiers inferred from the token resolution graph, type scale, spacing grid, radius idioms — written to .dna/identity.yaml with per-value provenance: { value, from, at }. Nothing invented: observed values are surfaced for review, never silently dropped, never imposed.',
    code: '$ dna start\n✔ identity.yaml — 12 tokens\n  brand:\n    value: "#B68D42"\n    from: code\n    at: 2026-08-12',
  },
  {
    n: '02',
    title: 'Gate',
    lead: 'dna check holds every change to that identity.',
    desc: 'Diff-default — it checks what you changed, not what you inherited. Four layers: source lint, cn-merge guard, rendered conformance in headless Chrome, structural manifests. Tri-state and honest: pass, nothing-to-check, or fail — a no-op never renders as a green tick.',
    code: '$ dna check          # changed lines\n$ dna check --audit  # whole tree\n$ dna hook install   # pre-commit gate',
  },
  {
    n: '03',
    title: 'Cooperate',
    lead: 'Your AI IDE calls dna on its own initiative.',
    desc: 'dna mcp exposes five detector-only tools, and dna start writes the convention into your CLAUDE.md / AGENTS.md: check the inventory before building, resolve values before writing literals, check after every design-relevant edit. The pre-commit hook stays the backstop.',
    code: '$ claude mcp add dna -- dna mcp\n\nyou: "add a hover state"\nAI:  [dna_resolve #B68D42 → --brand]\nAI:  "using var(--brand)"',
  },
];

const FEATURES = [
  {
    title: 'dna resolve',
    desc: 'The proactive counterpart to check: reverse-lookup any raw value to its identity token before the literal is ever written. A value on multiple scales reports all of them.',
  },
  {
    title: 'dna allow',
    desc: 'Deliberate exceptions, adopted with provenance and a required --why into decisions.jsonl. An exception with a reason is a decision. One without is drift.',
  },
  {
    title: 'dna similar',
    desc: 'Catches hand-rebuilds of existing components and net-new shapes cloned across files with no backing component. Advisory, never gating.',
  },
  {
    title: 'Tri-state honesty',
    desc: 'Every check answers pass, nothing-to-check, or fail. Nothing-to-check never renders as a green tick — silence is never sold as success.',
  },
  {
    title: 'Isolation by design',
    desc: 'Owns .dna/ and writes nowhere else. No network calls, no credentials, no telemetry. Every MCP tool is detector-only: it reports, your tools edit.',
  },
  {
    title: 'Speaks shadcn / Tailwind',
    desc: 'HSL-channel tokens (--primary: 142 71% 29%) are recognized when real usage corroborates them — full extraction and resolve for the dominant modern token architecture.',
  },
];

const MCP_TOOLS = [
  { name: 'dna_check', desc: 'Conformance findings as structured data — rule, severity, file, line, hint.' },
  { name: 'dna_resolve', desc: 'Raw value → identity token, before the literal gets written.' },
  { name: 'dna_inventory', desc: 'The component vocabulary — name, props, use-when, path.' },
  { name: 'dna_similar', desc: 'Rebuild and clone findings, tagged by kind, with scores.' },
  { name: 'dna_start_preview', desc: 'What dna start would extract — without writing anything.' },
];

const INSTALL_CMD = 'npm install -g @calibrate-ds/dna';

export default function DNAPage() {
  const [copied, setCopied] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText(INSTALL_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const rise = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <div className={styles.page}>

      {/* ── Hero: the lint-catch moment ── */}
      <section className={styles.hero}>
        <div className={styles.heroTicks} aria-hidden="true" />
        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroLeft}
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div className={styles.versionChip} variants={rise}>
              <span className={styles.versionDot} />
              @calibrate-ds/dna · v0.2.20
            </motion.div>

            <motion.h1 className={styles.headline} variants={rise}>
              <span className={styles.hLine}>Your code</span>
              <span className={styles.hLine}>already knows its</span>
              <CheckedWord>identity.</CheckedWord>
            </motion.h1>

            <motion.p className={styles.sub} variants={rise}>
              dna extracts the palette, type scale, and spacing grid your codebase
              already believes — records where every value came from — and gates
              every change against it. Nothing imposed. Nothing invented.
            </motion.p>

            <motion.div className={styles.heroActions} variants={rise}>
              <Link href="/docs/dna/getting-started/quickstart" className={styles.btnPrimary}>
                Get started <ArrowRight size={14} />
              </Link>
              <div className={styles.installRow}>
                <code className={styles.installCmd}>{INSTALL_CMD}</code>
                <button className={styles.copyBtn} onClick={copyInstall} aria-label="Copy install command">
                  {copied ? <Check size={14} className={styles.copiedIcon} /> : <Copy size={14} />}
                </button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.heroRight}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <HeroTerminal />
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
            <h2 className={styles.sectionTitle}>Drift doesn&apos;t need a handoff.</h2>
            <p className={styles.sectionSub}>
              It happens inside the codebase — one raw literal, one off-grid pixel,
              one rebuilt component at a time. Faster now that AI writes most of the UI.
            </p>
          </motion.div>

          <div className={styles.findings}>
            {FINDINGS.map((f, i) => (
              <motion.div
                key={f.rule}
                className={styles.finding}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <span className={styles.findingRule}>✗ {f.rule}</span>
                <code className={styles.findingSnippet}>{f.snippet}</code>
                <span className={styles.findingHint}>{f.hint}</span>
                <p className={styles.findingNote}>{f.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · The process ── */}
      <section className={styles.process}>
        <div className={styles.inner}>
          <motion.div
            className={styles.sectionHead}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.eyebrow}>02 · The process</span>
            <h2 className={styles.sectionTitle}>Extract. Gate. Cooperate.</h2>
          </motion.div>

          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                className={styles.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={styles.stepN}>{s.n}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepLead}>{s.lead}</p>
                <p className={styles.stepDesc}>{s.desc}</p>
                <pre className={styles.stepCode}>{s.code}</pre>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · The instrument ── */}
      <section className={styles.instrument}>
        <div className={styles.inner}>
          <motion.div
            className={styles.sectionHead}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.eyebrow}>03 · The instrument</span>
            <h2 className={styles.sectionTitle}>Opinionated about honesty.<br />Neutral about your choices.</h2>
          </motion.div>

          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className={styles.feature}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MCP ── */}
      <section className={styles.mcp}>
        <div className={styles.inner}>
          <motion.div
            className={styles.sectionHead}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.eyebrow}>MCP — five detector-only tools</span>
            <h2 className={styles.sectionTitle}>Your AI IDE, conformance-aware.</h2>
            <p className={styles.sectionSub}>
              One command wires them in. None of them ever write source — they report,
              and the agent edits with its own tools.
            </p>
          </motion.div>

          <div className={styles.mcpGrid}>
            {MCP_TOOLS.map((t, i) => (
              <motion.div
                key={t.name}
                className={styles.mcpTool}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <code className={styles.mcpName}>{t.name}</code>
                <p className={styles.mcpDesc}>{t.desc}</p>
              </motion.div>
            ))}
            <motion.div
              className={`${styles.mcpTool} ${styles.mcpWire}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <code className={styles.mcpWireCmd}>$ claude mcp add dna -- dna mcp</code>
              <Link href="/docs/dna/mcp/overview" className={styles.mcpLink}>
                MCP docs <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
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
            Your identity is already<br />in the code. Enforce it.
          </motion.h2>
          <motion.div
            className={styles.closingActions}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className={styles.installRow}>
              <code className={styles.installCmd}>{INSTALL_CMD}</code>
              <button className={styles.copyBtn} onClick={copyInstall} aria-label="Copy install command">
                {copied ? <Check size={14} className={styles.copiedIcon} /> : <Copy size={14} />}
              </button>
            </div>
            <Link href="/docs/dna/getting-started/quickstart" className={styles.btnPrimary}>
              Read the quickstart <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
