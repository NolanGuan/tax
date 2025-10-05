import type { FeatureGridConfig } from './types';

export function FeatureGridSection({ title, description, items, columns = 3 }: FeatureGridConfig) {
  const columnClass = columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-900">{title}</h2>
          {description ? <p className="mx-auto max-w-2xl text-gray-600">{description}</p> : null}
        </div>

        <div className={`mt-10 grid gap-6 ${columnClass}`}>
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              {item.icon ? (
                <div className="mb-4 text-3xl" aria-hidden="true">
                  {item.icon}
                </div>
              ) : null}
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
