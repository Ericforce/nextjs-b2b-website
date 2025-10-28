import { CTASection } from '@/types/sanity';

export function CallToAction({ heading, subheading, cta, secondaryCta }: CTASection) {
  return (
    <section className="bg-blue-600 py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{heading}</h2>
        {subheading && <p className="mt-4 text-lg text-blue-100">{subheading}</p>}
        {(cta || secondaryCta) && (
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            {cta && (
              <a
                href={cta.href}
                className="rounded-full bg-white px-8 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
              >
                {cta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="rounded-full px-8 py-3 text-base font-semibold text-white ring-1 ring-inset ring-white/60 hover:ring-white"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
