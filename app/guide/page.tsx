import type { Metadata } from 'next';
import Link from 'next/link';
import { buildPageMetadata } from '@/config/seo';
import { SEOHead } from '@/features/seo';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';

export const metadata: Metadata = buildPageMetadata('blog', {
  title: 'Capital gains tax guides',
  description:
    'Browse capital gains tax playbooks covering real estate, crypto, loss harvesting, and state-specific planning.',
  path: '/guide'
});

const guides = [
  {
    title: 'Capital gains tax basics',
    excerpt: 'Understand how capital gains are calculated, when long-term rates kick in, and what events trigger taxes.',
    href: '/guide/capital-gains-tax-basics'
  },
  {
    title: 'Real estate capital gains planning',
    excerpt: 'Learn how the primary residence exclusion works, how to adjust basis with improvements, and when depreciation recapture applies.',
    href: '/guide/real-estate-capital-gains'
  },
  {
    title: 'Crypto tax essentials',
    excerpt: 'Get clear on how the IRS treats swaps, staking rewards, airdrops, and taxable disposals across wallets.',
    href: '/guide/crypto-tax'
  },
  {
    title: 'Tax planning scenarios',
    excerpt: 'Explore strategies for timing sales, loss harvesting, and relocating to optimize your capital gains tax burden.',
    href: '/guide/tax-planning-scenarios'
  }
];

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-16">
      <SEOHead
        pageKey="blog"
        title="Capital gains tax guides"
        description="Deepen your understanding of capital gains tax strategies with guides written by financial planning professionals."
        canonical="/guide"
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guide' }
        ]}
      />

      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Capital gains tax guides</h1>
        <p className="text-gray-600">
          Expand your strategy with source-linked resources that connect directly to the calculators you need for each decision.
        </p>
      </header>

      <div className="space-y-6">
        {guides.map((guide) => (
          <article
            key={guide.href}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-2xl font-semibold text-gray-900">{guide.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{guide.excerpt}</p>
            <Link
              href={guide.href}
              className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Open guide
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
