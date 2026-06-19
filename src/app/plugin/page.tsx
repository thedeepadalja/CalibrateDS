'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, PenTool } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

const modules = [
  {
    id: 'accessibility',
    title: 'Accessibility Advisor',
    desc: 'Context-aware WCAG auditing across 6 platform targets — Web, iOS, Android, TV, and more. The plugin checks contrast using actual rendered luminance (not just reported fills), font sizes against platform minimums, tap target sizing, and missing alt text.',
    href: '/docs/plugin/accessibility-advisor',
    features: [
      'Live preview fixes before committing',
      '"Find Similar" + bulk apply across entire file',
      'Global override rules for intentional exceptions',
    ],
  },
  {
    id: 'readiness',
    title: 'Component Readiness',
    desc: 'Acts as a strict linter for your Figma components before they reach engineering. Extracts prop contracts from variant structure, scores naming quality with confidence-rated rename suggestions, and measures token coverage as a percentage.',
    href: '/docs/plugin/component-readiness',
    features: [
      'Auto-resolve hardcoded values to matching variables',
      'Batch rename properties across all variants at once',
      'Back / Forward instance navigation with viewport restore',
    ],
  },
  {
    id: 'token-inspector',
    title: 'Token Inspector',
    desc: 'Select any node and instantly see every bound variable and every hardcoded property — then generate the platform-specific code snippet for each. Supports CSS Variables, Tailwind, React TypeScript, Swift, and Kotlin.',
    href: '/docs/plugin/token-inspector',
    features: [
      'Multi-platform code generation from a single selection',
      'Semantic variable suggestions for hardcoded properties',
      'Selection history with viewport and zoom restore',
    ],
  },
  {
    id: 'state-diff',
    title: 'State Diff Engine',
    desc: 'Most component bugs live in states. Select a component set and the engine compares every sibling variant against the default, showing only the properties that changed — fill, stroke, opacity, shadow, spacing — with color swatch previews.',
    href: '/docs/plugin/state-diff',
    features: [
      'Auto-maps variant names to CSS pseudo-classes',
      'Exports ready-to-paste CSS state blocks',
      'Identifies hardcoded vs. token-bound deltas',
    ],
  },
  {
    id: 'stress-test',
    title: 'Stress Test (AI)',
    desc: 'Designers design for the happy path. Stress Test simulates real-world edge cases — 3× text length, narrow viewports, German and Japanese translations — on sandbox clones. Your original design is never modified.',
    href: '/docs/plugin/stress-test',
    features: [
      'BYOK AI: Anthropic, OpenAI, Gemini, Groq, Mistral, xAI',
      'Fix simulation with Resolved / Improved / Worse grading',
      'AI scenarios cached per component — no repeat API calls',
    ],
  },
  {
    id: 'token-exporter',
    title: 'Token Exporter',
    desc: 'Export your Figma variable collections to 6 engineering-ready formats in one click. Validation catches unresolved aliases, circular references, and missing mode values before you export. Full multi-mode (Light/Dark, breakpoints) support.',
    href: '/docs/plugin/token-exporter',
    features: [
      'PTB JSON format feeds the CalibrateDS CLI directly',
      'Dependency detection with one-click "Add Required"',
      'Live code preview before downloading',
    ],
  },
];

export default function PluginPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroContent}
        >
          <div className={styles.iconWrapper}>
            <PenTool size={48} color="#F24E1E" />
          </div>
          <div className={styles.badge}>Free · Local-first · BYOK AI · No telemetry</div>
          <h1 className={styles.title}>
            Quality control for <br />
            <span className="gradient-text">design engineers.</span>
          </h1>
          <p className={styles.subtitle}>
            The CalibrateDS Figma Plugin is a 6-module quality toolkit — accessibility auditing, component readiness checks, token inspection, state diffing, AI stress testing, and multi-format token export. All local, all inside Figma.
          </p>
          <div className={styles.ctaWrapper}>
            <a
              href="https://www.figma.com/community/plugin/1520848851134730449/calibrateds"
              target="_blank"
              rel="noreferrer"
              className={styles.primaryBtn}
            >
              Get it on Figma Community <ArrowRight size={16} />
            </a>
            <Link href="/docs/plugin/overview" className={styles.secondaryBtn}>
              Read the docs
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Health Score Dashboard callout */}
      <section className={styles.dashboardBanner}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={styles.dashboardInner}
          >
            <div className={styles.dashboardText}>
              <h2 className={styles.dashboardTitle}>One score. Four axes.</h2>
              <p className={styles.dashboardDesc}>
                The Home Dashboard shows a live health score (0–100, A+ to F) for the selected component across Accessibility, Token Coverage, Naming Hygiene, and Layout Consistency. Tap any cell to jump straight into the corresponding module. An AI Assistant tab gives you a context-aware chat for design system questions.
              </p>
            </div>
            <div className={styles.scoreGauge}>
              <svg viewBox="0 0 120 80" width="180" height="120">
                <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
                <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="var(--brand)" strokeWidth="10" strokeLinecap="round" strokeDasharray="157" strokeDashoffset="35" />
                <text x="60" y="68" textAnchor="middle" fill="var(--text-heading)" fontSize="22" fontWeight="800">A</text>
                <text x="60" y="80" textAnchor="middle" fill="var(--text-secondary)" fontSize="9">Health Score</text>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.modulesSection}>
        <div className="container">
          {modules.map((mod, index) => (
            <div key={mod.id} className={`${styles.moduleRow} ${index % 2 !== 0 ? styles.rowReverse : ''}`}>
              <motion.div
                className={styles.moduleText}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
              >
                <div className={styles.moduleBadge}>Module {String(index + 1).padStart(2, '0')}</div>
                <h2 className={styles.moduleTitle}>{mod.title}</h2>
                <p className={styles.moduleDesc}>{mod.desc}</p>
                <ul className={styles.featureList}>
                  {mod.features.map((f, i) => (
                    <li key={i}>
                      <CheckCircle2 size={16} className={styles.checkIcon} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={mod.href} className={styles.learnMore}>
                  Learn more <ArrowRight size={14} />
                </Link>
              </motion.div>

              <motion.div
                className={styles.moduleImageContainer}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className={styles.placeholderImage}>
                  <span>Screenshot: {mod.title}</span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
