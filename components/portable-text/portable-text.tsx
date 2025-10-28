import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type {
  PortableTextBlock,
  PortableTextComponentProps,
  PortableTextMarkComponentProps
} from "@portabletext/react";
import clsx from "clsx";

import { urlForImage } from "@/lib/sanity/image";
import type { SanityImageValue } from "@/types/sanity";

interface PortableTextRendererProps {
  value: PortableTextBlock[];
  className?: string;
}

function PortableTextImage({ value }: PortableTextComponentProps<SanityImageValue>) {
  const image = value;

  if (!image?.asset) {
    return null;
  }

  const builder = urlForImage(image);

  if (!builder) {
    return null;
  }

  const width = image.asset.metadata?.dimensions?.width ?? 1200;
  const height = image.asset.metadata?.dimensions?.height ?? Math.round(width * 0.65);
  const src = builder.width(width).url();
  const blur = image.asset.metadata?.lqip;

  return (
    <figure className="portable-text__figure">
      <Image
        src={src}
        alt={image.alt || ""}
        width={width}
        height={height}
        sizes="(min-width: 768px) 768px, 100vw"
        className="portable-text__image"
        placeholder={blur ? "blur" : undefined}
        blurDataURL={blur}
      />
      {image.caption ? <figcaption className="portable-text__caption">{image.caption}</figcaption> : null}
    </figure>
  );
}

function PortableTextCallout({ value, children }: PortableTextComponentProps<{ tone?: string; title?: string }>) {
  const tone = value?.tone ?? "info";
  const title = value?.title;

  return (
    <aside className={`portable-text__callout portable-text__callout--${tone}`}>
      {title ? <p className="portable-text__callout-title">{title}</p> : null}
      <div className="portable-text__callout-body">{children}</div>
    </aside>
  );
}

function PortableTextCode({ value }: PortableTextComponentProps<{ language?: string; code: string }>) {
  if (!value?.code) return null;

  return (
    <pre className="portable-text__code" data-language={value.language}>
      <code>{value.code}</code>
    </pre>
  );
}

function PortableTextLink({ value, children }: PortableTextMarkComponentProps<{ href: string; openInNewTab?: boolean }>) {
  const href = value?.href || "#";
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const target = value?.openInNewTab || isExternal ? "_blank" : undefined;
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;

  return (
    <Link href={href} target={target} rel={rel} className="portable-text__link">
      {children}
    </Link>
  );
}

const components = {
  types: {
    image: PortableTextImage,
    callout: PortableTextCallout,
    code: PortableTextCode
  },
  block: {
    h1: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <h1 className="portable-text__h1">{children}</h1>,
    h2: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <h2 className="portable-text__h2">{children}</h2>,
    h3: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <h3 className="portable-text__h3">{children}</h3>,
    blockquote: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <blockquote className="portable-text__blockquote">{children}</blockquote>
    ),
    normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <p>{children}</p>
  },
  marks: {
    link: PortableTextLink
  },
  list: {
    bullet: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <ul className="portable-text__list portable-text__list--bullet">{children}</ul>
    ),
    number: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <ol className="portable-text__list portable-text__list--number">{children}</ol>
    )
  }
};

export function PortableTextRenderer({ value, className }: PortableTextRendererProps) {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  return (
    <div className={clsx("portable-text", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
