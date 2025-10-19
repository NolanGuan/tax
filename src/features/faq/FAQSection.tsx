'use client';

import { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  items: FAQItem[];
}

export function FAQSection({ title = 'Frequently asked questions', items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items.length) {
    return null;
  }

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <div className="mt-4 divide-y divide-gray-200">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className="py-4">
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-gray-800">{item.question}</span>
                <span className="text-xl text-gray-400">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? (
                <p className="mt-3 text-sm text-gray-600">{item.answer}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
