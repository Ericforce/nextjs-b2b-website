import Image from "next/image";

import { cn } from "@/lib/utils";
import type { HeroSection as HeroSectionType } from "@/types";

import {
  CtaLink,
  resolveAlignment,
  resolveSectionBackground,
} from "./utils";

export function HeroSection(section: HeroSectionType) {
  const {
    anchor,
    eyebrow,
    headline,
    subheadline,
    tagline,
    description,
    alignment,
    backgroundColor,
    backgroundImage,
    mediaImage,
    primaryCta,
    secondaryCta,
  } = section;

  const palette = resolveSectionBackground(backgroundColor);
  const hasMedia = Boolean(mediaImage?.url);
  const resolvedAlignment = alignment ?? (hasMedia ? "left" : "center");
  const align = resolveAlignment(resolvedAlignment);

  return (
    <section
      id={anchor || undefined}
      className={cn(
        "relative overflow-hidden",
        palette.container,
        "py-20 sm:py-24 lg:py-32"
      )}
    >
      {backgroundImage?.url ? (
        <div className="absolute inset-0 -z-10">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-secondary-900/60" />
        </div>
      ) : null}

      <div className="container-custom">
        <div
          className={cn(
            "flex flex-col gap-12",
            hasMedia
              ? "lg:grid lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)] lg:items-center lg:gap-16"
              : ""
          )}
        >
          <div
            className={cn(
              "flex flex-col space-y-6",
              align.container,
              hasMedia ? "max-w-2xl" : "max-w-3xl",
              !hasMedia && resolvedAlignment === "center"
                ? "mx-auto"
                : !hasMedia && resolvedAlignment === "right"
                ? "ml-auto"
                : ""
            )}
          >
            {eyebrow ? (
              <p
                className={cn(
                  "text-sm font-semibold uppercase tracking-[0.35em]",
                  palette.eyebrow
                )}
              >
                {eyebrow}
              </p>
            ) : null}

            {headline ? (
              <h1
                className={cn(
                  "text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
                  palette.heading,
                  align.container.includes("text-center") ? "mx-auto" : ""
                )}
              >
                {headline}
              </h1>
            ) : null}

            {subheadline ? (
              <p
                className={cn(
                  "text-xl leading-8 sm:text-2xl",
                  palette.body,
                  align.content,
                  hasMedia ? "max-w-xl" : "max-w-3xl"
                )}
              >
                {subheadline}
              </p>
            ) : null}

            {tagline ? (
              <p
                className={cn(
                  "text-sm font-medium uppercase tracking-[0.3em]",
                  palette.muted,
                  align.content
                )}
              >
                {tagline}
              </p>
            ) : null}

            {description ? (
              <p
                className={cn(
                  "text-base leading-7 sm:text-lg",
                  palette.body,
                  align.content,
                  "max-w-2xl"
                )}
              >
                {description}
              </p>
            ) : null}

            {primaryCta || secondaryCta ? (
              <div
                className={cn(
                  "mt-4 flex flex-wrap gap-4",
                  align.actions
                )}
              >
                <CtaLink
                  cta={primaryCta ?? undefined}
                  tone={palette.isDark ? "dark" : "light"}
                />
                <CtaLink
                  cta={secondaryCta ?? undefined}
                  tone={palette.isDark ? "dark" : "light"}
                  className="min-w-[8rem]"
                />
              </div>
            ) : null}
          </div>

          {hasMedia ? (
            <div className="relative">
              <div className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-large backdrop-blur">
                <Image
                  src={mediaImage!.url}
                  alt={mediaImage!.alt ?? headline ?? ""}
                  width={mediaImage!.width ?? 1200}
                  height={mediaImage!.height ?? 900}
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
