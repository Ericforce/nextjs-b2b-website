import Image from "next/image";

import { cn } from "@/lib/utils";
import type { TestimonialsSection as TestimonialsSectionType } from "@/types";

export function TestimonialsSection(section: TestimonialsSectionType) {
  const { anchor, headline, description, testimonials, layout } = section;

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const resolvedLayout = layout ?? "grid";

  const containerClasses = (() => {
    switch (resolvedLayout) {
      case "carousel":
        return "mt-12 flex gap-6 overflow-x-auto pb-4";
      case "single":
        return "mt-12 space-y-6";
      default:
        return "mt-12 grid grid-cols-1 gap-6 md:grid-cols-2";
    }
  })();

  const cardBaseClasses =
    "flex h-full min-h-[260px] flex-col gap-4 rounded-2xl border border-neutral-200 bg-white/95 p-6 shadow-soft";

  return (
    <section
      id={anchor || undefined}
      className="bg-neutral-50 py-16 sm:py-20 lg:py-24"
    >
      <div className="container-custom">
        <div className="mx-auto max-w-3xl text-center">
          {headline ? (
            <h2 className="text-3xl font-semibold text-secondary-900 sm:text-4xl">
              {headline}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-lg text-secondary-600">{description}</p>
          ) : null}
        </div>

        <div className={containerClasses}>
          {testimonials.map((testimonial, index) => {
            const key =
              testimonial._key ??
              `${testimonial.author ?? "testimonial"}-${index}`;
            const rating = Math.max(0, Math.min(5, testimonial.rating ?? 0));
            const CardTag =
              resolvedLayout === "single" ? "article" : "blockquote";

            return (
              <CardTag
                key={key}
                className={cn(
                  cardBaseClasses,
                  resolvedLayout === "carousel"
                    ? "min-w-[320px] max-w-sm shrink-0"
                    : resolvedLayout === "single"
                      ? "mx-auto max-w-3xl"
                      : ""
                )}
              >
                {rating > 0 ? (
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rating }).map((_, starIndex) => (
                      <span key={starIndex} aria-hidden="true">
                        ★
                      </span>
                    ))}
                    <span className="sr-only">Rated {rating} out of 5</span>
                  </div>
                ) : null}

                {testimonial.quote ? (
                  <p className="text-lg leading-7 text-secondary-700">
                    “{testimonial.quote}”
                  </p>
                ) : null}

                <div className="mt-auto flex items-center gap-4 pt-4">
                  {testimonial.image?.url ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-neutral-200">
                      <Image
                        src={testimonial.image.url}
                        alt={testimonial.image.alt ?? testimonial.author ?? ""}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}

                  <div>
                    {testimonial.author ? (
                      <p className="text-base font-semibold text-secondary-900">
                        {testimonial.author}
                      </p>
                    ) : null}
                    {testimonial.role || testimonial.company ? (
                      <p className="text-sm text-secondary-500">
                        {[testimonial.role, testimonial.company]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </div>

                  {testimonial.logo?.url ? (
                    <div className="ml-auto flex h-10 w-20 items-center justify-center">
                      <Image
                        src={testimonial.logo.url}
                        alt={testimonial.logo.alt ?? testimonial.company ?? ""}
                        width={testimonial.logo.width ?? 120}
                        height={testimonial.logo.height ?? 60}
                        sizes="80px"
                        className="h-10 w-auto object-contain opacity-80"
                      />
                    </div>
                  ) : null}
                </div>
              </CardTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
