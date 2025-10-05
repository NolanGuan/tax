import type { Metadata } from 'next';
import { buildPageMetadata } from '@/config/seo';
import { termsContent } from '@/content/terms-content';
import { siteConfig } from '@/config/site';
import { SEOHead, StructuredData } from '@/features/seo';

export const metadata: Metadata = buildPageMetadata('terms-of-service');

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-16">
      <SEOHead pageKey="terms-of-service" />
      <StructuredData pageKey="terms-of-service" id="terms-structured-data" />
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-bold text-gray-900">{termsContent.title}</h1>
        <p className="text-sm text-gray-500">{termsContent.lastUpdated}</p>
      </header>

      <div className="space-y-8">
        {termsContent.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-gray-700">{paragraph}</p>
            ))}
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">{termsContent.contact.heading}</h2>
        <p className="mt-3 text-gray-700">{termsContent.contact.description}</p>
        <p className="mt-3 text-sm text-gray-500">
          Email us at{' '}
          <a className="text-blue-600 underline" href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
        </p>
      </section>
    </div>
  );
}
