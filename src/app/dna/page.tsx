'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, ShieldCheck, GitBranch, Eye, Cpu, Search } from 'lucide-react';
import styles from './page.module.css';

const TERMINAL_LINES = [
  '> dna start',
  '  ✔ Scanning codebase for design identity...',
  '  ✔ Palette: 12 tokens found · from: code',
  '  ✔ Type scale: 8 steps extracted',
  '  ✔ Spacing grid: 4px · from: code',
  '  ✔ identity.yaml written → .dna/',
  '',
  '> dna check',
  '  ✗ color-family-allowlist · page.module.css:42',
  '    rgba(182, 141, 66, 0.1) → use var(--brand)',
  '  ✗ off-grid-spacing · Sidebar.module.css:31',
  '    gap: 2px → nearest on-grid: 4px',
  '',
  '  2 errors · 0 warnings',
];

const MCP_MESSAGES = [
  { role: 'user', text: 'What design violations exist right now?' },
  { role: 'ai', tool: 'dna_check', text: '2 violations found. Button.module.css:14 uses rgba(182,141,66,0.1) — should be var(--brand). Sidebar.module.css:31 has gap:2px, off the 4px grid.' },
  { role: 'user', text: 'What components do we already have?' },
  { role: 'ai', tool: 'dna_inventory', text: 'Found 8 components: Button, Card, Input, Badge, Modal, Sidebar, Navbar, Footer. Check before building — the failure mode for components is ignorance, not defiance.' },
  { role: 'user', text: 'I just added a new Card variant — am I rebuilding something?' },
  { role: 'ai', tool: 'dna_similar', text: 'Structural similarity: 0.92 match with Card (src/components/Card.tsx). Your new component looks like a rebuild. Reuse the existing one.' },
];

const FEATURES = [
  {
    icon: <Eye size={20} color="var(--brand)" />,
    title: 'Extract, don\'t impose',
    desc: 'dna start reads what your codebase already believes — tokens, type scale, spacing grid — and records it as .dna/identity.yaml with per-rule provenance.',
  },
  {
    icon: <ShieldCheck size={20} color="var(--brand)" />,
    title: 'Conformance at every layer',
    desc: 'Static lint catches raw hex values and off-grid spacing. Headless Chrome rendered checks verify the identity is actually applied in the DOM, not just in source.',
  },
  {
    icon: <GitBranch size={20} color="var(--brand)" />,
    title: 'Provenance you can trust',
    desc: 'Every value in identity.yaml carries { from, at } — who held authority (figma | code | hand) and when. Authority flips; which side is stale becomes a lookup.',
  },
  {
    icon: <Search size={20} color="var(--brand)" />,
    title: 'Rebuild detection',
    desc: 'dna similar scores structural similarity between new code and your component library. Catches reinvention that a name-only check would miss.',
  },
  {
    icon: <Cpu size={20} color="var(--brand)" />,
    title: '4 MCP tools for AI IDEs',
    desc: 'dna mcp exposes dna_check, dna_inventory, dna_similar, and dna_start_preview as structured data — so your AI IDE calls them on its own initiative.',
  },
  {
    icon: <Terminal size={20} color="var(--brand)" />,
    title: 'Isolates to .dna/ only',
    desc: 'Runs in a bare directory — no config, no git, no network, no credentials. Owns .dna/ and writes nowhere else. Every tool is detector-only.',
  },
];

export default function DNAPage() {
  const [mounted, setMounted] = useState(false);
  const [termLines, setTermLines] = useState<string[]>([]);
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    let i = 0;
    const id = setInterval(() => {
      if (i < TERMINAL_LINES.length) {
        setTermLines((prev) => [...prev, TERMINAL_LINES[i]]);
        i++;
      } else {
        clearInterval(id);
      }
    }, 160);
    return () => clearInterval(id);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => {
      setChatStep((s) => (s < MCP_MESSAGES.length - 1 ? s + 1 : s));
    }, 2400);
    return () => clearInterval(id);
  }, [mounted]);

  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            @calibrate-ds/dna · v0.2.2
          </div>
          <h1 className={styles.title}>
            Your codebase<br />
            has a design<br />
            <span className={styles.accent}>identity.</span>
          </h1>
          <p className={styles.subtitle}>
            Extract it. Record it with provenance. Keep every file — source and rendered — conformant to it. DNA catches what Figma can&apos;t see: drift that lives in the code itself.
          </p>
          <div className={styles.ctas}>
            <div className={styles.installSnippet}>
              <Terminal size={14} color="var(--brand)" />
              <code>npm install -g @calibrate-ds/dna</code>
            </div>
            <Link href="/docs/dna/getting-started/quickstart" className={styles.primaryBtn}>
              See DNA docs <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>

        {/* Terminal */}
        <motion.div
          className={styles.terminalWrap}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className={styles.terminalHeader}>
            <div className={styles.macBtns}>
              <span className={styles.close} /><span className={styles.min} /><span className={styles.max} />
            </div>
            <span className={styles.termTitle}>bash — dna</span>
          </div>
          <div className={styles.termBody}>
            <pre><code>
              {mounted && termLines.map((line, i) => {
                const safe    = line ?? '';
                const isCmd   = safe.startsWith('>');
                const isOk    = safe.includes('✔');
                const isErr   = safe.includes('✗');
                const isFinal = safe.includes('errors') || safe.includes('warnings');
                return (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      color: isCmd ? 'var(--text-heading)'
                           : isOk  ? '#4ADE80'
                           : isErr ? '#F87171'
                           : isFinal ? 'var(--brand)'
                           : 'var(--text-secondary)',
                    }}
                  >
                    {line || ' '}
                  </span>
                );
              })}
              {mounted && <span className={styles.cursor} />}
            </code></pre>
          </div>
        </motion.div>
      </section>

      {/* MCP Spotlight */}
      <section className={styles.mcp}>
        <div className={`container ${styles.mcpInner}`}>
          <motion.div
            className={styles.mcpTag}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Cpu size={13} color="var(--brand)" />
            MCP — AI IDE Integration
          </motion.div>
          <motion.h2
            className={styles.mcpHeading}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            Your AI IDE, now conformance-aware.
          </motion.h2>
          <motion.p
            className={styles.mcpSub}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
          >
            One command. Your assistant gains live access to your design identity, component inventory, conformance violations, and rebuild detection — all as structured data.
          </motion.p>

          <div className={styles.mcpCols}>
            {/* Chat */}
            <motion.div
              className={styles.chatWindow}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              <div className={styles.chatHeader}>
                <div className={styles.macBtns}>
                  <span className={styles.close} /><span className={styles.min} /><span className={styles.max} />
                </div>
                <span className={styles.chatTitle}>Claude Code · dna connected</span>
                <span className={styles.chatOnline} />
              </div>
              <div className={styles.chatBody}>
                {mounted && MCP_MESSAGES.slice(0, chatStep + 1).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={msg.role === 'user' ? styles.chatUser : styles.chatAI}
                  >
                    {msg.tool && <span className={styles.chatTool}>[{msg.tool}]</span>}
                    {msg.text}
                  </motion.div>
                ))}
                {mounted && chatStep < MCP_MESSAGES.length - 1 && (
                  <div className={styles.chatTyping}>
                    <span /><span /><span />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Tool list */}
            <motion.div
              className={styles.mcpTools}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.28 }}
            >
              {[
                { tool: 'dna_check',         desc: 'Run conformance and return structured findings — rule, severity, file, line, value, hint.' },
                { tool: 'dna_inventory',     desc: 'Return the component library as structured data. Check here before building anything new.' },
                { tool: 'dna_similar',       desc: 'Score structural similarity against the library. Catches reinvention a name-only check misses.' },
                { tool: 'dna_start_preview', desc: 'Preview what dna start would extract — without writing anything to disk.' },
              ].map((t) => (
                <div key={t.tool} className={styles.mcpTool}>
                  <code className={styles.mcpToolName}>{t.tool}</code>
                  <p className={styles.mcpToolDesc}>{t.desc}</p>
                </div>
              ))}
              <Link href="/docs/dna/mcp/overview" className={styles.mcpLink}>
                Explore MCP integration <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks}>
        <div className={`container ${styles.howInner}`}>
          <motion.h2
            className={styles.sectionHeading}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Up and running in two commands
          </motion.h2>
          <div className={styles.steps}>
            {[
              {
                n: '01',
                title: 'Extract your identity',
                desc: 'Run dna start — it scans your codebase, extracts the palette, type scale, and spacing grid, and writes .dna/identity.yaml with per-rule provenance. Also writes a starter config so dna check has something to check immediately.',
                code: 'npm install -g @calibrate-ds/dna\ndna start\n# → .dna/identity.yaml written\n# → ds-lint.config.json written',
              },
              {
                n: '02',
                title: 'Check conformance',
                desc: 'dna check is the gate. It lints source for off-palette colors, off-grid spacing, and arbitrary values. Then optionally renders in headless Chrome to verify the identity is actually applied in the DOM — not just in source.',
                code: 'dna check\n# ✗ color-family-allowlist\n#   rgba(182,141,66) → use var(--brand)\n# ✗ off-grid-spacing  gap: 2px → 4px\n\ndna hook install  # pre-commit gate',
              },
              {
                n: '03',
                title: 'Wire your AI IDE',
                desc: 'Run dna mcp to start the standalone MCP server. Add it to Claude Code or Cursor once. Your AI assistant will call dna_check, dna_inventory, and dna_similar on its own initiative — no terminal context-switching needed.',
                code: 'claude mcp add dna -- dna mcp\n\n# In Claude Code:\n"What components do we already have?"\n# → AI calls dna_inventory automatically',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className={styles.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
              >
                <div className={styles.stepNumber}>{step.n}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                <div className={styles.stepCode}>
                  <pre><code>{step.code}</code></pre>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={`container ${styles.featuresInner}`}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
