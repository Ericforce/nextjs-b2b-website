import Image from "next/image";
import type { TestimonialsSection as TestimonialsSectionType } from "@/types/sanity";
import { cn } from "@/lib/utils/cn";

interface TestimonialsSectionProps {
  section: TestimonialsSectionType;
}

export default function TestimonialsSection({
  section,
}: TestimonialsSectionProps) {
  const { title, description, testimonials, backgroundColor } = section;

  const backgroundClass = backgroundColor || "bg-neutral-50";

  return (
    <section className={cn(backgroundClass, "py-16 lg:py-24")}>
      <div className="container-custom">
        {title || description ? (
          <div className="mx-auto max-w-2xl text-center">
            {title ? (
              <h2 className="text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-lg text-secondary-600">{description}</p>
            ) : null}
          </div>
        ) : null}

        {testimonials && testimonials.length > 0 ? (
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._key}
                className="card flex flex-col justify-between"
              >
                {testimonial.quote ? (
                  <blockquote className="text-sm text-secondary-700">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                ) : null}
                <div className="mt-6 flex items-center gap-3">
                  {testimonial.avatar?.url ? (
                    <Image
                      src={testimonial.avatar.url}
                      alt={testimonial.avatar.alt || testimonial.author || ""}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-100"></div>
                  )}
                  <div>
                    {testimonial.author ? (
                      <p className="text-sm font-semibold text-secondary-900">
                        {testimonial.author}
                      </p>
                    ) : null}
                    {testimonial.role || testimonial.company ? (
                      <p className="text-xs text-secondary-600">
                        {[testimonial.role, testimonial.company]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
