import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type {
  PortableTextBlock,
  PortableTextMarkComponentProps,
  PortableTextListComponentProps,
} from "@portabletext/types";
import Image from "next/image";
import Link from "next/link";
import type { SanityImage } from "@/types/blog";
import { urlForImage } from "@/lib/sanity";
import { slugify } from "@/lib/utils";

interface PortableTextRendererProps {
  value?: PortableTextBlock[];
}

const getTextFromBlock = (block?: PortableTextBlock): string => {
  if (!block) {
    return "";
  }

  const children = (block as { children?: Array<{ text?: string }> }).children ?? [];
  return children
    .map((child) => child?.text ?? "")
    .join(" ")
    .trim();
};

const LinkMark = ({ value, children }: PortableTextMarkComponentProps) => {
  const href = (value as { href?: string })?.href || "#";
  const isExternal = /^https?:\/\//.test(href);

  return (
    <Link
      href={href}
      className="font-semibold text-primary-600 underline-offset-4 transition-colors hover:text-primary-700 hover:underline"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-lg leading-7 text-secondary-700">{children}</p>
    ),
    h2: ({ children, value }) => {
      const text = getTextFromBlock(value as PortableTextBlock);
      const id = slugify(text || (value as { _key?: string })._key || "heading");

      return (
        <h2
          id={id}
          className="group scroll-mt-32 text-3xl font-semibold tracking-tight text-secondary-900"
        >
          <a href={`#${id}`} className="transition-colors hover:text-primary-600">
            {children}
            <span className="ml-2 hidden text-primary-600 group-hover:inline">
              #
            </span>
          </a>
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const text = getTextFromBlock(value as PortableTextBlock);
      const id = slugify(text || (value as { _key?: string })._key || "subheading");

      return (
        <h3
          id={id}
          className="group scroll-mt-32 text-2xl font-semibold tracking-tight text-secondary-900"
        >
          <a href={`#${id}`} className="transition-colors hover:text-primary-600">
            {children}
            <span className="ml-2 hidden text-primary-600 group-hover:inline">
              #
            </span>
          </a>
        </h3>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-200 pl-6 text-lg italic text-secondary-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: PortableTextListComponentProps) => (
      <ul className="list-disc space-y-2 pl-6 text-lg text-secondary-700">
        {children}
      </ul>
    ),
    number: ({ children }: PortableTextListComponentProps) => (
      <ol className="list-decimal space-y-2 pl-6 text-lg text-secondary-700">
        {children}
      </ol>
    ),
  },
  marks: {
    em: ({ children }) => <em className="italic text-secondary-600">{children}</em>,
    strong: ({ children }) => <strong className="font-semibold text-secondary-900">{children}</strong>,
    code: ({ children }) => (
      <code className="rounded bg-secondary-100 px-1.5 py-0.5 text-sm font-mono text-secondary-700">
        {children}
      </code>
    ),
    link: LinkMark,
  },
  types: {
    image: ({ value }) => {
      const image = value as SanityImage;
      const builder = urlForImage(image);
      const imageUrl = builder
        ?.width(1400)
        .fit("max")
        .auto("format")
        .url();

      if (!imageUrl) {
        return null;
      }

      const metadata = image?.asset?.metadata ?? image?.metadata;
      const width = metadata?.dimensions?.width ?? 1400;
      const aspectRatio = metadata?.dimensions?.aspectRatio ?? 1.6;
      const height = metadata?.dimensions?.height ?? Math.round(width / aspectRatio);

      return (
        <figure className="overflow-hidden rounded-3xl border border-neutral-200">
          <Image
            src={imageUrl}
            alt={image?.alt || "Blog post image"}
            width={width}
            height={height}
            sizes="(min-width: 1024px) 900px, 100vw"
            className="h-auto w-full object-cover"
          />
          {image?.caption ? (
            <figcaption className="px-6 py-3 text-sm text-secondary-500">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    code: ({ value }) => {
      const codeValue = value as { language?: string; code?: string };
      return (
        <pre className="overflow-x-auto rounded-2xl bg-secondary-900 p-6 text-sm text-secondary-100">
          <code className="font-mono">
            {codeValue.code}
          </code>
        </pre>
      );
    },
    callout: ({ value, children }) => {
      const calloutValue = value as { tone?: string; title?: string };
      const tone = calloutValue.tone ?? "info";

      const toneStyles: Record<string, string> = {
        info: "border-primary-200 bg-primary-50 text-primary-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        danger: "border-rose-200 bg-rose-50 text-rose-700",
      };

      const style = toneStyles[tone] ?? toneStyles.info;

      return (
        <div className={`rounded-3xl border px-6 py-5 text-base ${style}`}>
          {calloutValue.title ? (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide">
              {calloutValue.title}
            </p>
          ) : null}
          <div className="space-y-2 text-base text-current">
            {children}
          </div>
        </div>
      );
    },
  },
};

export default function PortableTextRenderer({
  value = [],
}: PortableTextRendererProps) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className="prose prose-lg prose-slate max-w-none space-y-6">
      <PortableText value={value} components={components} />
    </div>
  );
}
