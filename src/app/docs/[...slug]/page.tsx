import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getMdxContent, getAllDocSlugs } from '@/lib/mdx';
import { MDXComponents } from '@/components/MDXComponents';
import styles from './DocsPage.module.css';
import { Metadata } from 'next';
import navigation from '../../../../content/navigation.json';

interface NavLink { title: string; href: string; }

// Flatten navigation sections into a single ordered list of links
function getAllLinks(): NavLink[] {
  return (navigation as { title: string; links: NavLink[] }[]).flatMap((s) => s.links);
}

function getAdjacentPages(currentHref: string): { prev: NavLink | null; next: NavLink | null } {
  const links = getAllLinks();
  const idx = links.findIndex((l) => l.href === currentHref);
  return {
    prev: idx > 0 ? links[idx - 1] : null,
    next: idx >= 0 && idx < links.length - 1 ? links[idx + 1] : null,
  };
}

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const mdx = await getMdxContent(resolvedParams.slug);
  if (!mdx) return { title: 'Not Found' };
  return {
    title: `${mdx.frontmatter.title} | CalibrateDS`,
    description: mdx.frontmatter.description,
  };
}

export default async function DocPage({ params }: Props) {
  const resolvedParams = await params;
  const mdx = await getMdxContent(resolvedParams.slug);

  if (!mdx) notFound();

  const currentHref = `/docs/${resolvedParams.slug.join('/')}`;
  const { prev, next } = getAdjacentPages(currentHref);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.prose}>
          <MDXRemote
            source={mdx.content}
            components={MDXComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        {/* Prev / Next navigation */}
        <nav className={styles.pageNav}>
          <div className={styles.pageNavPrev}>
            {prev && (
              <Link href={prev.href} className={styles.pageNavBtn}>
                <span className={styles.pageNavDir}>← Previous</span>
                <span className={styles.pageNavTitle}>{prev.title}</span>
              </Link>
            )}
          </div>
          <div className={styles.pageNavNext}>
            {next && (
              <Link href={next.href} className={styles.pageNavBtn}>
                <span className={styles.pageNavDir}>Next →</span>
                <span className={styles.pageNavTitle}>{next.title}</span>
              </Link>
            )}
          </div>
        </nav>
      </div>

      {mdx.toc && mdx.toc.length > 0 && (
        <aside className={styles.toc}>
          <h4 className={styles.tocTitle}>On this page</h4>
          <ul className={styles.tocList}>
            {mdx.toc.map((item, index) => (
              <li
                key={index}
                className={styles.tocItem}
                style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
              >
                <a href={`#${item.id}`} className={styles.tocLink}>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
