import Image from 'next/image';
import { TestimonialsSection } from '@/types/sanity';

export function Testimonials({ eyebrow, heading, testimonials }: TestimonialsSection) {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>}
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{heading}</h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial._key} className="rounded-2xl bg-white p-8 shadow-sm">
              <p className="text-base leading-7 text-gray-700 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-4">
                {testimonial.avatar && (
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={testimonial.avatar.asset.url}
                      alt={testimonial.avatar.alt || testimonial.name}
                      fill
                      sizes="48px"
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  {testimonial.title && <p className="text-sm text-gray-600">{testimonial.title}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
