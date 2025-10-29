import Link from "next/link";
import type { HeroSection as HeroSectionType } from "@/types/sanity";
import { cn } from "@/lib/utils/cn";

interface HeroSectionProps {
  section: HeroSectionType;
}

export default function HeroSection({ section }: HeroSectionProps) {
  const { eyebrow, heading, description, ctas, backgroundColor } = section;

  const backgroundClass = backgroundColor
    ? backgroundColor
    : "bg-gradient-to-b from-primary-50 to-white";

  return (
    <section className={cn(backgroundClass, "py-20 lg:py-32")}>
      <div className="container-custom">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              {eyebrow}
            </p>
          ) : null}

          {heading ? (
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-secondary-900 sm:text-6xl">
              {heading}
            </h1>
          ) : null}

          {description ? (
            <p className="mt-6 text-lg leading-8 text-secondary-600">
              {description}
            </p>
          ) : null}

          {ctas && ctas.length > 0 ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {ctas.map((cta) => (
                <CallToActionLink key={cta.label} {...cta} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

interface CallToActionLinkProps {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
  newTab?: boolean;
}

function CallToActionLink({
  label,
  href,
  variant = "primary",
  newTab,
}: CallToActionLinkProps) {
  const baseClass =
    "px-6 py-3 text-base font-medium transition-colors rounded-lg";

  const variantClasses: Record<string, string> = {
    primary: "btn-primary",
    secondary:
      "bg-secondary-900 text-white hover:bg-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600",
    outline: "btn-outline",
  };

  return (
    <Link
      href={href || "#"}
      className={cn(
        baseClass,
        variantClasses[variant] || variantClasses.primary
      )}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noreferrer" : undefined}
    >
      {label}
    </Link>
  );
}
