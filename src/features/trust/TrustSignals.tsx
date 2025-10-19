export function TrustSignals() {
  const items = [
    {
      title: 'CPA-reviewed logic',
      description: 'Calculation engines vetted by a network of credentialed tax professionals.',
      icon: '🧾'
    },
    {
      title: 'Source-linked data',
      description: 'Every tax rate references current IRS publications and state revenue notices.',
      icon: '📚'
    },
    {
      title: 'Secure inputs',
      description: 'Calculations run in-memory only—no investment data is ever stored or sold.',
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
