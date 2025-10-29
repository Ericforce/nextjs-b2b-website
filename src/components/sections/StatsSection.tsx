import { cn } from "@/lib/utils";
import type { StatsSection as StatsSectionType } from "@/types";

import { resolveSectionBackground } from "./utils";

export function StatsSection(section: StatsSectionType) {
  const { anchor, headline, description, stats } = section;
  const backgroundColor = (section as { backgroundColor?: string | null })
    .backgroundColor;

  if (!stats || stats.length === 0) {
    return null;
  }

  const palette = resolveSectionBackground(backgroundColor);

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
          {description ? (
            <p className={cn("mt-4 text-lg", palette.body)}>{description}</p>
          ) : null}
        </div>

        <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const key = stat._key ?? `${stat.label ?? "stat"}-${index}`;
            return (
              <div
                key={key}
                className={cn(
                  "rounded-2xl border p-6 text-center",
                  palette.isDark
                    ? "border-white/10 bg-secondary-900/40"
                    : "border-neutral-200 bg-white"
                )}
              >
                {stat.icon ? (
                  <div className="mb-3 flex justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl text-primary-700">
                      {stat.icon}
                    </span>
                  </div>
                ) : null}

                {stat.value ? (
                  <dd
                    className={cn(
                      "text-3xl font-semibold",
                      palette.isDark ? "text-white" : "text-secondary-900"
                    )}
                  >
                    {stat.value}
                  </dd>
                ) : null}
                {stat.label ? (
                  <dt
                    className={cn(
                      "mt-2 text-sm uppercase tracking-wider",
                      palette.isDark
                        ? "text-secondary-300"
                        : "text-secondary-500"
                    )}
                  >
                    {stat.label}
                  </dt>
                ) : null}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
