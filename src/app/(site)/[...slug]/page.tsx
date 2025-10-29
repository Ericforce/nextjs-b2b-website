import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import {
  fetchPageBySlug,
  fetchPagePaths,
  fetchReusableSections,
} from "@/lib/sanity/api/page";
import { resolvePageSections } from "@/lib/sanity/api/sections";
import { buildMetadataForSlug } from "../page-metadata";

const FALLBACK_SLUG = "index";
const PAGE_REVALIDATE_SECONDS = 60;

function normalizeSlug(slugParam?: string[]): string {
  if (!slugParam || slugParam.length === 0) {
    return FALLBACK_SLUG;
  }

  return slugParam.join("/");
}

export async function generateStaticParams() {
  const paths = await fetchPagePaths();
  const uniqueSlugs = new Set<string>();

  paths.forEach(({ slug }) => {
    if (slug) {
      uniqueSlugs.add(slug === FALLBACK_SLUG ? "" : slug);
    }
  });

  if (!uniqueSlugs.has("")) {
    uniqueSlugs.add("");
  }

  return Array.from(uniqueSlugs).map((slug) => ({
    slug: slug ? slug.split("/") : undefined,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Promise<Metadata> {
  const slug = normalizeSlug(params.slug);
  return buildMetadataForSlug(slug);
}

export const revalidate = PAGE_REVALIDATE_SECONDS;

export default async function DynamicSitePage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slug = normalizeSlug(params.slug);
  const { isEnabled } = draftMode();

  const [page, reusableSections] = await Promise.all([
    fetchPageBySlug(slug, isEnabled),
    fetchReusableSections(isEnabled),
  ]);

  if (!page) {
    notFound();
  }

  const sections = resolvePageSections(page, reusableSections);

  if (!sections || sections.length === 0) {
    notFound();
  }

  return <SectionRenderer sections={sections} />;
}
