import Link from 'next/link';
import type { LinkListConfig } from './types';

export function LinkListSection({ title, description, links, variant = 'pill' }: LinkListConfig) {
  const baseClass = variant === 'pill'
    ? 'inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600'
    : 'inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline';

  return (
    <section className="bg-gray-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          {description ? <p className="text-sm text-gray-600">{description}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={baseClass}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
