import { FeaturesSection } from '@/types/sanity';

export function Features({ eyebrow, heading, subheading, items, layout = 'grid' }: FeaturesSection) {
  const isGrid = layout === 'grid';

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>}
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg leading-7 text-gray-600">{subheading}</p>}
        </div>
        <div className={`mt-12 grid gap-8 ${isGrid ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-1'}`}>
          {items.map((item) => (
            <div key={item._key} className="relative rounded-2xl border border-gray-200 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              {item.icon && (
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span className="text-xl font-semibold">{item.icon}</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              {item.description && <p className="mt-3 text-base text-gray-600">{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
