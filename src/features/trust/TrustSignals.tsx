export function TrustSignals() {
  const items = [
    {
      title: 'Transparent estimates',
      description: 'The supported tax year, assumptions, and important calculation limits are stated next to each result.',
      icon: '🧮'
    },
    {
      title: 'Source-linked data',
      description: 'Federal tables link to the IRS, and selected state assumptions identify their public sources.',
      icon: '📚'
    },
    {
      title: 'Secure inputs',
      description: 'Calculator inputs stay in your browser and are not sent to our analytics tools.',
      icon: '🔒'
    }
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
