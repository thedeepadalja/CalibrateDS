'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, PenTool } from 'lucide-react';
import styles from './page.module.css';

export default function PluginPage() {
  const modules = [
    {
      id: 'accessibility',
      title: 'Accessibility Advisor',
      desc: 'Real-time accessibility checking inside Figma. Ensure contrast ratios, touch targets, and structure meet WCAG standards before handoff.',
    },
    {
      id: 'readiness',
      title: 'Component Readiness',
      desc: 'Automatically checks if components have all required variants, properties, and correct token bindings. Prevents incomplete designs from reaching engineers.',
    },
    {
      id: 'stress-test',
      title: 'Stress Test',
      desc: 'Simulate extreme content lengths, different languages, and edge cases to ensure your UI doesn\'t break under pressure.',
    },
    {
      id: 'exporter',
      title: 'Token Exporter',
      desc: 'Export tokens in multiple formats including Style Dictionary and Tailwind directly from the plugin. Keep your whole stack in sync.',
    }
  ];

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
          <h1 className={styles.title}>
            Quality Control for <br/>
            <span className="gradient-text">Design Engineers.</span>
          </h1>
          <p className={styles.subtitle}>
            The CalibrateDS Figma Plugin bridges the gap. Catch issues before handoff, export tokens, and ensure your components are code-ready.
          </p>
          <div className={styles.ctaWrapper}>
            <a href="https://figma.com/community" target="_blank" rel="noreferrer" className={styles.primaryBtn}>
              Get it on Figma Community <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </section>

      <section className={styles.modulesSection}>
        <div className="container">
          {modules.map((mod, index) => (
            <div key={mod.id} className={`${styles.moduleRow} ${index % 2 !== 0 ? styles.rowReverse : ''}`}>
              <motion.div 
                className={styles.moduleText}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className={styles.moduleBadge}>Module 0{index + 1}</div>
                <h2 className={styles.moduleTitle}>{mod.title}</h2>
                <p className={styles.moduleDesc}>{mod.desc}</p>
                <ul className={styles.featureList}>
                  <li><CheckCircle2 size={16} className={styles.checkIcon} /> Seamless integration</li>
                  <li><CheckCircle2 size={16} className={styles.checkIcon} /> Real-time feedback</li>
                  <li><CheckCircle2 size={16} className={styles.checkIcon} /> Engineering-focused</li>
                </ul>
              </motion.div>
              
              <motion.div 
                className={styles.moduleImageContainer}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
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
