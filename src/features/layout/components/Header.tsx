import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <nav className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 pb-4 text-sm font-medium text-gray-600 md:hidden">
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="transition-colors hover:text-gray-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
