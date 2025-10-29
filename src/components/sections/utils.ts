import Link from "next/link";

import { cn } from "@/lib/utils";
import type { CallToAction } from "@/types";

export interface SectionBackgroundPalette {
  container: string;
  heading: string;
  body: string;
  eyebrow: string;
  muted: string;
  border: string;
  isDark: boolean;
}

const SECTION_BACKGROUND_MAP: Record<string, SectionBackgroundPalette> = {
  default: {
    container: "bg-white",
    heading: "text-secondary-900",
    body: "text-secondary-600",
    eyebrow: "text-primary-600",
    muted: "text-secondary-500",
    border: "border-neutral-200",
    isDark: false,
  },
  light: {
    container: "bg-neutral-50",
    heading: "text-secondary-900",
    body: "text-secondary-600",
    eyebrow: "text-primary-600",
    muted: "text-secondary-500",
    border: "border-neutral-200",
    isDark: false,
  },
  soft: {
    container: "bg-gradient-to-b from-primary-50/60 via-white to-white",
    heading: "text-secondary-900",
    body: "text-secondary-600",
    eyebrow: "text-primary-600",
    muted: "text-secondary-500",
    border: "border-primary-100",
    isDark: false,
  },
  accent: {
    container: "bg-accent-100",
    heading: "text-secondary-900",
    body: "text-secondary-700",
    eyebrow: "text-accent-700",
    muted: "text-secondary-600",
    border: "border-accent-200",
    isDark: false,
  },
  primary: {
    container: "bg-primary-600",
    heading: "text-white",
    body: "text-primary-100",
    eyebrow: "text-white/80",
    muted: "text-primary-100",
    border: "border-primary-500",
    isDark: true,
  },
  dark: {
    container: "bg-secondary-900",
    heading: "text-white",
    body: "text-secondary-300",
    eyebrow: "text-primary-200",
    muted: "text-secondary-400",
    border: "border-secondary-700",
    isDark: true,
  },
};

const SECTION_BACKGROUND_ALIASES: Record<string, keyof typeof SECTION_BACKGROUND_MAP> = {
  default: "default",
  white: "default",
  "bg-white": "default",
  light: "light",
  "neutral": "light",
  "neutral-50": "light",
  "bg-neutral-50": "light",
  subtle: "soft",
  gradient: "soft",
  "primary-50": "soft",
  "primary-100": "soft",
  "bg-primary-50": "soft",
  accent: "accent",
  "accent-100": "accent",
  primary: "primary",
  "primary-600": "primary",
  "primary-dark": "primary",
  "bg-primary-600": "primary",
  dark: "dark",
  secondary: "dark",
  "secondary-dark": "dark",
  "secondary-900": "dark",
  "bg-secondary-900": "dark",
};

export function resolveSectionBackground(
  backgroundColor?: string | null
): SectionBackgroundPalette {
  if (!backgroundColor) {
    return SECTION_BACKGROUND_MAP.default;
  }

  const normalized = backgroundColor.trim().toLowerCase();

  if (SECTION_BACKGROUND_MAP[normalized]) {
    return SECTION_BACKGROUND_MAP[normalized];
  }

  const alias = SECTION_BACKGROUND_ALIASES[normalized];
  if (alias) {
    return SECTION_BACKGROUND_MAP[alias];
  }

  return SECTION_BACKGROUND_MAP.default;
}

export interface AlignmentClasses {
  container: string;
  content: string;
  actions: string;
}

export function resolveAlignment(
  alignment?: "left" | "center" | "right" | null
): AlignmentClasses {
  switch (alignment) {
    case "center":
      return {
        container: "items-center text-center",
        content: "mx-auto",
        actions: "justify-center",
      };
    case "right":
      return {
        container: "items-end text-right",
        content: "ml-auto",
        actions: "justify-end",
      };
    default:
      return {
        container: "items-start text-left",
        content: "",
        actions: "justify-start",
      };
  }
}

const CTA_VARIANT_CLASSES: Record<
  "primary" | "secondary" | "ghost" | "link",
  { light: string; dark: string }
> = {
  primary: {
    light: "btn-primary text-base",
    dark: "inline-flex items-center justify-center rounded-lg bg-white px-6 py-2.5 text-base font-semibold text-secondary-900 shadow-sm transition-colors hover:bg-neutral-100",
  },
  secondary: {
    light: "btn-secondary text-base",
    dark: "inline-flex items-center justify-center rounded-lg border border-white/40 px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-white/10",
  },
  ghost: {
    light: "inline-flex items-center justify-center rounded-lg border border-secondary-300 px-6 py-2.5 text-base font-medium text-secondary-700 transition-colors hover:bg-secondary-50",
    dark: "inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-white/10",
  },
  link: {
    light: "inline-flex items-center gap-2 text-base font-medium text-primary-600 transition-colors hover:text-primary-700",
    dark: "inline-flex items-center gap-2 text-base font-medium text-primary-100 transition-colors hover:text-white",
  },
};

interface CtaLinkProps {
  cta?: CallToAction | null;
  className?: string;
  tone?: "light" | "dark";
}

export function CtaLink({
  cta,
  className,
  tone = "light",
}: CtaLinkProps): JSX.Element | null {
  if (!cta || !cta.href || !cta.label) {
    return null;
  }

  const variant = (cta.variant ?? "primary") as keyof typeof CTA_VARIANT_CLASSES;
  const variantClasses = CTA_VARIANT_CLASSES[variant] ?? CTA_VARIANT_CLASSES.primary;
  const baseClass = tone === "dark" ? variantClasses.dark : variantClasses.light;

  return (
    <Link
      href={cta.href}
      prefetch={false}
      className={cn(baseClass, className)}
      target={cta.openInNewTab ? "_blank" : undefined}
      rel={cta.openInNewTab ? "noopener noreferrer" : undefined}
    >
      {cta.label}
    </Link>
  );
}
