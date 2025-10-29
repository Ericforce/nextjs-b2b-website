import Link from "next/link";
import type { CallToActionSection as CallToActionSectionType } from "@/types/sanity";
import { cn } from "@/lib/utils/cn";

interface CallToActionSectionProps {
  section: CallToActionSectionType;
}

export default function CallToActionSection({
  section,
}: CallToActionSectionProps) {
  const { title, description, primaryCta, secondaryCta, backgroundColor } =
    section;

  const backgroundClass = backgroundColor || "bg-secondary-900";

  return (
    <section className={cn(backgroundClass, "py-16 lg:py-24")}>
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          {title ? (
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-lg text-secondary-300">{description}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {primaryCta ? <ActionButton cta={primaryCta} primary /> : null}
            {secondaryCta ? <ActionButton cta={secondaryCta} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionButton({
  cta,
  primary = false,
}: {
  cta: CallToActionSectionType["primaryCta"];
  primary?: boolean;
}) {
  if (!cta) {
    return null;
  }

  const { label, href, variant, newTab } = cta;

  const variantClass = primary
    ? "inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-medium text-secondary-900 shadow-sm transition-colors hover:bg-neutral-50"
    : variant === "outline"
      ? "inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 text-base font-medium text-white hover:bg-white hover:text-secondary-900 transition-colors"
      : "inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-500 transition-colors";

  return (
    <Link
      href={href || "#"}
      className={variantClass}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noreferrer" : undefined}
    >
      {label}
    </Link>
  );
}
