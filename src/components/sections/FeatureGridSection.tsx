import Image from "next/image";

import { cn } from "@/lib/utils";
import type { FeatureGridSection as FeatureGridSectionType } from "@/types";

import { resolveSectionBackground } from "./utils";

export function FeatureGridSection(section: FeatureGridSectionType) {
  const { anchor, headline, description, features, columns, backgroundColor } =
    section;

  const palette = resolveSectionBackground(backgroundColor);

  const gridColumns = (() => {
    if (columns === 4) {
      return "md:grid-cols-2 lg:grid-cols-4";
    }

    if (columns === 2) {
      return "md:grid-cols-2";
    }

    return "md:grid-cols-2 lg:grid-cols-3";
  })();

  return (
    <section
      id={anchor || undefined}
      className={cn(palette.container, "py-16 sm:py-20 lg:py-24")}
    >
      <div className="container-custom">
        <div className="mx-auto max-w-3xl text-center">
          {headline ? (
            <h2 className={cn("text-3xl font-semibold sm:text-4xl", palette.heading)}>
              {headline}
            </h2>
          ) : null}
          {description ? (
            <p className={cn("mt-4 text-lg", palette.body)}>{description}</p>
          ) : null}
        </div>

        {features && features.length > 0 ? (
          <div className={cn("mt-12 grid grid-cols-1 gap-8", gridColumns)}>
            {features.map((feature, index) => {
              const key = feature._key ?? `${feature.title ?? "feature"}-${index}`;
              return (
                <div
                  key={key}
                  className={cn(
                    "flex h-full flex-col gap-4 rounded-2xl border p-6 shadow-soft transition",
                    palette.isDark
                      ? "border-white/10 bg-secondary-900/40 backdrop-blur"
                      : "border-neutral-200 bg-white"
                  )}
                >
                  {feature.image?.url ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                      <Image
                        src={feature.image.url}
                        alt={feature.image.alt ?? feature.title ?? ""}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                  ) : feature.icon ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                      <span className="text-xl font-semibold">
                        {feature.icon}
                      </span>
                    </div>
                  ) : null}

                  {feature.title ? (
                    <h3
                      className={cn(
                        "text-xl font-semibold",
                        palette.isDark ? "text-white" : "text-secondary-900"
                      )}
                    >
                      {feature.title}
                    </h3>
                  ) : null}

                  {feature.description ? (
                    <p
                      className={cn(
                        "text-base leading-7",
                        palette.isDark ? "text-secondary-200" : "text-secondary-600"
                      )}
                    >
                      {feature.description}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
