import { StatsSection } from '@/types/sanity';

export function Stats({ eyebrow, heading, items }: StatsSection) {
  return (
    <section className="bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">{eyebrow}</p>}
          {heading && <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{heading}</h2>}
        </div>
        <dl className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item._key} className="rounded-2xl bg-gray-800/60 p-8 shadow-sm">
              <dt className="text-sm font-medium text-gray-400">{item.stat}</dt>
              <dd className="mt-3 text-4xl font-semibold tracking-tight text-white">{item.value}</dd>
              {item.description && <p className="mt-4 text-sm text-gray-400">{item.description}</p>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
