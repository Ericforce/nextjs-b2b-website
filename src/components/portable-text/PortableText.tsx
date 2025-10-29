import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/types";
import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
} from "@portabletext/react";

import { cn } from "@/lib/utils";

interface PortableTextProps {
  value?: PortableTextBlock[];
  className?: string;
  tone?: "light" | "dark";
}

type CalloutVariant =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "note"
  | "tip";

const CALLOUT_VARIANT_STYLES: Record<
  CalloutVariant,
  { icon: string; light: string; dark: string }
> = {
  info: {
    icon: "ℹ️",
    light: "border-primary-200 bg-primary-50 text-primary-900",
    dark: "border-primary-400/50 bg-primary-500/10 text-primary-100",
  },
  success: {
    icon: "✅",
    light: "border-emerald-200 bg-emerald-50 text-emerald-900",
    dark: "border-emerald-400/60 bg-emerald-500/10 text-emerald-100",
  },
  warning: {
    icon: "⚠️",
    light: "border-amber-200 bg-amber-50 text-amber-900",
    dark: "border-amber-400/60 bg-amber-500/10 text-amber-100",
  },
  danger: {
    icon: "⛔️",
    light: "border-red-200 bg-red-50 text-red-900",
    dark: "border-red-400/60 bg-red-500/10 text-red-100",
  },
  note: {
    icon: "📝",
    light: "border-secondary-200 bg-white text-secondary-800",
    dark: "border-white/20 bg-white/10 text-white",
  },
  tip: {
    icon: "💡",
    light: "border-accent-200 bg-accent-100 text-secondary-900",
    dark: "border-accent-300/60 bg-accent-200/10 text-accent-100",
  },
};

const CALLOUT_ALIAS_MAP: Record<string, CalloutVariant> = {
  info: "info",
  information: "info",
  success: "success",
  positive: "success",
  win: "success",
  warning: "warning",
  caution: "warning",
  danger: "danger",
  error: "danger",
  alert: "danger",
  note: "note",
  neutral: "note",
  tip: "tip",
  idea: "tip",
};

function resolveCalloutVariant(input?: string | null): CalloutVariant {
  if (!input) {
    return "info";
  }

  const normalized = input.toLowerCase();
  return CALLOUT_ALIAS_MAP[normalized] ?? "info";
}

function createPortableTextComponents(
  tone: "light" | "dark"
): PortableTextComponents {
  const headingColor = tone === "dark" ? "text-white" : "text-secondary-900";
  const bodyColor =
    tone === "dark" ? "text-secondary-200" : "text-secondary-600";
  const borderColor =
    tone === "dark" ? "border-secondary-700" : "border-primary-200";

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className={cn("text-base leading-7", bodyColor)}>{children}</p>
      ),
      h2: ({ children }) => (
        <h2 className={cn("text-2xl font-semibold sm:text-3xl", headingColor)}>
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className={cn("text-xl font-semibold sm:text-2xl", headingColor)}>
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className={cn("text-lg font-semibold", headingColor)}>
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5 className={cn("text-base font-semibold", headingColor)}>
          {children}
        </h5>
      ),
      h6: ({ children }) => (
        <h6 className={cn("text-sm font-semibold", headingColor)}>
          {children}
        </h6>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className={cn(
            "border-l-4 pl-4 italic",
            borderColor,
            tone === "dark" ? "text-secondary-100" : "text-secondary-700"
          )}
        >
          {children}
        </blockquote>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const href =
          value?.href ??
          (typeof value?.slug === "string"
            ? value.slug === "home"
              ? "/"
              : `/${value.slug}`
            : value?.slug?.current
              ? value.slug.current === "home"
                ? "/"
                : `/${value.slug.current}`
              : "#");

        if (!href || href === "#") {
          return <>{children}</>;
        }

        const isExternal = /^https?:\/\//.test(href);

        return (
          <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={cn(
              "font-medium underline-offset-2 transition-colors",
              tone === "dark"
                ? "text-primary-200 hover:text-white"
                : "text-primary-600 hover:text-primary-700"
            )}
          >
            {children}
          </Link>
        );
      },
      strong: ({ children }) => (
        <strong className={cn("font-semibold", headingColor)}>
          {children}
        </strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code
          className={cn(
            "rounded-md px-2 py-1 text-sm",
            tone === "dark"
              ? "bg-secondary-800 text-secondary-100"
              : "bg-secondary-100 text-secondary-800"
          )}
        >
          {children}
        </code>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={cn("ml-6 list-disc space-y-2", bodyColor)}>
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className={cn("ml-6 list-decimal space-y-2", bodyColor)}>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="leading-7">
          <span className={bodyColor}>{children}</span>
        </li>
      ),
      number: ({ children }) => (
        <li className="leading-7">
          <span className={bodyColor}>{children}</span>
        </li>
      ),
    },
  } as PortableTextComponents;

  components.types = {
    callout: ({ value }) => {
      const variant = resolveCalloutVariant(
        (value as { tone?: string; variant?: string; type?: string })?.tone ??
          (value as { variant?: string; type?: string })?.variant ??
          (value as { type?: string })?.type
      );

      const styles = CALLOUT_VARIANT_STYLES[variant];
      const containerClass = tone === "dark" ? styles.dark : styles.light;
      const bodyBlocks = (value as { body?: PortableTextBlock[] })?.body;
      const contentBlocks = Array.isArray(bodyBlocks)
        ? bodyBlocks
        : (value as { content?: PortableTextBlock[] })?.content;

      const fallbackText =
        (value as { text?: string; description?: string })?.text ??
        (value as { description?: string })?.description;

      return (
        <div
          className={cn(
            "flex gap-4 rounded-2xl border p-5 sm:p-6",
            containerClass
          )}
        >
          <span className="text-2xl" aria-hidden="true">
            {(value as { icon?: string })?.icon ?? styles.icon}
          </span>
          <div className="space-y-2">
            {(value as { title?: string })?.title ? (
              <p className={cn("text-base font-semibold", headingColor)}>
                {(value as { title?: string })?.title}
              </p>
            ) : null}

            {contentBlocks && contentBlocks.length > 0 ? (
              <PortableTextRenderer
                value={contentBlocks}
                components={components}
              />
            ) : fallbackText ? (
              <p className={cn("text-base leading-7", bodyColor)}>
                {fallbackText}
              </p>
            ) : null}
          </div>
        </div>
      );
    },
    code: ({ value }) => (
      <pre
        className={cn(
          "overflow-x-auto rounded-2xl p-4 text-sm leading-6",
          tone === "dark"
            ? "bg-secondary-900 text-secondary-100"
            : "bg-neutral-900 text-neutral-50"
        )}
      >
        <code>{(value as { code?: string })?.code}</code>
      </pre>
    ),
  };

  return components;
}

export function PortableText({
  value,
  className,
  tone = "light",
}: PortableTextProps) {
  if (!value || value.length === 0) {
    return null;
  }

  const components = createPortableTextComponents(tone);

  return (
    <div className={cn("space-y-6", className)}>
      <PortableTextRenderer value={value} components={components} />
    </div>
  );
}
