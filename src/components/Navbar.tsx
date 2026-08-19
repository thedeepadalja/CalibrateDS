'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import styles from './Navbar.module.css';
import navigation from '../../content/navigation.json';
import { SearchModal } from './SearchModal';

const TOOLS = [
  { name: 'PTB',    href: '/ptb',    prefix: '/ptb' },
  { name: 'DNA',    href: '/dna',    prefix: '/dna' },
  { name: 'Plugin', href: '/plugin', prefix: '/plugin' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`${styles.header} glass`}>
        <div className={`container flex items-center justify-between ${styles.navInner}`}>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Image src="/CalibrateDSLogoSingle.svg" alt="CalibrateDS" width={18} height={18} />
            </div>
            <span className={styles.logoText}>CalibrateDS</span>
          </Link>

          {/* Tool pills — center */}
          <nav className={styles.toolPills}>
            {TOOLS.map((t) => {
              const isActive = pathname === t.href || pathname?.startsWith(t.prefix + '/');
              return (
                <Link
                  key={t.name}
                  href={t.href}
                  className={`${styles.toolPill} ${isActive ? styles.toolPillActive : ''}`}
                >
                  {t.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: search + docs + mobile */}
          <div className={styles.actions}>
            <div className={styles.docsMenu}>
              <button className={styles.docsTrigger} aria-haspopup="true">
                Docs <ChevronDown size={13} />
              </button>
              <div className={styles.docsDropdown}>
                <div className={styles.docsPanel}>
                  <Link href="/docs/getting-started/quickstart" className={styles.docsItem}>
                    <span className={styles.docsItemName}>PTB docs</span>
                    <span className={styles.docsItemDesc}>Figma → typed code</span>
                  </Link>
                  <Link href="/docs/dna/getting-started/install" className={styles.docsItem}>
                    <span className={styles.docsItemName}>DNA docs</span>
                    <span className={styles.docsItemDesc}>Conformance &amp; identity</span>
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/waitlist" className={styles.link}>Enterprise</Link>
            <button className={styles.searchTrigger} onClick={() => setIsSearchOpen(true)}>
              <Search size={14} />
              <span className={styles.searchText}>Search...</span>
              <kbd className={styles.searchKbd}>⌘K</kbd>
            </button>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} color="var(--text-primary)" />
            </button>
          </div>

        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenuHeader}>
            <Link href="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={styles.logoIcon}>
                <Image src="/CalibrateDSLogoSingle.svg" alt="CalibrateDS" width={18} height={18} />
              </div>
              <span className={styles.logoText}>CalibrateDS</span>
            </Link>
            <button
              className={styles.closeMenuBtn}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} color="var(--text-primary)" />
            </button>
          </div>

          <div className={styles.mobileMenuContent}>
            <div className={styles.mobilePrimaryLinks}>
              {TOOLS.map((t) => (
                <Link
                  key={t.name}
                  href={t.href}
                  className={styles.mobilePrimaryLink}
                >
                  {t.name}
                </Link>
              ))}
              <Link href="/docs/getting-started/quickstart" className={styles.mobilePrimaryLink}>PTB Docs</Link>
              <Link href="/docs/dna/getting-started/install" className={styles.mobilePrimaryLink}>DNA Docs</Link>
              <Link href="/waitlist" className={styles.mobilePrimaryLink}>Enterprise</Link>
            </div>

            <hr className={styles.mobileDivider} />

            <div className={styles.mobileDocsNav}>
              {navigation.map((section) => (
                <div key={section.title} className={styles.mobileSection}>
                  <h5 className={styles.mobileSectionTitle}>{section.title}</h5>
                  <ul className={styles.mobileLinkList}>
                    {section.links.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={`${styles.mobileLink} ${isActive ? styles.mobileActive : ''}`}
                          >
                            {link.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
