import type { Metadata } from 'next';
import { FiShield } from 'react-icons/fi';
import { buildPageMetadata } from '@/config/seo';
import { privacyContent } from '@/content/privacy-content';
import { siteConfig } from '@/config/site';
import { SEOHead, StructuredData } from '@/features/seo';

export const metadata: Metadata = buildPageMetadata('privacy-policy');

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-16">
      <SEOHead pageKey="privacy-policy" />
      <StructuredData pageKey="privacy-policy" id="privacy-structured-data" />
      <header className="space-y-3 text-center">
        <FiShield className="mx-auto h-10 w-10 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">{privacyContent.title}</h1>
        <p className="text-sm text-gray-500">{privacyContent.lastUpdated}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">{privacyContent.intro.heading}</h2>
        {privacyContent.intro.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-gray-700">{paragraph}</p>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">{privacyContent.dataWeDoNotCollect.heading}</h2>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          {privacyContent.dataWeDoNotCollect.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">{privacyContent.minimalData.heading}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {privacyContent.minimalData.items.map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-900">
        <h2 className="text-xl font-semibold">{privacyContent.contact.heading}</h2>
        <p className="mt-3">{privacyContent.contact.description}</p>
        <p className="mt-3">
          Email: <a className="underline" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
        </p>
      </section>
    </div>
  );
}
