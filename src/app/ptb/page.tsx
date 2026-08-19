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
import { ArrowRight, Copy, Check } from 'lucide-react';
import styles from './page.module.css';

const INSTALL_CMD = 'npm install -g @calibrate-ds/cli';

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

/* ════════ Hero: the implement → verify loop, measured ════════ */

const CHAT: Array<{ role: 'user' | 'ai'; tool?: string; text: string }> = [
  { role: 'user', text: 'Anything stale after this sprint?' },
  { role: 'ai', tool: 'get_status', text: '3 stale: Button, Card, Input — Button\'s hover token binding changed in Figma.' },
  { role: 'user', text: 'Implement Button and verify it.' },
  { role: 'ai', tool: 'implement_component', text: 'Reading design context — 4 variant axes · 12 token bindings · hover/focus/disabled state contracts…' },
  { role: 'ai', tool: 'run_verify', text: 'Rendering Button, pixel-diffing against the Figma reference…' },
];

function VerifyLoop() {
  const reduced = useReducedMotion();
  const phase = usePhases(true, [600, 1400, 2400, 3200, 4200, 5000]);
  const score = useMotionValue(reduced ? 0.96 : 0);
  const scoreLabel = useTransform(score, (v) => v.toFixed(2));
  const [stamped, setStamped] = useState(!!reduced);

  useEffect(() => {
    if (reduced || phase < 6) return;
    const controls = animate(score, 0.96, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => setStamped(true),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduced]);

  const visible = reduced ? CHAT.length : Math.min(phase, CHAT.length);

  return (
    <div className={styles.ide}>
      <div className={styles.ideHead}>
        <span className={styles.ideDot} /><span className={styles.ideDot} /><span className={styles.ideDot} />
        <span className={styles.ideTitle}>Claude Code — ptb connected · 23 tools</span>
      </div>
      <div className={styles.ideBody}>
        {CHAT.slice(0, visible).map((m, i) => (
          <motion.div
            key={i}
            className={m.role === 'user' ? styles.msgUser : styles.msgAi}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {m.tool && <span className={styles.toolChip}>[{m.tool}]</span>}
            {m.text}
          </motion.div>
        ))}

        {(reduced || phase >= 6) && (
          <motion.div
            className={styles.verifyMeter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className={styles.meterTop}>
              <span className={styles.meterLabel}>similarity</span>
              <span className={styles.meterScore}>
                <motion.span>{scoreLabel}</motion.span>
              </span>
              <span className={`${styles.meterStamp} ${stamped ? styles.meterStamped : ''}`}>
                {stamped ? '✓ stamped → ptb.lock' : 'gate: 0.90'}
              </span>
            </div>
            <div className={styles.meterTrack}>
              <span className={styles.meterGate} aria-hidden="true" />
              <motion.span
                className={styles.meterFill}
                initial={{ scaleX: reduced ? 0.96 : 0 }}
                animate={{ scaleX: 0.96 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ════════ Page data ════════ */

const PROBLEMS = [
  {
    rule: 'context · hallucinated',
    snippet: '"make it match the design" + screenshot',
    hint: '→ invented props · wrong tokens',
    note: 'The model never saw the real variant axes.',
  },
  {
    rule: 'handoff · redlines rot',
    snippet: 'spec.pdf — updated 3 weeks ago',
    hint: '→ Figma moved on the next day',
    note: 'The spec was stale before the sprint ended.',
  },
  {
    rule: 'done · unmeasured',
    snippet: '"looks right on my machine"',
    hint: '→ no diff against the file',
    note: 'Nobody pixel-checked it. Nobody could.',
  },
  {
    rule: 'staleness · invisible',
    snippet: 'designer edits hover state',
    hint: '→ code keeps shipping the old one',
    note: 'There was no lockfile between design and code.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Scan',
    lead: 'ptb scan reads Figma like a compiler reads source.',
    desc: 'The file becomes a structured, typed model — components, variant axes, token bindings, state contracts, render trees. Typed React shells and CSS custom properties are generated from it, and per-component context files are committed to git, so any AI can read design truth without a live Figma connection.',
    code: '$ ptb scan\n✔ 24 components · 180 tokens\n✔ .ptb/latest.json written\n$ ptb generate-components\n✔ typed shells + CSS variables',
  },
  {
    n: '02',
    title: 'Implement',
    lead: 'Your AI IDE writes from real context, not screenshots.',
    desc: 'ptb mcp setup wires Claude Code, Cursor, or Windsurf in one command — 23 live tools. implement_component hands the AI the actual variant axes, token bindings, and state contracts, plus the import paths of every dependency. No guessing, no invented props.',
    code: '$ ptb mcp setup\n✔ Claude Code → .mcp.json\n\nyou: "implement Button"\nAI:  [get_component] [implement_component]',
  },
  {
    n: '03',
    title: 'Verify & stamp',
    lead: '"Done" is a score, not a feeling.',
    desc: 'run_verify renders the component and pixel-diffs it against the Figma reference. Below the 0.90 gate, the AI reads the visual feedback and self-corrects. At pass, the component is stamped into ptb.lock — and ptb status shows exactly what goes stale the moment design moves again.',
    code: 'AI:  [run_verify]\n     similarity 0.96 ✓ (gate 0.90)\n     stamped → ptb.lock\n$ ptb status\n     Design · Code · Visual — fresh',
  },
];

const FEATURES = [
  {
    title: '23 MCP tools',
    desc: 'Scan, inspect, implement, verify, document, assign, and stamp — entirely from chat. Claude Code, Cursor, Windsurf, VS Code, one setup command.',
  },
  {
    title: 'The verify loop',
    desc: 'Pixel diff against the Figma render with a 0.90 similarity gate. Below it, the AI gets structured visual feedback and corrects itself. Verified means measured.',
  },
  {
    title: 'Freshness ledger',
    desc: 'ptb.lock records designHash vs stampedHash per component. ptb status renders the Design / Code / Visual table; CI catches drift before it ships.',
  },
  {
    title: 'Context in git',
    desc: '.ptb/context/ and AI.md are committed files — portable design truth any AI IDE can read, even with no Figma token and no network.',
  },
  {
    title: 'Team lanes',
    desc: 'assign_component, my_queue, start_work build orders in dependency order, submit_work. The lockfile is the team sync — no external service.',
  },
  {
    title: 'Hardened on real files',
    desc: 'Cross-key collision guard with an --ignore-collisions escape hatch, zod-validated scans that skip bad nodes loudly, capped Retry-After rate-limit resilience. 735 tests.',
  },
];

const TOOL_NAMES = [
  'get_component', 'implement_component', 'run_verify', 'get_status', 'list_components',
  'get_token', 'get_variant_tokens', 'token_impact', 'what_uses', 'run_diff', 'diff_clear',
  'document_component', 'assign_component', 'my_queue', 'start_work', 'submit_work',
  'get_verify_report', 'find_component_by_figma_node', 'list_themes', 'get_checklist',
  'whats_new', 'setup_mcp', 'run',
];

const TRUST = ['Local-first · no cloud sync', 'React + TypeScript out', 'Public beta · 735 tests', 'Windows · macOS · Linux'];

/* ════════ Page ════════ */

export default function PTBPage() {
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
              @calibrate-ds/cli · v0.1.98 · public beta
            </motion.div>

            <motion.h1 className={styles.headline} variants={rise}>
              <span className={styles.hLine}>Your design file</span>
              <span className={styles.hLine}>is source code.</span>
              <span className={styles.hAccent}>Compile it.</span>
            </motion.h1>

            <motion.p className={styles.sub} variants={rise}>
              ptb scans Figma into a typed model, generates React and tokens, and
              gives your AI IDE 23 live tools to implement and pixel-verify against
              the design. Below the 0.90 gate, the AI corrects itself.
            </motion.p>

            <motion.div className={styles.heroActions} variants={rise}>
              <Link href="/docs/getting-started/quickstart" className={styles.btnPrimary}>
                Get started <ArrowRight size={14} />
              </Link>
              <div className={styles.installRow}>
                <code className={styles.installCmd}>{INSTALL_CMD}</code>
                <button className={styles.copyBtn} onClick={copyInstall} aria-label="Copy install command">
                  {copied ? <Check size={14} className={styles.copiedIcon} /> : <Copy size={14} />}
                </button>
              </div>
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
            <VerifyLoop />
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
            <h2 className={styles.sectionTitle}>AI ships UI faster than ever.<br />From screenshots. By guessing.</h2>
            <p className={styles.sectionSub}>
              The design file holds the real contract — variant axes, token bindings,
              state behavior. Everything downstream of the handoff loses it.
            </p>
          </motion.div>

          <div className={styles.findings}>
            {PROBLEMS.map((f, i) => (
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
            <h2 className={styles.sectionTitle}>Scan. Implement. Verify.</h2>
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
            <h2 className={styles.sectionTitle}>A compiler&apos;s rigor.<br />A teammate&apos;s manners.</h2>
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

          <motion.div
            className={styles.toolCloud}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.toolCloudLabel}>All 23, from chat:</span>
            <div className={styles.toolChips}>
              {TOOL_NAMES.map((t, i) => (
                <motion.code
                  key={t}
                  className={styles.toolName}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  {t}
                </motion.code>
              ))}
            </div>
            <Link href="/docs/mcp/overview" className={styles.pillLink}>
              MCP docs <ArrowRight size={12} />
            </Link>
          </motion.div>
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
            Stop guessing from<br />screenshots. Compile.
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
            <Link href="/docs/getting-started/quickstart" className={styles.btnPrimary}>
              Read the quickstart <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
