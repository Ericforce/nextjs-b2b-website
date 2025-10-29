import { cn } from "@/lib/utils";
import type { CallToActionSection as CallToActionSectionType } from "@/types";

import {
  CtaLink,
  resolveAlignment,
  resolveSectionBackground,
} from "./utils";

export function CallToActionSection(section: CallToActionSectionType) {
  const {
    anchor,
    headline,
    description,
    alignment,
    backgroundColor,
    primaryCta,
    secondaryCta,
  } = section;

  const palette = resolveSectionBackground(backgroundColor);
  const align = resolveAlignment(alignment);

  return (
    <section
      id={anchor || undefined}
      className={cn(palette.container, "py-16 sm:py-20 lg:py-24")}
    >
      <div className="container-custom">
        <div
          className={cn(
            "mx-auto flex max-w-4xl flex-col space-y-6",
            align.container
          )}
        >
          {headline ? (
            <h2 className={cn("text-3xl font-semibold sm:text-4xl", palette.heading)}>
              {headline}
            </h2>
          ) : null}

          {description ? (
            <p className={cn("text-lg", palette.body)}>{description}</p>
          ) : null}

          {primaryCta || secondaryCta ? (
            <div className={cn("flex flex-wrap gap-4", align.actions)}>
              <CtaLink
                cta={primaryCta ?? undefined}
                tone={palette.isDark ? "dark" : "light"}
              />
              <CtaLink
                cta={secondaryCta ?? undefined}
                tone={palette.isDark ? "dark" : "light"}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
