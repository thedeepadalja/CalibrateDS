import styles from './BacklinkCallout.module.css';

/**
 * Persistent, subtle pointer back to the personal-site resource library.
 * This repo owns no email capture or marketing surface of its own —
 * docs/04-functional-spec-wiki.md in the deepadalja.com repo.
 *
 * `belowSidebarBreakpoint` renders it only under the 1024px width where
 * Sidebar.tsx hides itself — used as the docs-page fallback so desktop
 * doesn't show the callout twice (once in the sidebar, once in the footer).
 */
export function BacklinkCallout({
  belowSidebarBreakpoint = false,
}: {
  belowSidebarBreakpoint?: boolean;
}) {
  return (
    <div className={`${styles.callout} ${belowSidebarBreakpoint ? styles.belowSidebarBreakpoint : ''}`}>
      <p className={styles.built}>Built by Deep Adalja</p>
      <a
        href="https://deepadalja.com/resources"
        target="_blank"
        rel="noreferrer"
        className={styles.link}
      >
        Free design system resources →
      </a>
    </div>
  );
}
