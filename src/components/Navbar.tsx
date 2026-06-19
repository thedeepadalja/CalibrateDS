'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Terminal, Menu, X, Search } from 'lucide-react';
import styles from './Navbar.module.css';
import navigation from '../../content/navigation.json';
import { SearchModal } from './SearchModal';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Global Cmd+K Listener
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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`${styles.header} glass`}>
        <div className={`container flex items-center justify-between ${styles.navInner}`}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Image src="/CalibrateDSLogoSingle.svg" alt="CalibrateDS" width={18} height={18} />
            </div>
            <span className={styles.logoText}>CalibrateDS</span>
          </Link>
          
          <nav className={styles.navLinks}>
            <Link href="/docs/getting-started/quickstart" className={styles.link}>Docs</Link>
            <Link href="/plugin" className={styles.link}>Plugin</Link>
            <Link href="/waitlist" className={styles.link}>Waitlist</Link>
          </nav>

          <div className={styles.actions}>
            <button className={styles.searchTrigger} onClick={() => setIsSearchOpen(true)}>
              <Search size={14} className={styles.searchIcon} />
              <span className={styles.searchText}>Search docs...</span>
              <kbd className={styles.searchKbd}>⌘K</kbd>
            </button>
            <Link href="/docs/getting-started/install" className={styles.ctaButton}>
              <Terminal size={16} />
              <span className={styles.ctaText}>Install CLI</span>
            </Link>
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

      {/* Mobile Menu Overlay */}
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
            {/* Primary Links */}
            <div className={styles.mobilePrimaryLinks}>
              <Link href="/docs/getting-started/quickstart" className={styles.mobilePrimaryLink}>Docs</Link>
              <Link href="/plugin" className={styles.mobilePrimaryLink}>Plugin</Link>
              <Link href="/waitlist" className={styles.mobilePrimaryLink}>Waitlist</Link>
            </div>

            <hr className={styles.mobileDivider} />

            {/* Documentation Links */}
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
