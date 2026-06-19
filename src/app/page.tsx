'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, RefreshCw, PenTool, Code2 } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  const [terminalText, setTerminalText] = useState('');
  const fullText = '> ptb init\n> ptb scan\n[+] Found 4 modified components\n> ptb generate-components\n[+] Button updated\n[+] Input generated\n\n✨ Design drift resolved.';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTerminalText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {/* Background with abstract graphic */}
      <div className={styles.heroBackground}>
        <div className={styles.overlay} />
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroContent}
        >
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            CalibrateDS CLI v1.0
          </div>
          
          <h1 className={styles.title}>
            Your design file is <br/>
            <span className="gradient-text">source code.</span>
          </h1>
          
          <p className={styles.subtitle}>
            Stop design drift. The only CLI tool that natively binds your Figma tokens and components directly to your React codebase.
          </p>

          <div className={styles.ctaGroup}>
            <div className={styles.codeSnippet}>
              <Terminal size={16} color="var(--brand)" />
              <code>npm install -g @calibrate-ds/cli</code>
            </div>
            <Link href="/docs/getting-started/quickstart" className={styles.primaryBtn}>
              Read the Docs <ArrowRight size={16} />
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
            <div className={styles.terminalTitle}>bash - ptb</div>
          </div>
          <div className={styles.terminalBody}>
            <pre><code>{terminalText}<span className={styles.cursor}></span></code></pre>
          </div>
        </motion.div>
      </section>

      {/* Value Proposition */}
      <section className={styles.valueProp}>
        <div className={`container ${styles.valuePropContainer}`}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.featureCard}
          >
            <div className={styles.featureIcon}><PenTool color="#F24E1E" size={32}/></div>
            <h3 className={styles.featureTitle}>The Design Drift Problem</h3>
            <p className={styles.featureDesc}>
              Designers update Figma. Developers miss the slack message. Hex codes diverge. Component APIs fracture. Trust breaks down.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.featureCard}
          >
            <div className={styles.featureIcon}><RefreshCw color="var(--brand)" size={32}/></div>
            <h3 className={styles.featureTitle}>The CalibrateDS Solution</h3>
            <p className={styles.featureDesc}>
              A single source of truth. The PTB CLI normalizes Figma data into an engineering-ready context, generating code automatically.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.featureCard}
          >
            <div className={styles.featureIcon}><Code2 color="#3178C6" size={32}/></div>
            <h3 className={styles.featureTitle}>Engineering First</h3>
            <p className={styles.featureDesc}>
              No vendor lock-in. Outputs pure React/Next.js components and Vanilla CSS or CSS Modules. You own the code.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
