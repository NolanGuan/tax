import Link from 'next/link';
import type { CtaBannerConfig } from './types';

export function CtaBanner({ title, description, primaryCta, secondaryCta, background = 'light' }: CtaBannerConfig) {
  const isDark = background === 'dark';

  return (
    <section className={isDark ? 'bg-blue-900 text-white' : 'bg-white'}>
      <div className="mx-auto max-w-4xl px-4 py-14 text-center">
        <h2 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
        {description ? (
          <p className={`mt-3 text-base ${isDark ? 'text-blue-100' : 'text-gray-600'}`}>{description}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={primaryCta.href}
            className={`inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
              isDark ? 'bg-white text-blue-900 hover:bg-blue-100'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            target={primaryCta.external ? '_blank' : undefined}
            rel={primaryCta.external ? 'noreferrer' : undefined}
          >
            {primaryCta.label}
          </Link>
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className={`inline-flex items-center rounded-full border px-6 py-3 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-blue-200 text-blue-50 hover:border-white hover:text-white'
                  : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
              }`}
              target={secondaryCta.external ? '_blank' : undefined}
              rel={secondaryCta.external ? 'noreferrer' : undefined}
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
