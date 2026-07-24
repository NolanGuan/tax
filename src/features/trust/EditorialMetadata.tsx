import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { SourceList } from '@/features/sources/SourceList';

interface EditorialMetadataProps {
  author: string;
  reviewer?: string;
  sources: string[];
}

export function EditorialMetadata({
  author,
  reviewer,
  sources
}: EditorialMetadataProps) {
  const isEditorialTeam = author === 'Gain Tax Calculator Editorial Team';

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
      <dl className="grid gap-2 md:grid-cols-2">
        <div>
          <dt className="font-semibold text-gray-900">Author</dt>
          <dd>
            {isEditorialTeam ? (
              <Link href={siteConfig.editorialUrl} className="text-blue-600 hover:underline">
                {author}
              </Link>
            ) : (
              author
            )}
          </dd>
        </div>
        {reviewer ? (
          <div>
            <dt className="font-semibold text-gray-900">Reviewer</dt>
            <dd>{reviewer}</dd>
          </div>
        ) : null}
        <div className="md:col-span-2">
          <dt className="font-semibold text-gray-900">Sources</dt>
          <dd>
            <SourceList sources={sources} />
          </dd>
        </div>
      </dl>
    </section>
  );
}
