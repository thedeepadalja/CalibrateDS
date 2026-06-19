'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import styles from './page.module.css';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Try again.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Network error. Check your connection and try again.');
      setStatus('error');
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
          Get early access to team-scoped MCP tools, multi-repo governance, custom CI/CD pipelines, and dedicated onboarding.
        </p>

        {status === 'success' ? (
          <motion.div
            className={styles.successMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>You&apos;re on the list.</h3>
            <p>Check your inbox — a confirmation is on its way. We&apos;ll be in touch soon.</p>
          </motion.div>
        ) : (
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
                disabled={status === 'loading'}
              />
            </div>

            {status === 'error' && (
              <p className={styles.errorMsg}>{errorMsg}</p>
            )}

            <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
              {status === 'loading' ? (
                <><Loader2 size={16} className={styles.spinner} /> Sending…</>
              ) : (
                <>Join Waitlist <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
