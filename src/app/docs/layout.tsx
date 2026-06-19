import { Sidebar } from '@/components/Sidebar';
import styles from './DocsLayout.module.css';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`container ${styles.layout}`}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        {children}
      </div>
    </div>
  );
}
