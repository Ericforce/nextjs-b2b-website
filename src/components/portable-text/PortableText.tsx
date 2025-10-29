import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/types";
import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
} from "@portabletext/react";

import { cn } from "@/lib/utils/cn";

interface PortableTextProps {
  value?: PortableTextBlock[];
  className?: string;
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-secondary-900 sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-secondary-900 sm:text-2xl">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-7 text-secondary-600">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-200 pl-4 italic text-secondary-700">
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
          className="font-medium text-primary-600 underline-offset-2 transition-colors hover:text-primary-700 hover:underline"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-secondary-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-6 list-disc space-y-2 text-secondary-600">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="ml-6 list-decimal space-y-2 text-secondary-600">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
};

export function PortableText({ value, className }: PortableTextProps) {
  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <PortableTextRenderer value={value} components={components} />
    </div>
  );
}
