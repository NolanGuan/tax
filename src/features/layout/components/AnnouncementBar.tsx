import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function AnnouncementBar() {
  const announcement = siteConfig.announcement;

  if (!announcement) {
    return null;
  }

  return (
    <div className="bg-blue-50 text-sm text-blue-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <span>{announcement.message}</span>
        {announcement.href && announcement.label ? (
          <Link
            href={announcement.href}
            className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {announcement.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
