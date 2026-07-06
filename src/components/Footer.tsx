'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export function Footer() {
  const pathname = usePathname();

  // On docs pages: render only the slim bottom bar (privacy link + copyright)
  if (pathname?.startsWith('/docs')) {
    return (
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomInner}`}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Deep Adalja. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <Image src="/CalibrateDSLogoSingle.svg" alt="CalibrateDS" width={20} height={20} />
            <span className={styles.logoText}>CalibrateDS</span>
          </Link>
          <p className={styles.description}>
            The design drift solution. Your design file is source code.
          </p>
        </div>
        
        <div className={styles.linksContainer}>
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Product</h4>
            <Link href="/docs/getting-started/quickstart" className={styles.link}>CLI Overview</Link>
            <Link href="/plugin" className={styles.link}>Figma Plugin</Link>
            <Link href="/waitlist" className={styles.link}>Enterprise</Link>
          </div>
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Resources</h4>
            <Link href="/docs" className={styles.link}>Documentation</Link>
          </div>
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Connect</h4>
            <a href="mailto:deep@deepadalja.com" className={styles.link}>Email</a>
            <a href="https://deepadalja.com/" target="_blank" rel="noreferrer" className={styles.link}>Portfolio</a>
            <a href="https://www.linkedin.com/in/deepadalja/" target="_blank" rel="noreferrer" className={styles.link}>LinkedIn</a>
            <a href="https://github.com/thedeepadalja" target="_blank" rel="noreferrer" className={styles.link}>GitHub</a>
          </div>
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Social</h4>
            <a href="https://www.figma.com/@deepadalja" target="_blank" rel="noreferrer" className={styles.link}>Figma</a>
            <a href="https://www.youtube.com/@DeepAdalja" target="_blank" rel="noreferrer" className={styles.link}>YouTube</a>
            <a href="https://medium.com/@deepadalja" target="_blank" rel="noreferrer" className={styles.link}>Medium</a>
            <a href="https://www.npmjs.com/package/@calibrate-ds/cli" target="_blank" rel="noreferrer" className={styles.link}>npm</a>
            <a href="https://www.instagram.com/thedeepadalja/" target="_blank" rel="noreferrer" className={styles.link}>Instagram</a>
          </div>
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Legal</h4>
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomInner}`}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Deep Adalja. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
