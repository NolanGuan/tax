import Link from 'next/link';
import { StructuredData } from '@/features/seo';
import { siteConfig } from '@/config/site';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items.length) {
    return null;
  }

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://${siteConfig.domain}${item.href}` : undefined
    }))
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <StructuredData data={breadcrumbData} id="breadcrumb-schema" />
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-gray-700">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-gray-700 font-semibold' : undefined}>{item.label}</span>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
