import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getMdxContent, getAllDocSlugs } from '@/lib/mdx';
import { MDXComponents } from '@/components/MDXComponents';
import styles from './DocsPage.module.css';
import { Metadata } from 'next';

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
  
  if (!mdx) {
    return { title: 'Not Found' };
  }
  
  return {
    title: `${mdx.frontmatter.title} | CalibrateDS`,
    description: mdx.frontmatter.description,
  };
}

export default async function DocPage({ params }: Props) {
  const resolvedParams = await params;
  const mdx = await getMdxContent(resolvedParams.slug);

  if (!mdx) {
    notFound();
  }

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
