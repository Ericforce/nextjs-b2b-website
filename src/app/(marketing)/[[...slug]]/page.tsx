import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { SectionRenderer } from "@/components/sections";
import {
  DEFAULT_SANITY_REVALIDATE,
  getAllPages,
  getPageBySlug,
} from "@/lib/sanity";
import {
  absoluteUrl,
  buildHomePageJsonLd,
  buildWebPageJsonLd,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";

const HOME_SLUG = "home";
const RESERVED_SLUGS = new Set(["blog"]);

export const revalidate = DEFAULT_SANITY_REVALIDATE;

interface PageProps {
  params: {
    slug?: string[];
  };
}

function resolveSlug(slugSegments?: string[]): string {
  if (!slugSegments || slugSegments.length === 0) {
    return HOME_SLUG;
  }

  return slugSegments.filter(Boolean).join("/");
}

export async function generateStaticParams() {
  const pages = await getAllPages();

  return pages
    .filter((page) => Boolean(page.slug) && !RESERVED_SLUGS.has(page.slug))
    .map((page) => ({
      slug:
        page.slug === HOME_SLUG
          ? []
          : page.slug.split("/").filter((segment) => segment.length > 0),
    }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = resolveSlug(params.slug);
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return generatePageMetadata({
    title: page.title,
    description: page.description,
    seo: page.seo,
    canonicalPath: page.seo?.canonical ?? (page.slug === HOME_SLUG ? "/" : `/${page.slug}`),
  });
}

export default async function MarketingPage({ params }: PageProps) {
  const slug = resolveSlug(params.slug);
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const { siteSettings } = await getMetadataDefaults();

  const canonicalPath = page.seo?.canonical ?? (page.slug === HOME_SLUG ? "/" : `/${page.slug}`);
  const canonicalUrl = absoluteUrl(canonicalPath, siteSettings.siteUrl);
  const isHomePage = page.slug === HOME_SLUG;

  const jsonLdEntries = [
    {
      id: `page-jsonld-${page.slug}`,
      data: buildWebPageJsonLd(page, canonicalUrl, siteSettings),
    },
  ];

  if (isHomePage) {
    jsonLdEntries.unshift({
      id: "homepage-jsonld",
      data: buildHomePageJsonLd(siteSettings),
    });
  }

  return (
    <>
      {jsonLdEntries.map((entry) => (
        <Script key={entry.id} {...jsonLdScriptProps(entry.id, entry.data)} />
      ))}

      <article className="flex flex-col gap-0">
        <SectionRenderer sections={page.sections} />
      </article>
    </>
  );
}
