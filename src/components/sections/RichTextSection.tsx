import { cn } from "@/lib/utils";
import type { RichTextSection as RichTextSectionType } from "@/types";

import { PortableText } from "@/components/portable-text";

import { resolveSectionBackground } from "./utils";

const WIDTH_CLASS_MAP: Record<string, string> = {
  narrow: "max-w-2xl",
  medium: "max-w-3xl",
  full: "max-w-5xl",
};

export function RichTextSection(section: RichTextSectionType) {
  const { anchor, headline, content, width, backgroundColor } = section;

  if (!content || content.length === 0) {
    return null;
  }

  const palette = resolveSectionBackground(backgroundColor);
  const widthClass = WIDTH_CLASS_MAP[width ?? "medium"] ?? WIDTH_CLASS_MAP.medium;

  return (
    <section
      id={anchor || undefined}
      className={cn(palette.container, "py-16 sm:py-20 lg:py-24")}
    >
      <div className="container-custom">
        <div className={cn("mx-auto flex flex-col gap-6", widthClass)}>
          {headline ? (
            <h2 className={cn("text-3xl font-semibold sm:text-4xl", palette.heading)}>
              {headline}
            </h2>
          ) : null}

          <PortableText
            value={content}
            className={palette.body}
            tone={palette.isDark ? "dark" : "light"}
          />
        </div>
      </div>
    </section>
  );
}
