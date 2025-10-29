import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { getAllPages, getPageBySlug } from "@/lib/sanity";
import {
  absoluteUrl,
  buildWebPageJsonLd,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const documents = await getAllPages();
  return documents.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return generatePageMetadata({
    title: page.title,
    description: page.description,
    seo: page.seo,
    canonicalPath: page.seo?.canonical ?? `/${page.slug}`,
  });
}

export default async function MarketingPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  const { siteSettings } = await getMetadataDefaults();
  const canonicalUrl = absoluteUrl(
    page.seo?.canonical ?? `/${page.slug}`,
    siteSettings.siteUrl
  );
  const jsonLd = buildWebPageJsonLd(page, canonicalUrl, siteSettings);

  return (
    <>
      <Script {...jsonLdScriptProps(`page-jsonld-${page.slug}`, jsonLd)} />
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

function renderPortableText(body: string) {
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
