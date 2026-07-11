'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, RefreshCw, PenTool, Code2, Cpu, Zap, ShieldCheck, GitBranch } from 'lucide-react';
import styles from './page.module.css';

const TERMINAL_TEXT = [
  '> ptb init',
  '  ✔ ptb.config.json created',
  '  ✔ Figma file key saved',
  '',
  '> ptb token set figd_xxxxxxxxxxxx',
  '  ✔ Token stored — works for CLI and MCP',
  '',
  '> ptb scan',
  '  ✔ 24 components · 180 tokens · 6 variants',
  '',
  '> ptb mcp setup',
  '  ✔ Claude Code  →  .mcp.json',
  '  ✔ Cursor       →  .cursor/mcp.json',
  '',
  '  ✦ Design system wired.',
];

const CHAT_MESSAGES = [
  { role: 'user', text: 'What components are stale after this sprint?' },
  { role: 'ai', tool: 'get_status', text: '3 components are stale: Button, Card, Input. Button has a new token binding on the hover state.' },
  { role: 'user', text: 'Implement Button and verify it against Figma.' },
  { role: 'ai', tool: 'implement_component', text: 'Reading design context — 4 variant axes, 12 token bindings, state contracts for hover/focus/disabled...' },
  { role: 'ai', tool: 'run_verify', text: 'Similarity score: 0.96 ✓  Stamping Button as done.' },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < TERMINAL_TEXT.length) {
        const text = TERMINAL_TEXT[lineIndex];
        lineIndex++;
        setTerminalLines((prev) => [...prev, text]);
      } else {
        clearInterval(interval);
      }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setChatStep((s) => (s < CHAT_MESSAGES.length - 1 ? s + 1 : s));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.heroBackground}>
        <div className={styles.overlay} />
      </div>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroContent}
        >
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            CalibrateDS v0.1.77 · MCP-Powered
          </div>

          <h1 className={styles.title}>
            Your design file is <br />
            <span className="gradient-text">source code.</span>
          </h1>

          <p className={styles.subtitle}>
            Connect your AI IDE to Figma in two commands. CalibrateDS gives Claude Code, Cursor, and Windsurf 22 live tools to scan, implement, verify, and ship components — without you leaving the chat.
          </p>

          <div className={styles.ctaGroup}>
            <div className={styles.codeSnippet}>
              <Terminal size={16} color="var(--brand)" />
              <code>npm install -g @calibrate-ds/cli</code>
            </div>
            <Link href="/docs/mcp/overview" className={styles.primaryBtn}>
              See MCP <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.terminalContainer}
        >
          <div className={styles.terminalHeader}>
            <div className={styles.macButtons}>
              <span className={styles.closeBtn}></span>
              <span className={styles.minBtn}></span>
              <span className={styles.maxBtn}></span>
            </div>
            <div className={styles.terminalTitle}>bash — ptb</div>
          </div>
          <div className={styles.terminalBody}>
            <pre><code>
              {mounted && terminalLines.map((line, i) => {
                const isCmd = line.startsWith('>');
                const isFinal = line.includes('✦');
                return (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      color: isCmd ? '#E2E8F0' : isFinal ? '#B68D42' : '#4A5568',
                    }}
                  >
                    {line || ' '}
                  </span>
                );
              })}
              {mounted && <span className={styles.cursor}></span>}
            </code></pre>
          </div>
        </motion.div>
      </section>

      {/* ── MCP Spotlight ── */}
      <section className={styles.mcpSpotlight}>
        <div className={`container ${styles.mcpInner}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.mcpLabel}
          >
            <Cpu size={14} color="var(--brand)" />
            MCP — AI IDE Integration
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.mcpHeading}
          >
            Your AI IDE, now design-system aware.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={styles.mcpSubheading}
          >
            One connection. Your assistant gains live access to variant axes, token bindings, state contracts, freshness state, and pixel-diff verification — everything it needs to write production code on the first attempt.
          </motion.p>

          <div className={styles.mcpColumns}>
            {/* Chat window */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={styles.chatWindow}
            >
              <div className={styles.chatHeader}>
                <div className={styles.macButtons}>
                  <span className={styles.closeBtn}></span>
                  <span className={styles.minBtn}></span>
                  <span className={styles.maxBtn}></span>
                </div>
                <span className={styles.chatTitle}>Claude Code · ptb connected</span>
                <span className={styles.chatOnline}></span>
              </div>
              <div className={styles.chatBody}>
                {mounted && CHAT_MESSAGES.slice(0, chatStep + 1).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={msg.role === 'user' ? styles.chatUser : styles.chatAI}
                  >
                    {msg.tool && (
                      <span className={styles.chatTool}>[{msg.tool}]</span>
                    )}
                    {msg.text}
                  </motion.div>
                ))}
                {mounted && chatStep < CHAT_MESSAGES.length - 1 && (
                  <div className={styles.chatTyping}>
                    <span></span><span></span><span></span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Capability list */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={styles.mcpCapabilities}
            >
              {[
                { icon: <Zap size={18} color="var(--brand)" />, title: 'Implement from design context', desc: 'Full variant axes, token bindings, and state contracts — AI writes the code, not approximations.' },
                { icon: <ShieldCheck size={18} color="#27C93F" />, title: 'Pixel-diff verification', desc: 'After implementing, AI diffs the component against the Figma thumbnail and self-corrects if the score is below 0.90.' },
                { icon: <RefreshCw size={18} color="#3178C6" />, title: 'Live design drift detection', desc: 'AI knows which components are stale before you do. Ask "what changed?" and get an exact diff.' },
                { icon: <GitBranch size={18} color="#A78BFA" />, title: 'Full pipeline, no terminal', desc: 'Scan Figma, generate tokens, export context, stamp work — 22 tools, all from the chat window.' },
              ].map((item, i) => (
                <div key={i} className={styles.capabilityItem}>
                  <div className={styles.capabilityIcon}>{item.icon}</div>
                  <div>
                    <div className={styles.capabilityTitle}>{item.title}</div>
                    <div className={styles.capabilityDesc}>{item.desc}</div>
                  </div>
                </div>
              ))}

              <Link href="/docs/mcp/overview" className={styles.mcpCTA}>
                Explore MCP integration <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.howItWorks}>
        <div className={`container ${styles.howInner}`}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeading}
          >
            Up and running in three steps
          </motion.h2>

          <div className={styles.steps}>
            {[
              {
                n: '01',
                title: 'Init your project',
                desc: 'Run ptb init — it creates ptb.config.json, prompts for your Figma file key, and stores your access token once for both CLI and MCP.',
                code: 'npm install -g @calibrate-ds/cli\nptb init\nptb token set figd_xxxxxxxxxxxx',
              },
              {
                n: '02',
                title: 'Scan your design file',
                desc: 'PTB fetches your Figma file and normalises it into a structured model — component variants, token bindings, state contracts, layout trees.',
                code: 'ptb scan\nptb generate-tokens\nptb generate-components',
              },
              {
                n: '03',
                title: 'Let your AI IDE drive',
                desc: 'Run ptb mcp setup, open your AI IDE, and ask it to implement, verify, or diff any component. It has live access to every design decision.',
                code: 'ptb mcp setup\n\n// Then in Claude Code / Cursor:\n"Implement the Button component"',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={styles.step}
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

      {/* ── Value Prop ── */}
      <section className={styles.valueProp}>
        <div className={`container ${styles.valuePropContainer}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.featureCard}
          >
            <div className={styles.featureIcon}><PenTool color="#F24E1E" size={32} /></div>
            <h3 className={styles.featureTitle}>Design drift, caught before it ships</h3>
            <p className={styles.featureDesc}>
              Every component has a <code>designHash</code>. When Figma changes, CI fails the PR. No more "this button looks different in prod."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.featureCard}
          >
            <div className={styles.featureIcon}><Cpu color="var(--brand)" size={32} /></div>
            <h3 className={styles.featureTitle}>22 MCP tools, one connection</h3>
            <p className={styles.featureDesc}>
              Inspect, implement, verify, stamp, diff, and query your design system — all from your AI IDE chat. The terminal is optional.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.featureCard}
          >
            <div className={styles.featureIcon}><Code2 color="#3178C6" size={32} /></div>
            <h3 className={styles.featureTitle}>You own the output</h3>
            <p className={styles.featureDesc}>
              No vendor lock-in. Pure React + TypeScript + CSS Modules. The generated code is yours — PTB just ensures it stays in sync with design.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
