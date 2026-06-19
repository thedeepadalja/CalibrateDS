import { MetadataRoute } from 'next';

const BASE = 'https://calibrateds.deepadalja.com';

const DOC_SLUGS = [
  'architecture/ci-integration',
  'architecture/internals',
  'cli/admin',
  'cli/ai',
  'cli/overview',
  'cli/setup',
  'cli/state',
  'cli/team',
  'cli/tokens',
  'concepts/design-freshness',
  'concepts/design-system-model',
  'concepts/token-resolution',
  'config/ptb-config',
  'features/ai-implementation',
  'features/documentation',
  'features/generation',
  'features/health-checks',
  'features/team-collaboration',
  'features/verify',
  'getting-started/install',
  'getting-started/quickstart',
  'mcp/overview',
  'mcp/setup',
  'mcp/tools',
  'plugin/accessibility-advisor',
  'plugin/component-readiness',
  'plugin/overview',
  'plugin/state-diff',
  'plugin/stress-test',
  'plugin/token-exporter',
  'plugin/token-inspector',
  'workflows/direct-api',
  'workflows/plugin-export',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${BASE}/plugin`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE}/waitlist`, priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  const docPages = DOC_SLUGS.map((slug) => ({
    url: `${BASE}/docs/${slug}`,
    priority: 0.6,
    changeFrequency: 'weekly' as const,
  }));

  return [...staticPages, ...docPages];
}
