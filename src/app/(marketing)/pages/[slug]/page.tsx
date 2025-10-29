import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { getAllPages, getPageBySlug, slugToString } from "@/lib/sanity";
import {
  absoluteUrl,
  buildWebPageJsonLd,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";
import type { PortableTextValue } from "@/types";
import type { PortableTextBlock } from "sanity";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const documents = await getAllPages();
  return documents.map((page) => ({ slug: slugToString(page.slug) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  const pageSlug = slugToString(page.slug);

  return generatePageMetadata({
    title: page.title,
    description: page.description,
    seo: page.seo,
    canonicalPath: page.seo?.canonical ?? `/${pageSlug}`,
  });
}

export default async function MarketingPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  const { siteSettings } = await getMetadataDefaults();
  const pageSlug = slugToString(page.slug);
  const canonicalUrl = absoluteUrl(
    page.seo?.canonical ?? `/${pageSlug}`,
    siteSettings.siteUrl
  );
  const jsonLd = buildWebPageJsonLd(page, canonicalUrl, siteSettings);

  return (
    <>
      <Script {...jsonLdScriptProps(`page-jsonld-${pageSlug}`, jsonLd)} />
      <article className="container-custom mx-auto max-w-3xl py-16 lg:py-24">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-primary-600">
            Company
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
            {page.title}
          </h1>
          <p className="text-lg text-secondary-600">{page.description}</p>
        </header>

        <div className="mt-12 space-y-8">{renderPortableText(page.body)}</div>
      </article>
    </>
  );
}

function renderPortableText(body: string | PortableTextValue | undefined) {
  if (!body) {
    return null;
  }

  if (typeof body === "string") {
    const sections = body.split(/\n\n+/);

    return sections.map((section, index) => {
      const lines = section.split("\n").filter(Boolean);
      if (lines.length === 0) {
        return null;
      }

      const headingLine = lines[0];
      if (headingLine.startsWith("## ")) {
        const heading = headingLine.replace(/^##\s*/, "");
        const contentLines = lines.slice(1);
        const allListItems =
          contentLines.length > 0 &&
          contentLines.every((line) => line.trim().startsWith("- "));

        return (
          <section key={`${heading}-${index}`} className="space-y-4">
            <h2 className="text-2xl font-semibold text-secondary-900">
              {heading}
            </h2>
            {allListItems ? (
              <ul className="ml-6 list-disc space-y-2 text-secondary-600">
                {contentLines.map((line, lineIndex) => (
                  <li key={lineIndex}>{line.replace(/^[-*]\s*/, "")}</li>
                ))}
              </ul>
            ) : contentLines.length > 0 ? (
              <p className="text-secondary-600">
                {contentLines.join(" ").trim()}
              </p>
            ) : null}
          </section>
        );
      }

      if (lines.every((line) => line.trim().startsWith("- "))) {
        return (
          <ul
            key={`list-${index}`}
            className="ml-6 list-disc space-y-2 text-secondary-600"
          >
            {lines.map((line, lineIndex) => (
              <li key={lineIndex}>{line.replace(/^[-*]\s*/, "")}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={`paragraph-${index}`} className="text-secondary-600">
          {section.replace(/^##\s*/, "").trim()}
        </p>
      );
    });
  }

  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={key} className="ml-6 list-disc space-y-2 text-secondary-600">
          {listBuffer.map((item, idx) => (
            <li key={`${key}-${idx}`}>{item}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const toText = (block: PortableTextBlock) =>
    (block.children ?? [])
      .map((child) => ("text" in child ? child.text : ""))
      .join("")
      .trim();

  body.forEach((node, index) => {
    if (!node) return;

    if ((node as PortableTextBlock)._type === "block") {
      const blockNode = node as PortableTextBlock & {
        listItem?: string;
      };
      const text = toText(blockNode);
      if (blockNode.listItem === "bullet") {
        listBuffer.push(text);
        const next = body[index + 1] as PortableTextBlock | undefined;
        const nextIsBullet =
          next?._type === "block" && (next as PortableTextBlock & { listItem?: string }).listItem === "bullet";
        if (!nextIsBullet) {
          flushList(`list-${index}`);
        }
        return;
      }

      flushList(`list-${index}`);

      switch (blockNode.style) {
        case "h2":
          elements.push(
            <h2 key={`h2-${index}`} className="text-2xl font-semibold text-secondary-900">
              {text}
            </h2>
          );
          break;
        case "h3":
          elements.push(
            <h3 key={`h3-${index}`} className="text-xl font-semibold text-secondary-900">
              {text}
            </h3>
          );
          break;
        case "blockquote":
          elements.push(
            <blockquote
              key={`quote-${index}`}
              className="border-l-4 border-primary-200 pl-4 text-lg italic text-secondary-700"
            >
              {text}
            </blockquote>
          );
          break;
        default:
          elements.push(
            <p key={`paragraph-${index}`} className="text-secondary-600">
              {text}
            </p>
          );
      }

      return;
    }

    if ((node as { _type?: string })._type === "callout") {
      flushList(`callout-${index}`);
      const callout = node as PortableTextValue[number] & {
        tone?: string;
        title?: string;
        body?: string;
      };
      const tone = callout.tone ?? "info";
      const styles: Record<string, string> = {
        info: "border-blue-200 bg-blue-50 text-blue-900",
        success: "border-green-200 bg-green-50 text-green-900",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
        danger: "border-red-200 bg-red-50 text-red-900",
      };
      elements.push(
        <div
          key={`callout-${index}`}
          className={`rounded-md border-l-4 p-4 ${styles[tone] ?? styles.info}`}
        >
          {callout.title ? (
            <h3 className="font-semibold">{callout.title}</h3>
          ) : null}
          {callout.body ? <p className="mt-1 text-sm">{callout.body}</p> : null}
        </div>
      );
      return;
    }

    if ((node as { _type?: string })._type === "image") {
      flushList(`image-${index}`);
      const image = node as PortableTextValue[number] & {
        url?: string;
        alt?: string;
        caption?: string;
      };
      if (image.url) {
        elements.push(
          <figure key={`image-${index}`} className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt ?? ""}
              className="w-full rounded-lg"
            />
            {image.caption ? (
              <figcaption className="text-sm text-secondary-500">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      }
    }
  });

  flushList("list-final");

  return elements.length > 0 ? elements : null;
}
