import { cn } from "@/lib/utils";
import type { FaqSection as FaqSectionType } from "@/types";

import { PortableText } from "@/components/portable-text";

import { resolveSectionBackground } from "./utils";

export function FaqSection(section: FaqSectionType) {
  const { anchor, headline, faqs, layout } = section;
  const backgroundColor = (section as { backgroundColor?: string | null })
    .backgroundColor;

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const palette = resolveSectionBackground(backgroundColor);
  const isTwoColumn = layout === "two-column";

  return (
    <section
      id={anchor || undefined}
      className={cn(palette.container, "py-16 sm:py-20 lg:py-24")}
    >
      <div className="container-custom">
        <div className="mx-auto max-w-3xl text-center">
          {headline ? (
            <h2
              className={cn(
                "text-3xl font-semibold sm:text-4xl",
                palette.heading
              )}
            >
              {headline}
            </h2>
          ) : null}
        </div>

        <div
          className={cn(
            "mt-12 grid gap-6",
            isTwoColumn ? "md:grid-cols-2" : "grid-cols-1"
          )}
        >
          {faqs.map((item, index) => {
            const key = item._key ?? `${item.question ?? "faq"}-${index}`;

            return (
              <details
                key={key}
                className={cn(
                  "group rounded-2xl border bg-white/95 p-6 shadow-soft transition",
                  palette.isDark
                    ? "border-white/10 bg-secondary-900/40"
                    : "border-neutral-200"
                )}
              >
                <summary
                  className={cn(
                    "cursor-pointer text-lg font-semibold leading-snug outline-none transition focus-visible:ring-2 focus-visible:ring-primary-500",
                    palette.isDark ? "text-white" : "text-secondary-900"
                  )}
                >
                  {item.question}
                </summary>

                {item.answer && item.answer.length > 0 ? (
                  <div className="mt-4">
                    <PortableText
                      value={item.answer}
                      tone={palette.isDark ? "dark" : "light"}
                    />
                  </div>
                ) : null}
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
