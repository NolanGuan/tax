import type { Metadata } from 'next';
import Link from 'next/link';
import { buildPageMetadata } from '@/config/seo';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/features/layout/components/Breadcrumbs';

export const metadata: Metadata = buildPageMetadata('contact');

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />

      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Contact Gain Tax Calculator</h1>
        <p className="text-lg text-gray-600">
          Send corrections, accessibility requests, privacy questions, or general feedback to{' '}
          <a className="font-medium text-blue-600 hover:text-blue-700" href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Before sending tax details</h2>
        <p className="mt-3 text-gray-600">
          Please do not email Social Security numbers, account numbers, tax returns, wallet addresses, or other
          sensitive financial information. We cannot provide individualized tax, legal, or investment advice.
        </p>
      </section>

      <p className="text-sm text-gray-600">
        For information about optional analytics and browser-stored preferences, read our{' '}
        <Link className="text-blue-600 hover:text-blue-700" href="/privacy">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
