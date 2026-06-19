'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.glow} />
        
        <h1 className={styles.title}>CalibrateDS Enterprise</h1>
        <p className={styles.description}>
          Get early access to our advanced MCP (Model Context Protocol) integration, team collaboration features, and custom CI/CD pipelines.
        </p>

        {!submitted ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} size={20} color="var(--text-secondary)" />
              <input 
                type="email" 
                placeholder="Enter your work email" 
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.submitBtn}>
              Join Waitlist <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <motion.div 
            className={styles.successMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>You&apos;re on the list!</h3>
            <p>We&apos;ll be in touch soon with your early access invite.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
