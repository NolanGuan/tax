import Link from 'next/link';
import Image from 'next/image';
import type { HeroSectionConfig } from './types';

interface HeroSectionProps extends HeroSectionConfig {}

export function HeroSection({
  eyebrow,
  title,
  subtitle,
  alignment = 'center',
  supportText,
  primaryCta,
  secondaryCta,
  image,
  badges
}: HeroSectionProps) {
  const isCentered = alignment === 'center';

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-5 md:items-center">
      <div className={isCentered ? 'md:col-span-5 text-center space-y-6' : 'md:col-span-3 space-y-6'}>
        {eyebrow ? (
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            {eyebrow}
          </span>
        ) : null}

        <h1 className={`text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl ${isCentered ? 'mx-auto max-w-3xl' : ''}`}>
          {title}
        </h1>

        {subtitle ? (
          <p className={`text-lg text-gray-600 sm:text-xl ${isCentered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
            {subtitle}
          </p>
        ) : null}

        {supportText ? (
          <p className={`text-sm text-gray-500 ${isCentered ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>
            {supportText}
          </p>
        ) : null}

        {badges?.length ? (
          <div className={`flex flex-wrap gap-2 text-xs font-medium text-blue-600 ${isCentered ? 'justify-center' : ''}`}>
            {badges.map((badge) => (
              <span key={badge} className="rounded-full bg-blue-50 px-3 py-1">
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        {(primaryCta || secondaryCta) ? (
          <div className={`flex flex-wrap gap-3 ${isCentered ? 'justify-center' : ''}`}>
            {primaryCta ? (
              <Link
                href={primaryCta.href}
                className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                target={primaryCta.external ? '_blank' : undefined}
                rel={primaryCta.external ? 'noreferrer' : undefined}
              >
                {primaryCta.label}
              </Link>
            ) : null}
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600"
                target={secondaryCta.external ? '_blank' : undefined}
                rel={secondaryCta.external ? 'noreferrer' : undefined}
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      {image ? (
        <div className="md:col-span-2">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <Image
              src={image.src}
              alt={image.alt}
              width={640}
              height={400}
              className="h-full w-full object-cover"
              priority={false}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
