'use client';

import { useState } from 'react';
import { FAQSection } from '@/types/sanity';

export function FAQ({ eyebrow, heading, faqs }: FAQSection) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>}
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{heading}</h2>
        </div>
        <dl className="mt-12 space-y-6">
          {faqs.map((faq, index) => (
            <div key={faq._key} className="rounded-lg border border-gray-200 bg-white">
              <dt>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-start justify-between px-6 py-5 text-left"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <span className="ml-6 flex h-7 items-center">
                    <svg
                      className={`h-6 w-6 transform transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </button>
              </dt>
              {openIndex === index && (
                <dd className="px-6 pb-6">
                  <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
