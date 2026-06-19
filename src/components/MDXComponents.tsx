import React, { ComponentPropsWithoutRef } from 'react';
import styles from './MDXComponents.module.css';

export const MDXComponents = {
  h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => {
    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return <h1 id={id} className={styles.h1} {...props}>{children}</h1>;
  },
  h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => {
    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return <h2 id={id} className={styles.h2} {...props}>{children}</h2>;
  },
  h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => {
    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return <h3 id={id} className={styles.h3} {...props}>{children}</h3>;
  },
  p: (props: ComponentPropsWithoutRef<'p'>) => <p className={styles.p} {...props} />,
  a: ({ href, ...props }: ComponentPropsWithoutRef<'a'>) => {
    const isExternal = href?.startsWith('http');
    return (
      <a 
        href={href}
        className={styles.a} 
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props} 
      />
    );
  },
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className={styles.ul} {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol className={styles.ol} {...props} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => <li className={styles.li} {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => <blockquote className={styles.blockquote} {...props} />,
  code: (props: ComponentPropsWithoutRef<'code'>) => <code className={styles.code} {...props} />,
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <div className={styles.preContainer}>
      <pre className={styles.pre} {...props} />
    </div>
  ),
  hr: (props: ComponentPropsWithoutRef<'hr'>) => <hr className={styles.hr} {...props} />,
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className={styles.tableWrapper}>
      <table className={styles.table} {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => <th className={styles.th} {...props} />,
  td: (props: ComponentPropsWithoutRef<'td'>) => <td className={styles.td} {...props} />,
  tr: (props: ComponentPropsWithoutRef<'tr'>) => <tr className={styles.tr} {...props} />,
};
