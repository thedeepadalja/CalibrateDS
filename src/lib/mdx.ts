import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface MdxData {
  content: string;
  frontmatter: {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };
  toc: TocItem[];
}

export async function getMdxContent(slugPath: string[]): Promise<MdxData | null> {
  try {
    const slug = slugPath.join('/');
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Extract headings for TOC
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const toc: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc.push({ level, text, id });
    }

    return {
      content,
      frontmatter,
      toc
    };
  } catch (e) {
    console.error('Error reading MDX:', e);
    return null;
  }
}

export function getAllDocSlugs(dir = CONTENT_DIR, base = ''): string[][] {
  if (!fs.existsSync(dir)) return [];
  
  let slugs: string[][] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      slugs = slugs.concat(getAllDocSlugs(filePath, `${base}${file}/`));
    } else if (file.endsWith('.mdx')) {
      const slug = `${base}${file.replace('.mdx', '')}`;
      slugs.push(slug.split('/'));
    }
  }

  return slugs;
}
