import Image from 'next/image';
import { HeroSection } from '@/types/sanity';

export function Hero({ heading, subheading, cta, secondaryCta, image }: HeroSection) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              {heading}
            </h1>
            {subheading && (
              <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
                {subheading}
              </p>
            )}
            {(cta || secondaryCta) && (
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {cta && (
                  <a
                    href={cta.href}
                    className="rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                  >
                    {cta.label}
                  </a>
                )}
                {secondaryCta && (
                  <a
                    href={secondaryCta.href}
                    className="rounded-full bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    {secondaryCta.label}
                  </a>
                )}
              </div>
            )}
          </div>
          {image && (
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px]">
              <Image
                src={image.asset.url}
                alt={image.alt || ''}
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="rounded-2xl object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
