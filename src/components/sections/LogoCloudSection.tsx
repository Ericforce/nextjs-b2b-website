import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { LogoCloudSection as LogoCloudSectionType } from "@/types";

import { resolveSectionBackground } from "./utils";

export function LogoCloudSection(section: LogoCloudSectionType) {
  const { anchor, headline, logos, grayscale } = section;
  const backgroundColor = (section as { backgroundColor?: string | null })
    .backgroundColor;

  if (!logos || logos.length === 0) {
    return null;
  }

  const palette = resolveSectionBackground(backgroundColor);

  return (
    <section
      id={anchor || undefined}
      className={cn(palette.container, "py-16 sm:py-20 lg:py-24")}
    >
      <div className="container-custom">
        {headline ? (
          <h2 className={cn("text-center text-2xl font-semibold sm:text-3xl", palette.heading)}>
            {headline}
          </h2>
        ) : null}

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((logo, index) => {
            const key = logo._key ?? `${logo.image?.url ?? "logo"}-${index}`;
            if (!logo.image?.url) {
              return null;
            }

            const image = (
              <Image
                src={logo.image.url}
                alt={logo.image.alt ?? ""}
                width={logo.image.width ?? 180}
                height={logo.image.height ?? 90}
                className={cn(
                  "h-12 w-full object-contain opacity-80 transition hover:opacity-100",
                  grayscale ? "grayscale hover:grayscale-0" : ""
                )}
                sizes="(min-width: 1024px) 160px, 33vw"
              />
            );

            return (
              <div
                key={key}
                className="flex items-center justify-center rounded-xl border border-transparent bg-white/80 p-4 shadow-soft backdrop-blur"
              >
                {logo.href ? (
                  <Link
                    href={logo.href}
                    className="inline-flex items-center justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {image}
                  </Link>
                ) : (
                  image
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
