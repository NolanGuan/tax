import type { Metadata } from 'next';
import { FiBookOpen, FiMail } from 'react-icons/fi';
import { buildPageMetadata } from '@/config/seo';
import { getAboutContent } from '@/content/about-content';
import { siteConfig } from '@/config/site';
import { SEOHead, StructuredData } from '@/features/seo';

export const metadata: Metadata = buildPageMetadata('about');

export default function AboutPage() {
  const content = getAboutContent();

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-16">
      <SEOHead pageKey="about" />
      <StructuredData pageKey="about" id="about-structured-data" />
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">{content.title}</h1>
        <p className="text-sm text-gray-500">{content.lastUpdated}</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">{content.intro.heading}</h2>
        {content.intro.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-gray-700">{paragraph}</p>
        ))}
      </section>

      <section id="editorial-method" className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900">{content.mission.heading}</h2>
        <div className="mt-4 space-y-4 text-gray-700">
          {content.mission.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">{content.features.title}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {content.features.items.map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-inner">
        <h2 className="text-2xl font-semibold text-gray-900">{content.contact.title}</h2>
        <p className="mt-4 max-w-2xl text-gray-700">{content.contact.description}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            href={content.contact.github.href}
            className="flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300"
          >
            <FiBookOpen className="h-5 w-5" />
            {content.contact.github.label}
          </a>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="flex items-center justify-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-900 transition-colors hover:border-blue-300"
          >
            <FiMail className="h-5 w-5" />
            {content.contact.emailLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
