'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import navigation from '../../content/navigation.json';
import { BacklinkCallout } from './BacklinkCallout';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navigation.map((section) => (
          <div key={section.title} className={styles.section}>
            <h5 className={styles.sectionTitle}>{section.title}</h5>
            <ul className={styles.linkList}>
              {section.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${styles.link} ${isActive ? styles.active : ''}`}
                    >
                      {link.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <BacklinkCallout />
    </aside>
  );
}
