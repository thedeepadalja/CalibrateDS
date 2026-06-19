'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, CornerDownLeft } from 'lucide-react';
import styles from './SearchModal.module.css';
import navigation from '../../content/navigation.json';

interface SearchItem {
  title: string;
  href: string;
  section: string;
}

// Flatten the navigation tree into a search index
const searchIndex: SearchItem[] = navigation.flatMap(section => 
  section.links.map(link => ({
    title: link.title,
    href: link.href,
    section: section.title
  }))
);

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Filter results
  const results = searchIndex.filter(item => {
    const searchStr = `${item.title} ${item.section}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  // Group results by section
  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  // Flatten back for keyboard navigation
  const flatResults = Object.values(groupedResults).flat();

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < flatResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
        e.preventDefault();
        router.push(flatResults[selectedIndex].href);
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatResults, selectedIndex, router, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && isOpen) {
      const selectedEl = resultsRef.current.querySelector(`.${styles.selected}`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.searchHeader}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button className={styles.closeBtn} onClick={onClose}>ESC</button>
        </div>

        <div className={styles.results} ref={resultsRef}>
          {flatResults.length === 0 ? (
            <div className={styles.noResults}>
              No results found for "{query}"
            </div>
          ) : (
            Object.entries(groupedResults).map(([section, items]) => (
              <div key={section} className={styles.resultGroup}>
                <div className={styles.groupTitle}>{section}</div>
                {items.map((item) => {
                  const globalIndex = flatResults.findIndex(r => r.href === item.href);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <div
                      key={item.href}
                      className={`${styles.resultItem} ${isSelected ? styles.selected : ''}`}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      onClick={() => {
                        router.push(item.href);
                        onClose();
                      }}
                    >
                      <FileText size={16} className={styles.resultIcon} />
                      <span>{item.title}</span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <span><span className={styles.footerKey}>↑</span><span className={styles.footerKey}>↓</span> to navigate</span>
          <span><span className={styles.footerKey}><CornerDownLeft size={12}/></span> to select</span>
          <span><span className={styles.footerKey}>ESC</span> to close</span>
        </div>
      </div>
    </div>
  );
}
